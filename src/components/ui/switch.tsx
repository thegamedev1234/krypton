"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Shown next to the switch when a setting is backend-dependent. */
  trailing?: ReactNode;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  trailing,
}: SwitchProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

  return (
    <div className={cn("flex items-start justify-between gap-6 py-3", disabled && "opacity-60")}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={id} className="text-[13px] font-medium text-ink">
            {label}
          </label>
          {trailing}
        </div>
        {description ? (
          <p id={descriptionId} className="mt-0.5 max-w-lg text-xs leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
          checked
            ? "border-accent/60 bg-accent/80"
            : "border-lineStrong bg-raised",
          disabled && "pointer-events-none",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-all duration-200 ease-out-soft",
            checked ? "left-[1.1rem] bg-accentInk" : "left-[0.15rem] bg-muted",
          )}
        />
      </button>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  label: string;
  className?: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
              selected
                ? "bg-raised text-ink shadow-[0_1px_0_0_rgb(255_255_255/0.05)_inset]"
                : "text-muted hover:text-ink",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
