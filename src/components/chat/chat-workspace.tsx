"use client";

import { useState } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { Composer } from "@/components/chat/composer";
import { MessageList } from "@/components/chat/message-list";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { cn } from "@/lib/utils";
import type { MessageAttachment } from "@/types";

export function ChatWorkspace() {
  const { activeConversation, settings } = useWorkspace();
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [focusSignal, setFocusSignal] = useState(0);

  const widthClass = settings.messageWidth === "wide" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="flex h-full min-h-0 flex-col">
      {activeConversation ? (
        <>
          <ChatHeader conversation={activeConversation} />
          <MessageList
            key={activeConversation.id}
            conversation={activeConversation}
          />
          <div className="shrink-0 bg-gradient-to-t from-canvas via-canvas/95 to-transparent px-3 pb-3 pt-2 sm:px-6">
            <div className={cn("mx-auto w-full", widthClass)}>
              <Composer
                variant="docked"
                value={draft}
                onValueChange={setDraft}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                focusSignal={focusSignal}
              />
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] text-faint">
                <span>Simulated demo replies — nothing is generated, uploaded, or sent.</span>
                <span className="hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="hidden sm:inline">
                  {settings.enterToSend
                    ? "Enter to send · Shift+Enter for a new line"
                    : "⌘/Ctrl + Enter to send"}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <WelcomeScreen
          composer={
            <Composer
              variant="welcome"
              value={draft}
              onValueChange={setDraft}
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              focusSignal={focusSignal}
            />
          }
          onSuggestion={(prompt) => {
            setDraft(prompt);
            setFocusSignal((signal) => signal + 1);
          }}
        />
      )}
    </div>
  );
}
