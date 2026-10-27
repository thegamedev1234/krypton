import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "shrink-0 border-b border-line/70 bg-canvas/40 px-4 py-4 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.12em] text-faint">
            <Icon className="h-3 w-3" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-1 text-[17px] font-semibold tracking-[-0.015em] text-ink sm:text-lg">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
