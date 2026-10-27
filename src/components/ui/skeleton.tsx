import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-raised",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/[0.06] after:to-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Placeholder rows used while demo data settles on first paint. */
export function ConversationSkeleton() {
  return (
    <div className="space-y-1 px-2" aria-hidden="true">
      {[82, 64, 90, 58].map((width, index) => (
        <div key={`${width}-${index}`} className="space-y-1.5 rounded-lg px-2 py-2">
          <Skeleton className="h-2.5" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-10" />
            <div style={{ width: `${width - 40}%` }}>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
