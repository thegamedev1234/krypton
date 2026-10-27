"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, Info } from "lucide-react";
import { MessageItem } from "@/components/chat/message-item";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

export function MessageList({ conversation }: { conversation: Conversation }) {
  const { settings, isResponding } = useWorkspace();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pinnedToBottom = useRef(true);
  const [showJumpButton, setShowJumpButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: scroller.scrollHeight, behavior });
    pinnedToBottom.current = true;
    setShowJumpButton(false);
  }, []);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !pinnedToBottom.current) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [conversation.messages, settings.messageWidth]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    pinnedToBottom.current = distance < 64;
    setShowJumpButton(distance > 160);
  }

  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const widthClass =
    settings.messageWidth === "wide" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overscroll-contain scroll-smooth"
        role="log"
        aria-label="Conversation transcript"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className={cn("mx-auto w-full px-4 pb-8 pt-5 sm:px-6", widthClass)}>
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-line/70 bg-surface/50 px-3 py-2.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" aria-hidden="true" />
            <p className="text-[11px] leading-4 text-muted">
              <span className="font-medium text-ink-soft">Demo conversation.</span> Messages are
              hand-written sample content. Replies are simulated locally — no model, tool, or
              network request is involved.
            </p>
          </div>

          <div className="space-y-7">
            {conversation.messages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                isLast={index === conversation.messages.length - 1}
                isResponding={isResponding}
              />
            ))}
          </div>

          {lastMessage && lastMessage.status === "complete" ? (
            <p className="mt-8 text-center text-[10px] text-faint/80">
              End of demo response · retry any reply or continue the conversation.
            </p>
          ) : null}
        </div>
      </div>

      {showJumpButton ? (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-panel/95 px-3 py-1.5 text-2xs font-medium text-ink-soft shadow-pop backdrop-blur transition-colors hover:border-lineStrong hover:text-ink"
          aria-label="Scroll to latest message"
        >
          <ArrowDown className="h-3 w-3" />
          Latest
        </button>
      ) : null}
    </div>
  );
}
