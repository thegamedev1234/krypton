"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accentInk hover:bg-accentStrong active:bg-accent shadow-[0_1px_0_0_rgb(255_255_255/0.18)_inset] disabled:bg-accent/40 disabled:text-accentInk/70",
  secondary:
    "border border-line bg-raised/70 text-ink-soft hover:border-lineStrong hover:text-ink hover:bg-raised",
  ghost:
    "text-muted hover:bg-raised hover:text-ink active:bg-raised/80",
  danger:
    "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15 hover:border-danger/45",
  subtle:
    "border border-accent/20 bg-accent/10 text-accentStrong hover:bg-accent/15 hover:border-accent/35",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-2.5 text-xs",
  md: "h-9 gap-2 rounded-lg px-3 text-[13px]",
  lg: "h-10 gap-2 rounded-xl px-4 text-sm",
  icon: "h-9 w-9 rounded-lg",
  "icon-sm": "h-7 w-7 rounded-md",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:pointer-events-none disabled:opacity-45",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
