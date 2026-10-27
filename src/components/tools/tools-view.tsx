"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Compass, Lock, Search, Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, ComingSoonBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { CAPABILITIES, CAPABILITY_CATEGORIES } from "@/lib/capabilities";
import { cn } from "@/lib/utils";
import type { Capability, CapabilityCategory } from "@/types";

function CategoryChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent/35 bg-accent/10 text-accentStrong"
          : "border-line bg-surface/60 text-muted hover:border-lineStrong hover:text-ink-soft",
      )}
    >
      {label}
      <span className={cn("font-mono text-[10px]", active ? "text-accentStrong/70" : "text-faint")}>
        {count}
      </span>
    </button>
  );
}

export function ToolsView() {
  const router = useRouter();
  const [category, setCategory] = useState<CapabilityCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Capability | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", CAPABILITIES.length);
    for (const capability of CAPABILITIES) {
      map.set(capability.category, (map.get(capability.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return CAPABILITIES.filter((capability) => {
      const matchesCategory = category === "All" || capability.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        capability.name.toLowerCase().includes(normalizedQuery) ||
        capability.summary.toLowerCase().includes(normalizedQuery) ||
        capability.highlights.some((highlight) =>
          highlight.toLowerCase().includes(normalizedQuery),
        );
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const demoCount = CAPABILITIES.filter((capability) => capability.status === "demo").length;
  const plannedCount = CAPABILITIES.length - demoCount;

  function openCapability(capability: Capability) {
    setSelected(capability);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        eyebrow="Discover"
        title="Explore tools"
        description="Capabilities planned for the KRYPTON workspace. Two have local demo interfaces; the rest are clearly marked as not connected."
        icon={Compass}
        actions={
          <div className="flex items-center gap-1.5">
            <Badge tone="accent">{demoCount} demo</Badge>
            <Badge tone="warning">{plannedCount} coming soon</Badge>
          </div>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
          {/* Intro strip */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line/70 bg-surface/40 px-3.5 py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-canvas/60 text-accentStrong">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="min-w-[14rem] flex-1 text-[12px] leading-5 text-muted">
              <span className="font-medium text-ink-soft">Roadmap, not a feature list.</span> Cards
              with a demo open sample conversations or artifacts. Everything else is a design
              preview with no backend behind it.
            </p>
            <div className="flex items-center gap-3 text-[10px] text-faint">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Demo available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
                Not connected
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 flex flex-col gap-3">
            <div className="relative max-w-sm">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint"
                aria-hidden="true"
              />
              <label htmlFor="capability-search" className="sr-only">
                Search capabilities
              </label>
              <input
                id="capability-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search capabilities"
                className="h-9 w-full rounded-lg border border-line bg-surface/60 pl-8 pr-8 text-base text-ink sm:text-xs placeholder:text-faint transition-colors focus:border-lineStrong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-faint hover:bg-raised hover:text-ink"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </div>

            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Filter by category"
            >
              {CAPABILITY_CATEGORIES.map((entry) => (
                <CategoryChip
                  key={entry}
                  label={entry}
                  active={category === entry}
                  count={counts.get(entry) ?? 0}
                  onClick={() => setCategory(entry)}
                />
              ))}
            </div>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No capabilities match"
              description="Try a different category or clear the search to see the full roadmap."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((capability) => {
                const Icon = capability.icon;
                const isDemo = capability.status === "demo";
                return (
                  <button
                    key={capability.id}
                    type="button"
                    onClick={() => openCapability(capability)}
                    aria-label={`${capability.name}. ${
                      isDemo ? "Demo interface available." : "Coming soon."
                    } Open details`}
                    className={cn(
                      "group/card flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-3.5 text-left transition-all duration-150",
                      "hover:-translate-y-px hover:border-lineStrong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg border",
                          isDemo
                            ? "border-accent/25 bg-accent/10 text-accentStrong"
                            : "border-line bg-canvas/60 text-faint",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {isDemo ? (
                        <Badge tone="accent">Demo</Badge>
                      ) : (
                        <ComingSoonBadge />
                      )}
                    </div>

                    <h3 className="mt-2.5 text-[13px] font-semibold text-ink">
                      {capability.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{capability.summary}</p>

                    <ul className="mt-2.5 flex flex-wrap gap-1">
                      {capability.highlights.slice(0, 2).map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded border border-line/80 bg-canvas/40 px-1.5 py-0.5 text-[10px] text-faint"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <span className="text-[10px] uppercase tracking-[0.08em] text-faint">
                        {capability.category}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-[11px] font-medium",
                          isDemo ? "text-accentStrong" : "text-muted",
                        )}
                      >
                        {isDemo ? "Open demo" : "View scope"}
                        <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <p className="mt-5 flex items-start gap-1.5 border-t border-line/60 pt-3 text-[10px] leading-4 text-faint">
            <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            No capability on this page performs real work. There are no API keys, provider
            connections, browsing sessions, file uploads, or automations in this frontend build.
          </p>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected?.summary}
        widthClassName="max-w-lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Close
            </Button>
            {selected?.status === "demo" && selected.href ? (
              <Button
                variant="primary"
                onClick={() => {
                  const href = selected.href;
                  setSelected(null);
                  if (href) router.push(href);
                }}
              >
                Open demo chat
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button variant="primary" disabled title="Requires a backend that is not connected">
                Not available yet
              </Button>
            )}
          </>
        }
      >
        {selected ? (
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              {selected.status === "demo" ? (
                <Badge tone="accent">Local demo interface</Badge>
              ) : (
                <ComingSoonBadge />
              )}
              <Badge tone="neutral">{selected.category}</Badge>
            </div>

            <p className="text-[13px] leading-relaxed text-ink-soft">{selected.details}</p>

            <div>
              <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-faint">
                Planned scope
              </p>
              <ul className="mt-1.5 grid gap-1.5">
                {selected.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-xs text-ink-soft">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/70"
                      aria-hidden="true"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <p className="rounded-lg border border-warning/20 bg-warning/[0.06] px-2.5 py-2 text-[11px] leading-4 text-warning/90">
              {selected.statusNote}
            </p>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
