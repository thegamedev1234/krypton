"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  FileText,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { KryptonMark } from "@/components/brand/krypton-mark";
import { Markdown } from "@/components/chat/markdown";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { DemoBadge } from "@/components/ui/badge";
import { getModel, MODEL_TONE_CLASSES } from "@/lib/models";
import { cn, copyToClipboard, formatBytes, formatClockTime } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageItemProps {
  message: ChatMessage;
  isLast: boolean;
  isResponding: boolean;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const { pushToast } = useWorkspace();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyToClipboard(text);
        if (ok) {
          setCopied(true);
          pushToast({ title: "Copied to clipboard", tone: "positive" });
        } else {
          pushToast({
            title: "Copy failed",
            description: "Your browser blocked clipboard access.",
            tone: "danger",
          });
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-2xs font-medium transition-colors",
        copied ? "text-positive" : "text-faint hover:bg-raised hover:text-ink-soft",
      )}
      aria-label={copied ? "Copied" : `${label} message`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function MessageItem({ message, isLast, isResponding }: MessageItemProps) {
  const { settings, retryResponse } = useWorkspace();
  const model = getModel(message.modelId ?? "krypton-5");
  const tone = MODEL_TONE_CLASSES[model.tone];

  /* ------------------------------------------------------ user turn -- */
  if (message.role === "user") {
    return (
      <article className="group flex animate-fade-up flex-col items-end gap-1.5" aria-label="Your message">
        <div className="flex items-center gap-2 pr-1 text-2xs text-faint">
          <span className="font-medium uppercase tracking-[0.08em]">You</span>
          {settings.showTimestamps ? (
            <time dateTime={message.createdAt} className="font-mono tabular-nums">
              {formatClockTime(message.createdAt)}
            </time>
          ) : null}
        </div>
        <div className="max-w-[92%] rounded-2xl rounded-br-md border border-line bg-raised/75 px-3.5 py-2.5 text-[14px] leading-6 text-ink sm:max-w-[85%]">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {message.attachments && message.attachments.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5 border-t border-line/70 pt-2" aria-label="Attachments">
              {message.attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center gap-1.5 rounded-md border border-line bg-surface/80 px-1.5 py-1 text-[10px] text-muted"
                >
                  <FileText className="h-2.5 w-2.5 text-faint" aria-hidden="true" />
                  <span className="max-w-[10rem] truncate">{attachment.name}</span>
                  <span className="font-mono text-faint">{formatBytes(attachment.sizeBytes)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex items-center gap-1 pr-0.5 opacity-100 transition-opacity duration-150 focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <CopyButton text={message.content} />
        </div>
      </article>
    );
  }

  /* ------------------------------------------------- assistant turn -- */
  const isPending = message.status === "pending";
  const isStreaming = message.status === "streaming";
  const isError = message.status === "error";
  const showActions =
    !isPending && !isStreaming && (message.content.length > 0 || isError);

  return (
    <article
      className="group/msg animate-fade-up"
      aria-label={`KRYPTON response from ${model.name}`}
    >
      <header className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <KryptonMark size={20} decorative />
        <span className="text-xs font-semibold tracking-[0.02em] text-ink">KRYPTON</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-4",
            tone.chip,
          )}
          title={`${model.name} — ${model.shortDescription}`}
        >
          <span className={cn("h-1 w-1 rounded-full", tone.dot)} aria-hidden="true" />
          {model.name}
        </span>
        {message.simulated ? <DemoBadge /> : null}
        {message.stopped ? (
          <span className="rounded-full border border-warning/25 bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
            Stopped
          </span>
        ) : null}
        {settings.showTimestamps ? (
          <time
            dateTime={message.createdAt}
            className="ml-auto hidden font-mono text-2xs tabular-nums text-faint sm:block"
          >
            {formatClockTime(message.createdAt)}
          </time>
        ) : null}
      </header>

      <div className="mt-2 sm:pl-[1.75rem]">
        {isError ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/[0.07] p-3.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-danger/30 bg-danger/10 text-danger">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink">The demo response failed</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {message.errorMessage ??
                    "A simulated error occurred. No request was made to any service."}
                </p>
                <button
                  type="button"
                  onClick={() => retryResponse(message.id)}
                  disabled={isResponding}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-line bg-raised px-2 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-lineStrong hover:text-ink disabled:pointer-events-none disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  Retry demo response
                </button>
              </div>
            </div>
          </div>
        ) : isPending ? (
          <div className="rounded-xl border border-line/70 bg-surface/40 px-3 py-3">
            <TypingIndicator label={`${model.name} is preparing a demo response`} />
          </div>
        ) : (
          <div className={cn(isStreaming && "md-streaming")}>
            <Markdown content={message.content} />
          </div>
        )}

        {showActions && !isError ? (
          <div className="mt-2 flex items-center gap-1">
            <CopyButton text={message.content} label="Copy" />
            <button
              type="button"
              onClick={() => retryResponse(message.id)}
              disabled={isResponding || !isLast}
              className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-2xs font-medium text-faint transition-colors hover:bg-raised hover:text-ink-soft disabled:pointer-events-none disabled:opacity-40"
              aria-label="Retry this simulated response"
              title={!isLast ? "Retry is available on the latest response" : undefined}
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </button>
            <span className="ml-1 hidden items-center gap-1 text-[10px] text-faint/80 sm:flex">
              <ShieldCheck className="h-2.5 w-2.5" aria-hidden="true" />
              Local sample content
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
