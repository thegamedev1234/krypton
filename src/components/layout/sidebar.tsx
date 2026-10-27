"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  Check,
  ChevronDown,
  Compass,
  LogOut,
  MessageSquarePlus,
  PanelLeftClose,
  Pin,
  Search,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { KryptonMark, KryptonWordmark } from "@/components/brand/krypton-mark";
import { ConversationRow, NavItem } from "@/components/layout/sidebar-items";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { Button } from "@/components/ui/button";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { DEMO_PROFILE } from "@/lib/demo-data";
import { DEMO_ARTIFACTS } from "@/lib/demo-artifacts";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

const NAV_ITEMS = [
  { href: "/chat", label: "AI Assistant", icon: Sparkles },
  { href: "/tools", label: "Explore tools", icon: Compass },
  { href: "/artifacts", label: "Artifacts", icon: Boxes },
] as const;

/* ------------------------------------------------------------------ */
/*  Nav item                                                          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Sidebar body                                                      */
/* ------------------------------------------------------------------ */

function SidebarBody({
  collapsed,
  onNavigate,
  onClose,
  mobile = false,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
  mobile?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    groupedConversations,
    activeConversationId,
    selectConversation,
    startNewChat,
    togglePin,
    renameConversation,
    deleteConversation,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    settings,
    pushToast,
    conversations,
  } = useWorkspace();

  const searchRef = useRef<HTMLInputElement>(null);
  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch() {
      searchRef.current?.focus();
      searchRef.current?.select();
    }
    window.addEventListener("krypton:focus-search", focusSearch);
    return () => window.removeEventListener("krypton:focus-search", focusSearch);
  }, []);

  const { pinned, groups } = useMemo(() => {
    const all = groupedConversations.flatMap((group) => group.items);
    return {
      pinned: all.filter((conversation) => conversation.pinned),
      groups: groupedConversations
        .map((group) => ({
          ...group,
          items: group.items.filter((conversation) => !conversation.pinned),
        }))
        .filter((group) => group.items.length > 0),
    };
  }, [groupedConversations]);

  const totalVisible = pinned.length + groups.reduce((sum, group) => sum + group.items.length, 0);
  const pinnedCount = conversations.filter((conversation) => conversation.pinned).length;

  function openConversation(id: string) {
    selectConversation(id);
    router.push("/chat");
    onNavigate?.();
  }

  function handleNewChat() {
    startNewChat();
    router.push("/chat");
    onNavigate?.();
  }

  function submitRename() {
    if (!renameTarget) return;
    const next = renameValue.trim();
    if (!next) return;
    renameConversation(renameTarget.id, next);
    pushToast({ title: "Conversation renamed", description: "Demo change — not saved anywhere.", tone: "positive" });
    setRenameTarget(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Brand ------------------------------------------------------- */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-line/60",
          collapsed ? "justify-center px-2" : "justify-between px-3",
        )}
      >
        {collapsed ? (
          <Tooltip label="Expand sidebar" side="right">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="rounded-[9px] transition-transform duration-150 hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <KryptonMark size={28} />
            </button>
          </Tooltip>
        ) : (
          <>
            <Link
              href="/chat"
              onClick={onNavigate}
              className="flex items-center gap-2.5 rounded-lg px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              aria-label="KRYPTON — go to workspace"
            >
              <KryptonMark size={26} />
              <span className="flex flex-col leading-none">
                <KryptonWordmark />
                <span className="mt-1 text-2xs font-medium tracking-[0.14em] text-faint">
                  AI WORKSPACE
                </span>
              </span>
            </Link>
            {mobile ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="icon-btn"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Tooltip label="Collapse sidebar" side="bottom">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-label="Collapse sidebar"
                  className="icon-btn"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
          </>
        )}
      </div>

      {/* New chat --------------------------------------------------- */}
      <div className={cn("shrink-0 pt-3", collapsed ? "px-2" : "px-2.5")}>
        {collapsed ? (
          <Tooltip label="New chat" side="right" block>
            <button
              type="button"
              onClick={handleNewChat}
              aria-label="New chat"
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accentStrong transition-colors hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <MessageSquarePlus className="h-4 w-4" />
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={handleNewChat}
            className="flex h-9 w-full items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-2.5 text-[13px] font-medium text-accentStrong transition-colors duration-150 hover:border-accent/40 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="flex-1 text-left">New chat</span>
            {settings.showKeyboardHints ? (
              <span className="flex items-center gap-0.5 font-mono text-2xs text-accentStrong/60">
                <kbd className="rounded border border-accent/20 px-1">⌘</kbd>
                <kbd className="rounded border border-accent/20 px-1">K</kbd>
              </span>
            ) : null}
          </button>
        )}
      </div>

      {/* Navigation -------------------------------------------------- */}
      <nav
        aria-label="Workspace sections"
        className={cn("mt-3 shrink-0 space-y-0.5", collapsed ? "px-2" : "px-2")}
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
            active={pathname === item.href || (item.href === "/chat" && pathname === "/")}
            badge={item.href === "/artifacts" ? String(DEMO_ARTIFACTS.length) : undefined}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mx-2.5 my-2.5 h-px shrink-0 bg-line/70" />

      {/* Search + conversations ------------------------------------- */}
      {collapsed ? (
        <div className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto px-2 pt-1 no-scrollbar">
          <Tooltip label="Search conversations" side="right" block>
            <button
              type="button"
              onClick={() => {
                toggleSidebar();
                window.setTimeout(() => {
                  window.dispatchEvent(new CustomEvent("krypton:focus-search"));
                }, 180);
              }}
              aria-label="Search conversations"
              className="icon-btn h-9 w-9"
            >
              <Search className="h-4 w-4" />
            </button>
          </Tooltip>
          <div className="h-px w-6 bg-line" aria-hidden="true" />
          {conversations.slice(0, 6).map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeConversationId}
              collapsed
              onSelect={() => openConversation(conversation.id)}
              onRename={() => {
                setRenameTarget(conversation);
                setRenameValue(conversation.title);
              }}
              onDelete={() => setDeleteTarget(conversation)}
              onTogglePin={() => togglePin(conversation.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col pt-0.5">
          <div className="shrink-0 px-2.5">
            <label htmlFor="conversation-search" className="sr-only">
              Search conversations
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                id="conversation-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.stopPropagation();
                    if (searchQuery) setSearchQuery("");
                    else event.currentTarget.blur();
                  }
                }}
                placeholder="Search conversations"
                autoComplete="off"
                className="h-8 w-full rounded-lg border border-line bg-canvas/60 pl-8 pr-8 text-xs text-ink placeholder:text-faint transition-colors focus:border-lineStrong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 [&::-webkit-search-cancel-button]:hidden"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-faint hover:bg-raised hover:text-ink"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : settings.showKeyboardHints ? (
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                  <kbd className="kbd h-4 min-w-4 text-[10px]">/</kbd>
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
            {totalVisible === 0 ? (
              searchQuery ? (
                <EmptyState
                  compact
                  icon={Search}
                  title="No matches"
                  description={`No demo conversations contain “${searchQuery}”.`}
                  action={
                    <Button size="sm" variant="secondary" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  compact
                  icon={Sparkles}
                  title="No conversations yet"
                  description="Start a chat and it will appear here for this session."
                />
              )
            ) : (
              <>
                {pinned.length > 0 ? (
                  <section aria-label="Pinned conversations" className="mb-3">
                    <h3 className="flex items-center gap-1.5 px-2.5 pb-1 pt-1 text-2xs font-semibold uppercase tracking-[0.1em] text-faint">
                      <Pin className="h-3 w-3" aria-hidden="true" />
                      Pinned
                      <span className="ml-auto font-mono font-normal text-[10px] text-faint/70">
                        {pinnedCount}
                      </span>
                    </h3>
                    <div className="space-y-0.5">
                      {pinned.map((conversation) => (
                        <ConversationRow
                          key={conversation.id}
                          conversation={conversation}
                          active={conversation.id === activeConversationId}
                          collapsed={false}
                          onSelect={() => openConversation(conversation.id)}
                          onRename={() => {
                            setRenameTarget(conversation);
                            setRenameValue(conversation.title);
                          }}
                          onDelete={() => setDeleteTarget(conversation)}
                          onTogglePin={() => togglePin(conversation.id)}
                        />
                      ))}
                    </div>
                  </section>
                ) : null}

                {groups.map((group) => (
                  <section key={group.group} aria-label={`${group.label} conversations`} className="mb-3">
                    <h3 className="px-2.5 pb-1 pt-1 text-2xs font-semibold uppercase tracking-[0.1em] text-faint">
                      {group.label}
                    </h3>
                    <div className="space-y-0.5">
                      {group.items.map((conversation) => (
                        <ConversationRow
                          key={conversation.id}
                          conversation={conversation}
                          active={conversation.id === activeConversationId}
                          collapsed={false}
                          onSelect={() => openConversation(conversation.id)}
                          onRename={() => {
                            setRenameTarget(conversation);
                            setRenameValue(conversation.title);
                          }}
                          onDelete={() => setDeleteTarget(conversation)}
                          onTogglePin={() => togglePin(conversation.id)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </>
            )}
          </div>

          <p className="shrink-0 px-3 pb-2 text-[10px] leading-4 text-faint/80">
            Sample conversations for this frontend demo. Nothing is stored or synced.
          </p>
        </div>
      )}

      {/* Footer: settings + profile --------------------------------- */}
      <div className={cn("shrink-0 border-t border-line/70 p-2", collapsed && "pb-3")}>
        <div className={cn(collapsed ? "mb-1 flex justify-center" : "mb-1")}>
          <NavItem
            href="/settings"
            label="Settings"
            icon={Settings}
            collapsed={collapsed}
            active={pathname === "/settings"}
            onNavigate={onNavigate}
          />
        </div>

        <Menu
          label="Profile and workspace"
          align="start"
          minWidth={252}
          trigger={
            <button
              type="button"
              aria-label="Profile and workspace menu"
              className={cn(
                "flex items-center gap-2.5 rounded-xl border border-transparent p-1.5 text-left transition-colors hover:border-line hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                collapsed ? "mx-auto w-9 justify-center" : "w-full",
              )}
            >
              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-[linear-gradient(145deg,rgb(var(--raised)),rgb(var(--panel)))] text-[10px] font-semibold text-ink-soft">
                {DEMO_PROFILE.initials}
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-surface bg-warning"
                  aria-hidden="true"
                />
              </span>
              {!collapsed ? (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-xs font-medium text-ink">
                        {DEMO_PROFILE.displayName}
                      </span>
                      <span className="rounded border border-warning/25 bg-warning/10 px-1 text-[9px] font-semibold uppercase tracking-wide text-warning">
                        Demo
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-2xs text-faint">
                      {DEMO_PROFILE.plan}
                    </span>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-faint" />
                </>
              ) : null}
            </button>
          }
        >
          {() => (
            <>
              <div className="mb-1 rounded-lg border border-line/70 bg-surface/60 px-2.5 py-2">
                <p className="text-xs font-medium text-ink">{DEMO_PROFILE.displayName}</p>
                <p className="mt-0.5 text-2xs leading-4 text-muted">
                  Sample guest identity. This build has no accounts or sign-in.
                </p>
              </div>
              <MenuLabel>Workspace</MenuLabel>
              <MenuItem icon={<UserRound className="h-3.5 w-3.5" />} disabled>
                Profile settings
              </MenuItem>
              <MenuItem icon={<Check className="h-3.5 w-3.5" />} disabled>
                Plans and billing
              </MenuItem>
              <MenuItem
                icon={<Settings className="h-3.5 w-3.5" />}
                onClick={() => {
                  router.push("/settings");
                  onNavigate?.();
                }}
              >
                Settings
              </MenuItem>
              <MenuSeparator />
              <MenuItem icon={<LogOut className="h-3.5 w-3.5" />} disabled>
                Sign out — no session
              </MenuItem>
            </>
          )}
        </Menu>
        <p
          className={cn(
            "px-2 pt-1 text-[10px] leading-4 text-faint/70",
            collapsed && "hidden",
          )}
        >
          UI demo · no account connected
        </p>
      </div>

      {/* Rename dialog ---------------------------------------------- */}
      <Dialog
        open={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        title="Rename conversation"
        description="This only changes the demo title in your current session."
        initialFocusRef={renameInputRef}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitRename} disabled={!renameValue.trim()}>
              Save name
            </Button>
          </>
        }
      >
        <label htmlFor="rename-input" className="block text-xs font-medium text-muted">
          Conversation name
        </label>
        <input
          ref={renameInputRef}
          id="rename-input"
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitRename();
            }
          }}
          maxLength={80}
          autoComplete="off"
          className="mt-1.5 h-9 w-full rounded-lg border border-line bg-canvas/70 px-3 text-[13px] text-ink placeholder:text-faint focus:border-lineStrong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        />
        <p className="mt-1.5 text-right font-mono text-2xs text-faint">
          {renameValue.length}/80
        </p>
      </Dialog>

      {/* Delete confirmation ---------------------------------------- */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteConversation(deleteTarget.id);
            setDeleteTarget(null);
            onNavigate?.();
          }
        }}
        title="Delete this conversation?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be removed from this demo session. A page refresh restores the sample list — nothing was ever saved.`
            : ""
        }
        confirmLabel="Delete conversation"
        destructive
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar shell + mobile drawer                                     */
/* ------------------------------------------------------------------ */

export function Sidebar() {
  const {
    sidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useWorkspace();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    drawerRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen, setMobileSidebarOpen]);

  return (
    <>
      <aside
        aria-label="Workspace navigation"
        className={cn(
          "hidden shrink-0 border-r border-line/70 bg-surface/55 backdrop-blur-xl transition-[width] duration-200 ease-out-soft lg:flex lg:flex-col",
          sidebarCollapsed ? "w-[72px]" : "w-[288px]",
        )}
      >
        <SidebarBody collapsed={sidebarCollapsed} />
      </aside>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-[75] lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-[#02040a]/70 backdrop-blur-[2px]"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Workspace navigation"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] animate-slide-in-left flex-col border-r border-line bg-surface shadow-panel"
          >
            <SidebarBody
              collapsed={false}
              mobile
              onNavigate={() => setMobileSidebarOpen(false)}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
