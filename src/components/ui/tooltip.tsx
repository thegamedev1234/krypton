"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

const SIDE_CLASSES: Record<Side, string> = {
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
  left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
};

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: Side;
  className?: string;
  /** Wrap inline-flex (default) or block for full-width children. */
  block?: boolean;
}

/**
 * Lightweight CSS tooltip. Visible on hover and keyboard focus-within, and
 * linked to the trigger through aria-describedby for screen readers.
 */
export function Tooltip({
  label,
  children,
  side = "top",
  className,
  block = false,
}: TooltipProps) {
  const id = useId();

  return (
    <span
      className={cn("group/tt relative", block ? "block w-full" : "inline-flex")}
      aria-describedby={id}
    >
      {children}
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute z-[60] max-w-[16rem] whitespace-nowrap rounded-md border border-lineStrong/70 bg-raised px-2 py-1 text-2xs font-medium text-ink-soft opacity-0 shadow-pop transition-opacity duration-150",
          "group-hover/tt:opacity-100 group-focus-within/tt:opacity-100",
          "hidden sm:block",
          SIDE_CLASSES[side],
          className,
        )}
      >
        {label}
      </span>
    </span>
  );
}
