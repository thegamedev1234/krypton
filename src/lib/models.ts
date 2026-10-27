import type { ModelId, ModelTier } from "@/types";

/**
 * KRYPTON model tiers.
 *
 * These are product labels for the interface only. This build has no model
 * provider connection — responses in the app come from a local demo script.
 */
export const MODELS: readonly ModelTier[] = [
  {
    id: "krypton-7",
    name: "Krypton-7",
    shortDescription: "Advanced coding and complex tasks",
    description:
      "The deepest tier. Built for multi-file refactors, architecture reviews, and reasoning that needs a long chain of thought.",
    tone: "violet",
    positioning: "Deep reasoning",
    strengths: ["Architecture", "Debugging", "Long context"],
    speedLabel: "Deliberate",
  },
  {
    id: "krypton-5",
    name: "Krypton-5",
    shortDescription: "Balanced everyday AI assistant",
    description:
      "The default tier. Handles writing, research, and everyday product work with a good balance of depth and speed.",
    tone: "accent",
    positioning: "Everyday work",
    strengths: ["Writing", "Research", "Analysis"],
    speedLabel: "Balanced",
  },
  {
    id: "krypton-lite",
    name: "Krypton-lite",
    shortDescription: "Fast, lightweight answers",
    description:
      "The quick tier. Best for short questions, rewrites, and small snippets where latency matters more than depth.",
    tone: "ice",
    positioning: "Low latency",
    strengths: ["Quick answers", "Rewrites", "Snippets"],
    speedLabel: "Fast",
  },
] as const;

export const DEFAULT_MODEL_ID: ModelId = "krypton-5";

export function getModel(modelId: ModelId): ModelTier {
  return MODELS.find((model) => model.id === modelId) ?? MODELS[1];
}

export const MODEL_TONE_CLASSES: Record<
  ModelTier["tone"],
  { dot: string; text: string; chip: string; ring: string }
> = {
  violet: {
    dot: "bg-violet",
    text: "text-violet",
    chip: "border-violet/25 bg-violet/10 text-violet",
    ring: "focus-visible:ring-violet/60",
  },
  accent: {
    dot: "bg-accent",
    text: "text-accentStrong",
    chip: "border-accent/25 bg-accent/10 text-accentStrong",
    ring: "focus-visible:ring-accent/60",
  },
  ice: {
    dot: "bg-ice",
    text: "text-ice",
    chip: "border-ice/25 bg-ice/10 text-ice",
    ring: "focus-visible:ring-ice/60",
  },
};
