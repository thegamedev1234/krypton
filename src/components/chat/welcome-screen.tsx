"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Code2, Compass, GraduationCap, PenLine } from "lucide-react";
import { KryptonMark } from "@/components/brand/krypton-mark";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { DEMO_SUGGESTIONS } from "@/lib/demo-data";
import { getModel } from "@/lib/models";
import { cn } from "@/lib/utils";
import type { SuggestionIcon } from "@/types";

const SUGGESTION_ICONS: Record<SuggestionIcon, typeof Code2> = {
  code: Code2,
  pen: PenLine,
  compass: Compass,
  graduation: GraduationCap,
};

interface WelcomeScreenProps {
  composer: ReactNode;
  onSuggestion: (prompt: string) => void;
}

export function WelcomeScreen({ composer, onSuggestion }: WelcomeScreenProps) {
  const { settings, selectedModelId } = useWorkspace();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3">
            <KryptonMark size={36} decorative />
            <span className="rounded-full border border-line bg-surface/70 px-2 py-0.5 text-2xs font-medium uppercase tracking-[0.12em] text-faint">
              Workspace
            </span>
          </div>

          <h1 className="mt-6 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink sm:text-[32px]">
            What are we building today?
          </h1>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted">
            Ask a question, paste a stack trace, or start from a prompt below. This is a
            frontend demonstration — replies are pre-written local samples, not model output.
          </p>
        </div>

        <div className="mt-7 animate-fade-up [animation-delay:60ms]">{composer}</div>

        {settings.showWelcomeSuggestions ? (
          <section aria-labelledby="suggestion-heading" className="mt-6 animate-fade-up [animation-delay:120ms]">
            <div className="flex items-baseline justify-between">
              <h2
                id="suggestion-heading"
                className="text-2xs font-semibold uppercase tracking-[0.12em] text-faint"
              >
                Start with a prompt
              </h2>
              <span className="text-[10px] text-faint/80">Fills the composer</span>
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DEMO_SUGGESTIONS.map((suggestion) => {
                const Icon = SUGGESTION_ICONS[suggestion.icon];
                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => onSuggestion(suggestion.prompt)}
                    aria-label={`Use prompt: ${suggestion.title}`}
                    className={cn(
                      "group/suggestion flex items-start gap-2.5 rounded-xl border border-line bg-surface/50 p-3 text-left transition-all duration-150",
                      "hover:-translate-y-px hover:border-lineStrong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                    )}
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas/60 text-accentStrong transition-colors group-hover/suggestion:border-accent/30 group-hover/suggestion:text-accent">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">
                          {suggestion.category}
                        </span>
                        <ArrowUpRight className="h-3 w-3 -translate-x-0.5 text-faint opacity-0 transition-all duration-150 group-hover/suggestion:translate-x-0 group-hover/suggestion:opacity-100" />
                      </span>
                      <span className="mt-0.5 block text-[13px] font-medium leading-5 text-ink-soft group-hover/suggestion:text-ink">
                        {suggestion.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-faint">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
          Selected tier: {getModel(selectedModelId).name}
          <span aria-hidden="true">·</span>
          <span>No providers, files, or accounts are connected in this build.</span>
        </p>
      </div>
    </div>
  );
}
