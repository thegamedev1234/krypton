import type { ModelId } from "@/types";
import { createSimulatedReply } from "@/lib/demo-chat";

/**
 * The seam between the interface and (a future) backend.
 *
 * The application only depends on this interface. Today the single
 * implementation is a local script; a later phase can add an HTTP/streaming
 * client here without touching the chat components or the workspace provider.
 */
export interface AssistantRequest {
  prompt: string;
  modelId: ModelId;
  /** Retry count for the same message, used to vary demo output. */
  attempt?: number;
}

export interface AssistantClient {
  readonly id: string;
  /** False for any future implementation that talks to a real service. */
  readonly isSimulated: boolean;
  reply: (request: AssistantRequest) => string;
}

export const demoAssistantClient: AssistantClient = {
  id: "krypton-demo-script",
  isSimulated: true,
  reply: ({ prompt, modelId, attempt }) => createSimulatedReply(prompt, modelId, attempt ?? 0),
};
