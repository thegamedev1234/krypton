import { cn } from "@/lib/utils";

interface KryptonMarkProps {
  size?: number;
  className?: string;
  /** Decorative when paired with the wordmark. */
  decorative?: boolean;
}

/**
 * KRYPTON symbol: a faceted "K" set into a rounded prism.
 * Pure CSS + inline SVG so it stays crisp at every size, needs no asset
 * pipeline, and renders identically on the server and the client.
 */
export function KryptonMark({ size = 28, className, decorative = true }: KryptonMarkProps) {
  return (
    <span
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "KRYPTON"}
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[28%]",
        "bg-[linear-gradient(145deg,#9CC0FF_0%,#6C9CFF_48%,#9684FF_100%)]",
        "shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22),0_1px_2px_rgb(0_0_0/0.35)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M11.4 8.6v14.8M20.9 9.2 12.6 16l8.6 7.2"
          stroke="#06122A"
          strokeOpacity="0.88"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.4 8.8v14.4"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function KryptonWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn("text-[13px] font-semibold uppercase tracking-[0.22em] text-ink", className)}
    >
      Krypton
    </span>
  );
}
