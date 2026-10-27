"use client";

import { useEffect, useState } from "react";
import { Copy, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { getModel, MODEL_TONE_CLASSES } from "@/lib/models";
import { cn, copyToClipboard, pluralize } from "@/lib/utils";
import type { Conversation } from "@/types";

export function ChatHeader({ conversation }: { conversation: Conversation }) {
  const { startNewChat, deleteConversation, pushToast } = useWorkspace();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const model = getModel(conversation.modelId);
  const tone = MODEL_TONE_CLASSES[model.tone];

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  function handleNewChat() {
    startNewChat();
    router.push("/chat");
  }

  async function copyTranscript() {
    const transcript = conversation.messages
      .map((message) => {
        const speaker =
          message.role === "assistant" ? `KRYPTON (${getModel(message.modelId ?? conversation.modelId).name}, demo)` : "You";
        return `${speaker}:\n${message.content}`;
      })
      .join("\n\n---\n\n");

    const ok = await copyToClipboard(transcript);
    if (ok) {
      setCopied(true);
      pushToast({ title: "Transcript copied", tone: "positive" });
    } else {
      pushToast({ title: "Copy failed", description: "Clipboard access was blocked.", tone: "danger" });
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line/70 bg-canvas/60 px-3 backdrop-blur-sm sm:gap-3 sm:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h1 className="truncate text-[13px] font-semibold text-ink" title={conversation.title}>
            {conversation.title}
          </h1>
          <p className="flex items-center gap-1.5 text-[10px] text-faint">
            <span className="truncate">{model.name}</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">
              {conversation.messages.length}{" "}
              {pluralize(conversation.messages.length, "message")}
            </span>
          </p>
        </div>
      </div>

      <Badge tone="neutral" className="hidden md:inline-flex">
        Simulated replies
      </Badge>

      <Tooltip label="Start a new chat" side="bottom">
        <Button size="sm" variant="secondary" onClick={handleNewChat} className="h-8">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New chat</span>
        </Button>
      </Tooltip>

      <Menu
        label="Conversation actions"
        minWidth={224}
        trigger={
          <button
            type="button"
            className="icon-btn"
            aria-label="Conversation actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        }
      >
        {(close) => (
          <>
            <MenuItem
              icon={copied ? <Copy className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              onClick={() => {
                void copyTranscript();
                close();
              }}
            >
              {copied ? "Transcript copied" : "Copy transcript"}
            </MenuItem>
            <MenuItem
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                handleNewChat();
                close();
              }}
            >
              New chat
            </MenuItem>
            <MenuSeparator />
            <MenuItem
              icon={<Trash2 className="h-3.5 w-3.5" />}
              destructive
              onClick={() => {
                setConfirmDelete(true);
                close();
              }}
            >
              Delete conversation
            </MenuItem>
          </>
        )}
      </Menu>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteConversation(conversation.id);
          setConfirmDelete(false);
        }}
        title="Delete this conversation?"
        description={`“${conversation.title}” will be removed from this demo session. Nothing was saved, so a refresh restores the sample list.`}
        confirmLabel="Delete conversation"
        destructive
      />
    </header>
  );
}
