"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppSettings,
  ChatMessage,
  Conversation,
  ConversationGroup,
  MessageAttachment,
  ModelId,
} from "@/types";
import { DEMO_CONVERSATIONS } from "@/lib/demo-data";
import { createConversationTitle } from "@/lib/demo-chat";
import { demoAssistantClient } from "@/lib/assistant-client";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  persistSettings,
} from "@/lib/settings";
import { chunkForStream, createId } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: "neutral" | "positive" | "danger";
}

interface WorkspaceContextValue {
  /* conversations */
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  groupedConversations: Array<{
    group: ConversationGroup;
    label: string;
    items: Conversation[];
  }>;
  selectConversation: (id: string) => void;
  startNewChat: () => void;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  togglePin: (id: string) => void;
  sendMessage: (text: string, attachments: MessageAttachment[]) => void;
  retryResponse: (messageId: string) => void;
  stopResponse: () => void;
  isResponding: boolean;
  demoErrorNextResponse: boolean;
  setDemoErrorNextResponse: (value: boolean) => void;

  /* model */
  selectedModelId: ModelId;
  setSelectedModelId: (id: ModelId) => void;

  /* sidebar + search */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  /* settings */
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
  hydrated: boolean;

  /* toasts */
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const GROUP_LABELS: Record<ConversationGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  previous: "Previous",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function sortConversations(items: Conversation[]): Conversation[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function makeAssistantMessage(modelId: ModelId): ChatMessage {
  return {
    id: createId("msg"),
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
    modelId,
    status: "pending",
    simulated: true,
  };
}

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    sortConversations(DEMO_CONVERSATIONS),
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelIdState] = useState<ModelId>(
    DEFAULT_SETTINGS.defaultModelId,
  );
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [demoErrorNextResponse, setDemoErrorNextResponse] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamTargetRef = useRef<{ conversationId: string; messageId: string } | null>(
    null,
  );
  const attemptRef = useRef<Record<string, number>>({});
  const toastTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /* ---------------------------------------------------- hydration ---- */
  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    setSelectedModelIdState(stored.defaultModelId);
    if (stored.sidebarDefaultCollapsed) setSidebarCollapsed(true);
    setHydrated(true);
  }, []);

  /* ------------------------------------------------------- theming ---- */
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: light)");

    const apply = () => {
      const resolved =
        settings.theme === "system" ? (media.matches ? "light" : "dark") : settings.theme;
      root.dataset.theme = resolved;
      root.dataset.motion = settings.reduceMotion ? "reduced" : "full";
      root.dataset.reduceTransparency = settings.reduceTransparency ? "true" : "false";
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [settings.theme, settings.reduceMotion, settings.reduceTransparency]);

  /* ------------------------------------------------------ settings ---- */
  useEffect(() => {
    if (!hydrated) return;
    persistSettings(settings);
  }, [settings, hydrated]);

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((current) => ({ ...current, [key]: value }));
      if (key === "defaultModelId") {
        setSelectedModelIdState(value as ModelId);
      }
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setSelectedModelIdState(DEFAULT_SETTINGS.defaultModelId);
  }, []);

  const setSelectedModelId = useCallback((id: ModelId) => {
    setSelectedModelIdState(id);
    setSettings((current) => ({ ...current, defaultModelId: id }));
  }, []);

  /* --------------------------------------------------------- toasts --- */
  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = toastTimers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete toastTimers.current[id];
    }
  }, []);

  const pushToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = createId("toast");
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      toastTimers.current[id] = setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
        delete toastTimers.current[id];
      }, 3600);
    },
    [],
  );

  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  /* ------------------------------------------------- streaming demo --- */
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const patchMessage = useCallback(
    (
      conversationId: string,
      messageId: string,
      patch: Partial<ChatMessage> | ((message: ChatMessage) => Partial<ChatMessage>),
    ) => {
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== conversationId) return conversation;
          return {
            ...conversation,
            updatedAt: new Date().toISOString(),
            messages: conversation.messages.map((message) => {
              if (message.id !== messageId) return message;
              const next = typeof patch === "function" ? patch(message) : patch;
              return { ...message, ...next };
            }),
          };
        }),
      );
    },
    [],
  );

  const runSimulation = useCallback(
    (
      conversationId: string,
      messageId: string,
      text: string,
      options: { fail?: boolean; attempt?: number } = {},
    ) => {
      clearTimers();
      streamTargetRef.current = { conversationId, messageId };
      setIsResponding(true);

      if (options.fail) {
        timeoutRef.current = setTimeout(() => {
          patchMessage(conversationId, messageId, {
            status: "error",
            content: "",
            errorMessage:
              "Demo error. No request was sent — this is a simulated failure so you can preview the error state.",
          });
          setIsResponding(false);
          streamTargetRef.current = null;
        }, 900);
        return;
      }

      patchMessage(conversationId, messageId, {
        status: "pending",
        content: "",
        errorMessage: undefined,
        stopped: false,
      });

      const startDelay = 520 + Math.round(Math.random() * 320);

      timeoutRef.current = setTimeout(() => {
        if (!settings.simulateStreaming) {
          patchMessage(conversationId, messageId, { status: "complete", content: text });
          setIsResponding(false);
          streamTargetRef.current = null;
          return;
        }

        const chunks = chunkForStream(text, 6);
        let index = 0;
        let buffer = "";

        patchMessage(conversationId, messageId, { status: "streaming", content: "" });

        intervalRef.current = setInterval(() => {
          const next = chunks.slice(index, index + 3).join("");
          index += 3;
          buffer += next;

          if (index >= chunks.length) {
            patchMessage(conversationId, messageId, {
              status: "complete",
              content: text,
            });
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsResponding(false);
            streamTargetRef.current = null;
            return;
          }

          patchMessage(conversationId, messageId, {
            status: "streaming",
            content: buffer,
          });
        }, 42);
      }, startDelay);
    },
    [clearTimers, patchMessage, settings.simulateStreaming],
  );

  /**
   * Settles whichever message is currently being simulated. Used by Stop, by
   * switching conversations, and before a new send so no message can be left
   * stuck in a pending/streaming state.
   */
  const finalizeStream = useCallback(() => {
    const target = streamTargetRef.current;
    if (target) {
      patchMessage(target.conversationId, target.messageId, (message) =>
        message.status === "pending" || message.status === "streaming"
          ? {
              status: "complete",
              stopped: true,
              content:
                message.content ||
                "_Stopped before any demo content was generated._",
            }
          : {},
      );
    }
    streamTargetRef.current = null;
    setIsResponding(false);
    clearTimers();
  }, [clearTimers, patchMessage]);

  const stopResponse = useCallback(() => {
    finalizeStream();
  }, [finalizeStream]);

  /* ------------------------------------------------------ messaging --- */
  const sendMessage = useCallback(
    (text: string, attachments: MessageAttachment[]) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      finalizeStream();

      const now = new Date();
      const nowIso = now.toISOString();
      const userMessage: ChatMessage = {
        id: createId("msg"),
        role: "user",
        content: trimmed,
        createdAt: nowIso,
        status: "complete",
        attachments: attachments.length ? attachments : undefined,
      };
      const assistantMessage = makeAssistantMessage(selectedModelId);

      let conversationId = activeConversationId;

      if (!conversationId) {
        conversationId = createId("conv");
        const newConversation: Conversation = {
          id: conversationId,
          title: createConversationTitle(trimmed),
          modelId: selectedModelId,
          messages: [userMessage, assistantMessage],
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        setConversations((current) => [newConversation, ...current]);
        setActiveConversationId(conversationId);
      } else {
        const currentId = conversationId;
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === currentId
              ? {
                  ...conversation,
                  modelId: selectedModelId,
                  updatedAt: nowIso,
                  messages: [...conversation.messages, userMessage, assistantMessage],
                }
              : conversation,
          ),
        );
      }

      attemptRef.current[assistantMessage.id] = 0;
      const reply = demoAssistantClient.reply({ prompt: trimmed, modelId: selectedModelId, attempt: 0 });
      const shouldFail = demoErrorNextResponse;
      setDemoErrorNextResponse(false);

      // The conversation and message updates above are queued before this one,
      // so the simulated reply can start immediately.
      runSimulation(conversationId, assistantMessage.id, reply, {
        fail: shouldFail,
      });
    },
    [activeConversationId, demoErrorNextResponse, finalizeStream, runSimulation, selectedModelId],
  );

  const retryResponse = useCallback(
    (messageId: string) => {
      if (!activeConversationId) return;
      const conversation = conversations.find(
        (item) => item.id === activeConversationId,
      );
      if (!conversation) return;

      const index = conversation.messages.findIndex((message) => message.id === messageId);
      if (index < 0) return;

      const previousUser = [...conversation.messages.slice(0, index)]
        .reverse()
        .find((message) => message.role === "user");
      if (!previousUser) return;

      const attempt = (attemptRef.current[messageId] ?? 0) + 1;
      attemptRef.current[messageId] = attempt;
      const reply = demoAssistantClient.reply({
        prompt: previousUser.content,
        modelId: selectedModelId,
        attempt,
      });

      const fail = demoErrorNextResponse;
      setDemoErrorNextResponse(false);
      runSimulation(activeConversationId, messageId, reply, { fail, attempt });
    },
    [activeConversationId, conversations, demoErrorNextResponse, runSimulation, selectedModelId],
  );

  /* --------------------------------------------- conversation actions - */
  const selectConversation = useCallback(
    (id: string) => {
      finalizeStream();
      setActiveConversationId(id);
      setMobileSidebarOpen(false);
      // Align the composer with the tier this thread was created with, without
      // rewriting the visitor's saved default preference.
      const target = conversations.find((conversation) => conversation.id === id);
      if (target) setSelectedModelIdState(target.modelId);
    },
    [conversations, finalizeStream],
  );

  const startNewChat = useCallback(() => {
    finalizeStream();
    setActiveConversationId(null);
    setMobileSidebarOpen(false);
    setSearchQuery("");
    // New chats follow the saved default tier.
    setSelectedModelIdState(settings.defaultModelId);
    // Keyboard shortcuts can fire from any route.
    if (pathname !== "/chat" && pathname !== "/") {
      router.push("/chat");
    }
  }, [finalizeStream, pathname, router, settings.defaultModelId]);

  const renameConversation = useCallback((id: string, title: string) => {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? { ...conversation, title: nextTitle, updatedAt: new Date().toISOString() }
          : conversation,
      ),
    );
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((current) => current.filter((conversation) => conversation.id !== id));
      if (activeConversationId === id) {
        finalizeStream();
        setActiveConversationId(null);
      }
      pushToast({
        title: "Conversation deleted",
        description: "Demo data only — a refresh restores the sample list.",
        tone: "neutral",
      });
    },
    [activeConversationId, finalizeStream, pushToast],
  );

  const togglePin = useCallback((id: string) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? { ...conversation, pinned: !conversation.pinned }
          : conversation,
      ),
    );
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  /* ------------------------------------------------------ shortcuts --- */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        startNewChat();
        return;
      }

      if (meta && event.key.toLowerCase() === "b") {
        event.preventDefault();
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        if (isDesktop) {
          toggleSidebar();
        } else {
          setMobileSidebarOpen((open) => !open);
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("krypton:focus-search"));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startNewChat, toggleSidebar]);

  /* -------------------------------------------------------- derived --- */
  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const groupedConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? conversations.filter((conversation) => {
          const inTitle = conversation.title.toLowerCase().includes(query);
          const inBody = conversation.messages.some((message) =>
            message.content.toLowerCase().includes(query),
          );
          return inTitle || inBody;
        })
      : conversations;

    const groups: ConversationGroup[] = ["today", "yesterday", "previous"];
    const demoGroupOrder: Record<ConversationGroup, number> = {
      today: 0,
      yesterday: 1,
      previous: 2,
    };

    return groups
      .map((group) => ({
        group,
        label: GROUP_LABELS[group],
        items: sortConversations(
          filtered.filter((conversation) => {
            const effectiveGroup = conversation.demoGroup ?? "today";
            return demoGroupOrder[effectiveGroup] === demoGroupOrder[group];
          }),
        ),
      }))
      .filter((entry) => entry.items.length > 0);
  }, [conversations, searchQuery]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      conversations,
      activeConversation,
      activeConversationId,
      groupedConversations,
      selectConversation,
      startNewChat,
      renameConversation,
      deleteConversation,
      togglePin,
      sendMessage,
      retryResponse,
      stopResponse,
      isResponding,
      demoErrorNextResponse,
      setDemoErrorNextResponse,
      selectedModelId,
      setSelectedModelId,
      sidebarCollapsed,
      toggleSidebar,
      mobileSidebarOpen,
      setMobileSidebarOpen,
      searchQuery,
      setSearchQuery,
      settings,
      updateSetting,
      resetSettings,
      hydrated,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      conversations,
      activeConversation,
      activeConversationId,
      groupedConversations,
      selectConversation,
      startNewChat,
      renameConversation,
      deleteConversation,
      togglePin,
      sendMessage,
      retryResponse,
      stopResponse,
      isResponding,
      demoErrorNextResponse,
      selectedModelId,
      setSelectedModelId,
      sidebarCollapsed,
      toggleSidebar,
      mobileSidebarOpen,
      searchQuery,
      settings,
      updateSetting,
      resetSettings,
      hydrated,
      toasts,
      pushToast,
      dismissToast,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside <WorkspaceProvider>.");
  }
  return context;
}
