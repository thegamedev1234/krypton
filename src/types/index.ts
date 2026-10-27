import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Models                                                            */
/* ------------------------------------------------------------------ */

export type ModelId = "krypton-7" | "krypton-5" | "krypton-lite";

export type ModelTone = "violet" | "accent" | "ice";

export interface ModelTier {
  id: ModelId;
  name: string;
  /** One-line label used in tight spaces (header chips, menus). */
  shortDescription: string;
  /** Full description used by the model selector. */
  description: string;
  tone: ModelTone;
  /** Editorial attribute shown in the selector — not a performance claim. */
  positioning: string;
  strengths: string[];
  speedLabel: string;
}

/* ------------------------------------------------------------------ */
/*  Conversations                                                     */
/* ------------------------------------------------------------------ */

export type MessageRole = "user" | "assistant";

export type MessageStatus = "complete" | "pending" | "streaming" | "error";

export interface MessageAttachment {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  /** Markdown for assistant turns, plain text for user turns. */
  content: string;
  createdAt: string;
  modelId?: ModelId;
  status: MessageStatus;
  /** True for scripted demo replies. Never used for real model output. */
  simulated?: boolean;
  attachments?: MessageAttachment[];
  errorMessage?: string;
  /** Set when the visitor stopped a simulated response early. */
  stopped?: boolean;
}

export type ConversationGroup = "today" | "yesterday" | "previous";

export interface Conversation {
  id: string;
  title: string;
  modelId: ModelId;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  /**
   * Demo seed conversations carry an explicit group so the sidebar grouping
   * is deterministic between server and client renders. Conversations created
   * in the session have no value and always group under "Today".
   */
  demoGroup?: ConversationGroup;
}

/* ------------------------------------------------------------------ */
/*  Artifacts                                                         */
/* ------------------------------------------------------------------ */

export type ArtifactLanguage = "html" | "css" | "javascript" | "markdown";

export interface ArtifactFile {
  id: string;
  name: string;
  language: ArtifactLanguage;
  content: string;
}

export interface Artifact {
  id: string;
  title: string;
  summary: string;
  kind: "Landing page" | "Component" | "Document";
  files: ArtifactFile[];
  createdAt: string;
  updatedAt: string;
  modelId: ModelId;
  /** Local demonstration object — nothing is persisted or uploaded. */
  isDemo: true;
}

/* ------------------------------------------------------------------ */
/*  Capabilities / tools                                              */
/* ------------------------------------------------------------------ */

export type CapabilityStatus = "demo" | "coming-soon";

export type CapabilityCategory =
  | "Research"
  | "Build"
  | "Create"
  | "Learn"
  | "Data"
  | "Interact";

export interface Capability {
  id: string;
  name: string;
  summary: string;
  details: string;
  category: CapabilityCategory;
  status: CapabilityStatus;
  icon: LucideIcon;
  highlights: string[];
  href?: string;
  ctaLabel?: string;
  statusNote: string;
}

/* ------------------------------------------------------------------ */
/*  Welcome screen suggestions                                        */
/* ------------------------------------------------------------------ */

export type SuggestionIcon = "code" | "pen" | "compass" | "graduation";

export interface SuggestedPrompt {
  id: string;
  category: string;
  title: string;
  /** Inserted into the composer (not auto-sent) so the visitor stays in control. */
  prompt: string;
  icon: SuggestionIcon;
}

/* ------------------------------------------------------------------ */
/*  Settings                                                          */
/* ------------------------------------------------------------------ */

export type ThemePreference = "dark" | "light" | "system";

export type MessageWidth = "comfortable" | "wide";

/**
 * UI-only preferences. These are stored in this browser's localStorage and
 * never sent anywhere. Anything requiring durable, cross-device storage is
 * explicitly marked in the settings UI as backend-dependent.
 */
export interface AppSettings {
  theme: ThemePreference;
  reduceMotion: boolean;
  reduceTransparency: boolean;
  defaultModelId: ModelId;
  enterToSend: boolean;
  showTimestamps: boolean;
  simulateStreaming: boolean;
  sidebarDefaultCollapsed: boolean;
  showWelcomeSuggestions: boolean;
  messageWidth: MessageWidth;
  showKeyboardHints: boolean;
}

/* ------------------------------------------------------------------ */
/*  Profile                                                           */
/* ------------------------------------------------------------------ */

export interface WorkspaceProfile {
  displayName: string;
  initials: string;
  plan: string;
  /** Explicit demo marker — this build has no authentication. */
  isGuest: true;
}

/* ------------------------------------------------------------------ */
/*  Keyboard shortcuts                                                */
/* ------------------------------------------------------------------ */

export interface ShortcutDefinition {
  id: string;
  label: string;
  keys: string[];
  group: "Navigation" | "Composer" | "Interface";
  status: "active" | "planned";
  note?: string;
}

export type { LucideIcon };
