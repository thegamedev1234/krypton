"use client";

import Link from "next/link";
import {
  ChevronDown,
  MessageSquarePlus,
  Pencil,
  Pin,
  PinOff,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { getModel } from "@/lib/models";
import { cn, formatClockTime, formatShortDate } from "@/lib/utils";
import type { Conversation } from "@/types";

/* Sidebar leaf components: navigation items and conversation rows. */

export function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof Sparkles;
  active: boolean;
  collapsed: boolean;
  badge?: string;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group/nav relative flex items-center rounded-lg text-[13px] font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        collapsed ? "mx-auto h-9 w-9 justify-center" : "h-9 gap-2.5 px-2.5",
        active
          ? "bg-raised text-ink"
          : "text-muted hover:bg-raised/60 hover:text-ink-soft",
      )}
    >
      {active && !collapsed ? (
        <span
          className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent"
          aria-hidden="true"
        />
      ) : null}
      <Icon
        className={cn("h-4 w-4 shrink-0", active ? "text-accentStrong" : "text-faint group-hover/nav:text-muted")}
      />
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge ? (
            <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-2xs text-faint">
              {badge}
            </span>
          ) : null}
        </>
      ) : null}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip label={label} side="right" block>
      {link}
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  Conversation row                                                  */
/* ------------------------------------------------------------------ */

export function ConversationRow({
  conversation,
  active,
  collapsed,
  onSelect,
  onRename,
  onDelete,
  onTogglePin,
}: {
  conversation: Conversation;
  active: boolean;
  collapsed: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  const model = getModel(conversation.modelId);
  const timeLabel = conversation.demoGroup === "today" || !conversation.demoGroup
    ? formatClockTime(conversation.updatedAt)
    : formatShortDate(conversation.updatedAt);

  if (collapsed) {
    return (
      <Tooltip label={conversation.title} side="right" block>
        <button
          type="button"
          onClick={onSelect}
          aria-label={conversation.title}
          aria-current={active ? "true" : undefined}
          className={cn(
            "mx-auto flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
            active
              ? "border-accent/30 bg-accent/10 text-accentStrong"
              : "border-transparent bg-surface text-faint hover:border-line hover:text-ink",
          )}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
    );
  }

  return (
    <div
      className={cn(
        "group/row relative rounded-lg transition-colors duration-150",
        active ? "bg-raised" : "hover:bg-raised/60",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className="flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 pr-8 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      >
        <span
          className={cn(
            "w-full truncate text-[13px] font-medium leading-5",
            active ? "text-ink" : "text-ink-soft group-hover/row:text-ink",
          )}
        >
          {conversation.title}
        </span>
        <span className="flex items-center gap-1.5 text-2xs text-faint">
          <span className={cn("h-1 w-1 rounded-full", conversation.pinned ? "bg-accent/80" : "bg-lineStrong")} />
          <span className="truncate">{model.name}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{timeLabel}</span>
        </span>
      </button>

      <div
        className={cn(
          "absolute right-0.5 top-1/2 -translate-y-1/2 transition-opacity duration-150",
          "opacity-0 focus-within:opacity-100 group-hover/row:opacity-100",
          active && "opacity-100",
          "pointer-events-none focus-within:pointer-events-auto group-hover/row:pointer-events-auto",
          active && "pointer-events-auto",
        )}
      >
        <Menu
          label={`Actions for ${conversation.title}`}
          minWidth={196}
          trigger={
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              aria-label={`Conversation actions: ${conversation.title}`}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          }
        >
          {(close) => (
            <>
              <MenuItem
                icon={conversation.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                onClick={() => {
                  onTogglePin();
                  close();
                }}
              >
                {conversation.pinned ? "Unpin conversation" : "Pin conversation"}
              </MenuItem>
              <MenuItem
                icon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => {
                  onRename();
                  close();
                }}
              >
                Rename
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                icon={<Trash2 className="h-3.5 w-3.5" />}
                destructive
                onClick={() => {
                  onDelete();
                  close();
                }}
              >
                Delete
              </MenuItem>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}
