import type { Metadata } from "next";
import { ChatWorkspace } from "@/components/chat/chat-workspace";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "The KRYPTON AI workspace: a frontend-only demonstration with sample conversations, three model tiers, and a simulated composer.",
};

/**
 * The workspace is the product, so the root route renders the assistant.
 * `/chat` remains addressable for deep links and sidebar navigation.
 */
export default function RootPage() {
  return <ChatWorkspace />;
}
