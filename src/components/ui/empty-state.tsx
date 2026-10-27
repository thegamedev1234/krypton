import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  secondary?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondary,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-4 py-8" : "px-6 py-14",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-2xl border border-line bg-surface text-faint",
          compact ? "h-10 w-10" : "h-12 w-12",
        )}
        aria-hidden="true"
      >
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </span>
      <h3 className="mt-3.5 text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
      {secondary ? <div className="mt-3">{secondary}</div> : null}
    </div>
  );
}
