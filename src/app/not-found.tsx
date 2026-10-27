import Link from "next/link";
import { ArrowLeft, Compass, MessageSquarePlus } from "lucide-react";
import { KryptonMark } from "@/components/brand/krypton-mark";

export default function NotFound() {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-10">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex w-fit items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-2xs font-medium uppercase tracking-[0.14em] text-faint">
          <KryptonMark size={16} />
          Not found
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink">
          This route doesn&apos;t exist
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The page you followed isn&apos;t part of the KRYPTON demo. Head back to the workspace and
          pick up from a sample conversation or a clean composer.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/chat"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-3.5 text-[13px] font-medium text-accentInk transition-colors hover:bg-accentStrong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Open the workspace
          </Link>
          <Link
            href="/tools"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-raised/60 px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-lineStrong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <Compass className="h-3.5 w-3.5" />
            Explore tools
          </Link>
        </div>
        <p className="mt-8 inline-flex items-center gap-1.5 text-[10px] text-faint">
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Frontend demo · no backend connected
        </p>
      </div>
    </div>
  );
}
