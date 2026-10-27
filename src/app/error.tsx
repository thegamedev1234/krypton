"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure in the console for debugging. No telemetry is sent.
    console.error("KRYPTON interface error:", error);
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-panel/80 p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-danger/30 bg-danger/10 text-danger">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-ink">Something broke in the interface</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          This demo runs entirely in your browser, so nothing was lost on a server. Try rendering
          the view again, or return to a fresh workspace.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[10px] text-faint">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-3.5 text-[13px] font-medium text-accentInk transition-colors hover:bg-accentStrong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
          <Link
            href="/chat"
            className="inline-flex h-9 items-center rounded-lg border border-line bg-raised/60 px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-lineStrong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            Back to workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
