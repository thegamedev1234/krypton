import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  label?: string;
  className?: string;
}

export function TypingIndicator({ label = "Composing a demo response", className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)} role="status" aria-live="polite">
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 animate-dot-pulse rounded-full bg-accent/80"
            style={{ animationDelay: `${index * 160}ms` }}
          />
        ))}
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
