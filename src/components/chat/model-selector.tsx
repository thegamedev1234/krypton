"use client";

import { Check, ChevronDown, Sparkles } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { Menu } from "@/components/ui/menu";
import { getModel, MODELS, MODEL_TONE_CLASSES } from "@/lib/models";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  /** `compact` is used inside the composer; `full` in the chat header. */
  variant?: "compact" | "full";
}

export function ModelSelector({ variant = "compact" }: ModelSelectorProps) {
  const { selectedModelId, setSelectedModelId, pushToast } = useWorkspace();
  const selected = getModel(selectedModelId);
  const tone = MODEL_TONE_CLASSES[selected.tone];

  return (
    <Menu
      label="Select a KRYPTON model tier"
      align="end"
      minWidth={344}
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/70 font-medium text-ink-soft transition-colors",
            "hover:border-lineStrong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
            variant === "compact" ? "h-8 px-2 text-xs" : "h-8 px-2.5 text-xs",
          )}
          aria-label={`Model: ${selected.name}. Change model`}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden="true" />
          <span className="whitespace-nowrap">{selected.name}</span>
          <ChevronDown className="h-3 w-3 text-faint" aria-hidden="true" />
        </button>
      }
    >
      {(close) => (
        <div>
          <div className="flex items-start gap-2.5 px-2.5 pb-2.5 pt-2">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface text-accentStrong">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">Choose a tier</p>
              <p className="mt-0.5 text-2xs leading-4 text-muted">
                Product tiers for this interface. No model provider is connected.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {MODELS.map((model) => {
              const modelTone = MODEL_TONE_CLASSES[model.tone];
              const isSelected = model.id === selectedModelId;
              return (
                <button
                  key={model.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    close();
                    if (model.id !== selectedModelId) {
                      pushToast({
                        title: `Model set to ${model.name}`,
                        description: "Affects the demo script only — no request is made.",
                        tone: "neutral",
                      });
                    }
                  }}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-lineStrong/70 bg-raised"
                      : "border-transparent hover:border-line hover:bg-raised/60",
                  )}
                >
                  <span
                    className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", modelTone.chip)}
                    aria-hidden="true"
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", modelTone.dot)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-ink">{model.name}</span>
                      <span className="rounded border border-line bg-surface px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-faint">
                        {model.positioning}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-4 text-muted">
                      {model.description}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-faint">
                      <span>{model.speedLabel}</span>
                      {model.strengths.map((strength) => (
                        <span key={strength} className="flex items-center gap-1">
                          <span className="h-0.5 w-0.5 rounded-full bg-lineStrong" aria-hidden="true" />
                          {strength}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isSelected ? (
                    <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", modelTone.text)} />
                  ) : null}
                </button>
              );
            })}
          </div>

          <p className="mt-2 border-t border-line/70 px-2.5 pb-1 pt-2 text-[10px] leading-4 text-faint">
            Switching tiers changes the demo conversation prefix and the model label. Replies are
            pre-written sample content.
          </p>
        </div>
      )}
    </Menu>
  );
}
