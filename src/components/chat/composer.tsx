"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import {
  ArrowUp,
  Blocks,
  CircleSlash,
  FileText,
  Globe,
  Image as ImageIcon,
  Paperclip,
  Plus,
  ShieldAlert,
  Sparkles,
  Square,
  Wrench,
  X,
} from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { ModelSelector } from "@/components/chat/model-selector";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import type { MessageAttachment } from "@/types";
import { cn, createId, formatBytes } from "@/lib/utils";

const MAX_CHARS = 8000;
const MAX_FILES = 5;
const MAX_FILE_BYTES = 25 * 1024 * 1024;

interface ComposerProps {
  value: string;
  onValueChange: (value: string) => void;
  attachments: MessageAttachment[];
  onAttachmentsChange: (attachments: MessageAttachment[]) => void;
  variant?: "welcome" | "docked";
  focusSignal?: number;
}

export function Composer({
  value,
  onValueChange,
  attachments,
  onAttachmentsChange,
  variant = "docked",
  focusSignal = 0,
}: ComposerProps) {
  const {
    sendMessage,
    isResponding,
    stopResponse,
    settings,
    demoErrorNextResponse,
    setDemoErrorNextResponse,
    pushToast,
  } = useWorkspace();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const trimmedLength = value.trim().length;
  const canSend = trimmedLength > 0 && !isResponding;

  // Auto-grow within a bounded range so the docked composer never pushes the
  // transcript off screen.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = variant === "welcome" ? 200 : 184;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [value, variant]);

  useEffect(() => {
    if (focusSignal > 0) textareaRef.current?.focus();
  }, [focusSignal]);

  function submit() {
    if (!canSend) return;
    sendMessage(value, attachments);
    onValueChange("");
    onAttachmentsChange([]);
    setAttachmentError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Never send while an IME composition is active.
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Escape" && isResponding) {
      event.preventDefault();
      stopResponse();
      return;
    }

    if (event.key !== "Enter") return;

    const withModifier = event.metaKey || event.ctrlKey;

    if (settings.enterToSend) {
      if (event.shiftKey) return;
      event.preventDefault();
      submit();
      return;
    }

    if (withModifier) {
      event.preventDefault();
      submit();
    }
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const next = [...attachments];
    let error: string | null = null;

    for (const file of incoming) {
      if (next.length >= MAX_FILES) {
        error = `You can attach up to ${MAX_FILES} files in this demo.`;
        break;
      }
      if (file.size > MAX_FILE_BYTES) {
        error = `“${file.name}” is larger than 25 MB. Large files are not supported in this demo.`;
        continue;
      }
      next.push({
        id: createId("att"),
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type || "application/octet-stream",
      });
    }

    onAttachmentsChange(next);
    setAttachmentError(error);
    if (!error && incoming.length > 0) {
      pushToast({
        title: incoming.length === 1 ? "File attached" : `${incoming.length} files attached`,
        description: "Demo only — file contents are never read or uploaded.",
        tone: "neutral",
      });
    }
    event.target.value = "";
  }

  return (
    <div
      className={cn(
        "group/composer relative rounded-2xl border bg-panel/95 transition-colors duration-200",
        variant === "welcome"
          ? "border-lineStrong/70 shadow-composer focus-within:border-accent/40"
          : "border-line shadow-composer focus-within:border-lineStrong",
        isResponding && "border-accent/30",
      )}
    >
      <label htmlFor="krypton-composer" className="sr-only">
        Message Krypton
      </label>

      <div className="px-3 pt-3">
        {attachments.length > 0 ? (
          <ul className="mb-2 flex flex-wrap gap-1.5" aria-label="Attached files">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex max-w-[15rem] items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1 text-2xs text-ink-soft"
              >
                <FileText className="h-3 w-3 shrink-0 text-faint" aria-hidden="true" />
                <span className="truncate">{attachment.name}</span>
                <span className="shrink-0 font-mono text-faint">{formatBytes(attachment.sizeBytes)}</span>
                <button
                  type="button"
                  onClick={() =>
                    onAttachmentsChange(attachments.filter((item) => item.id !== attachment.id))
                  }
                  className="ml-0.5 rounded p-0.5 text-faint transition-colors hover:bg-raised hover:text-ink"
                  aria-label={`Remove ${attachment.name}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {attachments.length > 0 ? (
          <p className="mb-1.5 text-[10px] text-faint">
            Demo attachments — names are shown locally and never uploaded.
          </p>
        ) : null}

        <textarea
          ref={textareaRef}
          id="krypton-composer"
          value={value}
          onChange={(event) => onValueChange(event.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message Krypton..."
          aria-describedby="composer-hints"
          className={cn(
            "block w-full resize-none bg-transparent text-base leading-6 text-ink placeholder:text-faint sm:text-[15px]",
            "focus:outline-none",
            variant === "welcome" ? "min-h-[3.25rem]" : "min-h-[2.5rem]",
          )}
        />
      </div>

      {attachmentError ? (
        <p
          role="alert"
          className="mx-3 mb-1 flex items-start gap-1.5 rounded-lg border border-danger/25 bg-danger/10 px-2 py-1.5 text-2xs leading-4 text-danger"
        >
          <CircleSlash className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          {attachmentError}
        </p>
      ) : null}

      <div className="flex items-end justify-between gap-2 px-2.5 pb-2.5 pt-1.5">
        <div className="flex min-w-0 items-center gap-0.5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFiles}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.md,.csv,.json,.ts,.tsx,.js,.jsx,.html,.css,.sql"
          />
          <Tooltip label="Attach files (demo)" side="top">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="icon-btn h-8 w-8"
              aria-label="Attach files — demo only"
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </Tooltip>

          <Menu
            label="Composer tools"
            align="start"
            minWidth={272}
            trigger={
              <button type="button" className="icon-btn h-8 w-8" aria-label="Open tools menu">
                <Wrench className="h-4 w-4" />
              </button>
            }
          >
            {(close) => (
              <>
                <MenuLabel>Tools</MenuLabel>
                <MenuItem icon={<Globe className="h-3.5 w-3.5" />} disabled hint="Soon">
                  Web search
                </MenuItem>
                <MenuItem icon={<Blocks className="h-3.5 w-3.5" />} disabled hint="Soon">
                  Code interpreter
                </MenuItem>
                <MenuItem icon={<ImageIcon className="h-3.5 w-3.5" />} disabled hint="Soon">
                  Vision input
                </MenuItem>
                <MenuItem icon={<Sparkles className="h-3.5 w-3.5" />} disabled hint="Soon">
                  Deep research
                </MenuItem>
                <MenuSeparator />
                <MenuLabel>Demo controls</MenuLabel>
                <MenuItem
                  icon={<ShieldAlert className="h-3.5 w-3.5" />}
                  selected={demoErrorNextResponse}
                  onClick={() => {
                    setDemoErrorNextResponse(!demoErrorNextResponse);
                    close();
                  }}
                >
                  {demoErrorNextResponse ? "Error simulation armed" : "Simulate a response error"}
                </MenuItem>
                <p className="px-2.5 pb-1 pt-1.5 text-[10px] leading-4 text-faint">
                  Tools above require backend services and are not connected. The error simulation
                  shows the local error state.
                </p>
              </>
            )}
          </Menu>

          {value.length > 0 && settings.showKeyboardHints ? (
            <span
              className={cn(
                "ml-1 hidden font-mono text-[10px] sm:inline",
                value.length > MAX_CHARS * 0.92 ? "text-warning" : "text-faint",
              )}
              aria-live="polite"
            >
              {value.length.toLocaleString("en-US")}/{MAX_CHARS.toLocaleString("en-US")}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <ModelSelector />
          {isResponding ? (
            <button
              type="button"
              onClick={stopResponse}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-lineStrong/70 bg-raised px-2.5 text-xs font-medium text-ink transition-colors hover:border-lineStrong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              aria-label="Stop simulated response"
            >
              <Square className="h-3 w-3 fill-current" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <Tooltip label={canSend ? "Send message" : "Type a message to send"} side="top">
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                  canSend
                    ? "bg-accent text-accentInk hover:bg-accentStrong"
                    : "cursor-not-allowed border border-line bg-raised text-faint",
                )}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <p id="composer-hints" className="sr-only">
        Press Enter to send and Shift plus Enter for a new line. Responses are simulated local
        sample content and are not produced by an AI model.
      </p>

      {variant === "welcome" ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/60 px-3 py-2 text-[10px] text-faint">
          <span className="flex items-center gap-1.5">
            <Plus className="h-2.5 w-2.5" aria-hidden="true" />
            Demo workspace — no model, files, or account are connected.
          </span>
          <span className="font-mono">
            {settings.enterToSend ? "Enter to send · Shift+Enter for a line" : "⌘/Ctrl+Enter to send"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
