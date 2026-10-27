"use client";

import { Check, Info, TriangleAlert, X } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { cn } from "@/lib/utils";

const TONE_ICON = {
  neutral: Info,
  positive: Check,
  danger: TriangleAlert,
} as const;

const TONE_STYLES = {
  neutral: "border-lineStrong/60 text-accentStrong",
  positive: "border-positive/30 text-positive",
  danger: "border-danger/30 text-danger",
} as const;

export function ToastViewport() {
  const { toasts, dismissToast } = useWorkspace();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col items-stretch gap-2 px-4 sm:left-auto sm:right-5 sm:translate-x-0 sm:items-end"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const Icon = TONE_ICON[toast.tone];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full animate-fade-up items-start gap-2.5 rounded-xl border border-line bg-panel/95 p-3 shadow-pop backdrop-blur-xl"
          >
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-surface",
                TONE_STYLES[toast.tone],
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-5 text-ink">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 text-xs leading-snug text-muted">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="icon-btn h-6 w-6"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
