import type { Metadata } from "next";
import { ChatWorkspace } from "@/components/chat/chat-workspace";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "A frontend demonstration of the KRYPTON chat workspace: sample conversations, model tiers, and a simulated composer.",
};

export default function ChatPage() {
  return <ChatWorkspace />;
}
