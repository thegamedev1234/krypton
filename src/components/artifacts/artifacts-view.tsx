"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Check,
  ChevronLeft,
  Code2,
  Copy,
  ExternalLink,
  Info,
  MonitorPlay,
  PanelLeft,
  Plus,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Markdown } from "@/components/chat/markdown";
import { CodeEditor } from "@/components/artifacts/code-editor";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Segmented } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { DEMO_ARTIFACTS } from "@/lib/demo-artifacts";
import {
  buildPreviewDocument,
  getMarkdownFile,
  getPrimaryFile,
  isMarkdownArtifact,
  LANGUAGE_META,
} from "@/lib/artifact-preview";
import { getModel, MODEL_TONE_CLASSES } from "@/lib/models";
import { clamp, cn, copyToClipboard, formatShortDate } from "@/lib/utils";
import type { Artifact, ArtifactFile } from "@/types";

type ViewMode = "code" | "split" | "preview";

const VIEW_OPTIONS: Array<{ value: ViewMode; label: string; icon: React.ReactNode }> = [
  { value: "code", label: "Code", icon: <Code2 className="h-3 w-3" /> },
  { value: "split", label: "Split", icon: <PanelLeft className="h-3 w-3" /> },
  { value: "preview", label: "Preview", icon: <MonitorPlay className="h-3 w-3" /> },
];

/* ------------------------------------------------------------------ */
/*  Artifact list                                                     */
/* ------------------------------------------------------------------ */

function ArtifactList({
  artifacts,
  selectedId,
  onSelect,
  layout = "vertical",
}: {
  artifacts: Artifact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  layout?: "vertical" | "horizontal";
}) {
  if (layout === "horizontal") {
    return (
      <div className="flex gap-2 overflow-x-auto px-3 py-2.5 lg:hidden no-scrollbar">
        {artifacts.map((artifact) => {
          const active = artifact.id === selectedId;
          return (
            <button
              key={artifact.id}
              type="button"
              onClick={() => onSelect(artifact.id)}
              aria-pressed={active}
              className={cn(
                "min-w-[13rem] shrink-0 rounded-xl border p-2.5 text-left transition-colors",
                active
                  ? "border-accent/35 bg-accent/[0.07]"
                  : "border-line bg-surface/60 hover:border-lineStrong",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-2xs font-semibold uppercase tracking-[0.1em] text-faint">
                  {artifact.kind}
                </span>
                {active ? <Check className="ml-auto h-3 w-3 text-accentStrong" /> : null}
              </span>
              <span className="mt-1 block truncate text-[13px] font-medium text-ink">
                {artifact.title}
              </span>
              <span className="mt-0.5 block text-[10px] text-faint">
                {artifact.files.length} files · {formatShortDate(artifact.updatedAt)}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <aside
      className="hidden w-[268px] shrink-0 flex-col border-r border-line/70 lg:flex"
      aria-label="Artifact list"
    >
      <div className="flex items-center justify-between border-b border-line/70 px-3.5 py-2.5">
        <h2 className="text-2xs font-semibold uppercase tracking-[0.12em] text-faint">
          Artifacts
        </h2>
        <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-faint">
          {artifacts.length}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {artifacts.map((artifact) => {
            const active = artifact.id === selectedId;
            const model = getModel(artifact.modelId);
            const tone = MODEL_TONE_CLASSES[model.tone];
            return (
              <button
                key={artifact.id}
                type="button"
                onClick={() => onSelect(artifact.id)}
                aria-pressed={active}
                className={cn(
                  "w-full rounded-xl border p-2.5 text-left transition-colors duration-150",
                  active
                    ? "border-accent/30 bg-accent/[0.07]"
                    : "border-transparent hover:border-line hover:bg-raised/50",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Box className={cn("h-3 w-3", active ? "text-accentStrong" : "text-faint")} />
                  <span className="text-2xs font-medium uppercase tracking-[0.08em] text-faint">
                    {artifact.kind}
                  </span>
                  {active ? <Check className="ml-auto h-3 w-3 text-accentStrong" /> : null}
                </span>
                <span className="mt-1 block text-[13px] font-medium leading-5 text-ink">
                  {artifact.title}
                </span>
                <span className="mt-1.5 flex items-center gap-1.5 text-[10px] text-faint">
                  <span className={cn("h-1 w-1 rounded-full", tone.dot)} aria-hidden="true" />
                  {model.name}
                  <span aria-hidden="true">·</span>
                  {artifact.files.length} files
                  <span aria-hidden="true">·</span>
                  {formatShortDate(artifact.updatedAt)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="border-t border-line/70 p-3">
        <p className="text-[10px] leading-4 text-faint">
          Local demo objects. Artifacts are not stored, shared, or synced.
        </p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Panels                                                            */
/* ------------------------------------------------------------------ */

function CodePanel({ file }: { file: ArtifactFile }) {
  const meta = LANGUAGE_META[file.language];
  const [copied, setCopied] = useState(false);
  const { pushToast } = useWorkspace();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const ok = await copyToClipboard(file.content);
    setCopied(ok);
    pushToast({
      title: ok ? `${file.name} copied` : "Copy failed",
      tone: ok ? "positive" : "danger",
    });
  }

  return (
    <section
      className="flex h-[56dvh] min-h-[320px] shrink-0 flex-col overflow-hidden rounded-xl border border-line bg-panel lg:h-auto lg:min-h-0 lg:flex-1"
      aria-label={`Code for ${file.name}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line/70 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
          <span className="truncate font-mono text-[11px] text-ink-soft">{file.name}</span>
          <span className="hidden rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-faint sm:inline">
            {meta.label}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-2xs font-medium transition-colors",
            copied ? "text-positive" : "text-faint hover:bg-raised hover:text-ink",
          )}
          aria-label={`Copy ${file.name}`}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <CodeEditor file={file} />
    </section>
  );
}

function PreviewPanel({ artifact }: { artifact: Artifact }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const isMarkdown = isMarkdownArtifact(artifact);
  const markdownFile = getMarkdownFile(artifact);

  const srcDoc = useMemo(
    () => (isMarkdown ? "" : buildPreviewDocument(artifact)),
    [artifact, isMarkdown],
  );

  useEffect(() => {
    if (!refreshing) return;
    const timer = setTimeout(() => setRefreshing(false), 520);
    return () => clearTimeout(timer);
  }, [refreshing]);

  return (
    <section
      className="flex h-[56dvh] min-h-[320px] shrink-0 flex-col overflow-hidden rounded-xl border border-line bg-panel lg:h-auto lg:min-h-0 lg:flex-1"
      aria-label="Artifact preview"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line/70 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-2xs font-semibold uppercase tracking-[0.09em] text-faint">
            Preview
          </span>
          <Badge tone="neutral" className="hidden sm:inline-flex">
            <ShieldCheck className="h-2.5 w-2.5" />
            Sandboxed
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden rounded-md border border-line bg-surface px-2 py-1 font-mono text-[10px] text-faint sm:inline">
            {markdownFile?.name ?? "index.html"}
          </span>
          <Tooltip label="Refresh preview" side="top">
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="icon-btn h-7 w-7"
              aria-label="Refresh preview"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
            </button>
          </Tooltip>
          <Tooltip label="Preview is sandboxed — open in a new tab is disabled" side="top">
            <button
              type="button"
              disabled
              className="icon-btn h-7 w-7"
              aria-label="Open preview in a new tab — unavailable"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#06080f]">
        {isMarkdown && markdownFile ? (
          <div className="h-full overflow-y-auto bg-panel px-5 py-5">
            <Markdown content={markdownFile.content} />
          </div>
        ) : (
          <iframe
            key={refreshKey}
            title={`${artifact.title} preview`}
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            className="h-full w-full border-0 bg-[#06080f]"
          />
        )}
      </div>

      <div className="flex shrink-0 items-start gap-1.5 border-t border-line/70 px-3 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-faint" aria-hidden="true" />
        <p className="text-[10px] leading-4 text-faint">
          {isMarkdown
            ? "Markdown is rendered by the app itself, not executed."
            : "HTML, CSS, and JavaScript render inside a sandboxed iframe without same-origin access."}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Viewer                                                            */
/* ------------------------------------------------------------------ */

function ArtifactViewer({
  artifact,
  onClose,
}: {
  artifact: Artifact;
  onClose: () => void;
}) {
  const [activeFileId, setActiveFileId] = useState(getPrimaryFile(artifact).id);
  const [mode, setMode] = useState<ViewMode>("split");
  const [splitPercent, setSplitPercent] = useState(56);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const model = getModel(artifact.modelId);
  const tone = MODEL_TONE_CLASSES[model.tone];
  const activeFile =
    artifact.files.find((file) => file.id === activeFileId) ?? getPrimaryFile(artifact);

  useEffect(() => {
    setActiveFileId(getPrimaryFile(artifact).id);
  }, [artifact]);

  useEffect(() => {
    if (!dragging) return;

    function onPointerMove(event: PointerEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setSplitPercent(clamp(((event.clientX - rect.left) / rect.width) * 100, 30, 72));
    }

    function onPointerUp() {
      setDragging(false);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging]);

  const showCode = mode === "code" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Viewer header */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2 border-b border-line/70 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-accentStrong sm:flex">
            <Box className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="truncate text-[13px] font-semibold text-ink">{artifact.title}</h2>
              <DemoBadge />
              <Badge tone="neutral" className="hidden sm:inline-flex">
                {artifact.kind}
              </Badge>
            </div>
            <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-faint">
              <span className="flex items-center gap-1">
                <span className={cn("h-1 w-1 rounded-full", tone.dot)} aria-hidden="true" />
                {model.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>Updated {formatShortDate(artifact.updatedAt)}</span>
              <span aria-hidden="true">·</span>
              <span>Local demonstration object</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Segmented
            label="Artifact view mode"
            value={mode}
            onChange={setMode}
            options={VIEW_OPTIONS}
            className="p-0.5"
          />
          <Tooltip label="Close artifact" side="top">
            <button
              type="button"
              onClick={onClose}
              className="icon-btn h-7 w-7"
              aria-label="Close artifact"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* File tabs */}
      <div
        className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-line/70 px-3 py-1.5 no-scrollbar sm:px-4"
        role="tablist"
        aria-label="Artifact files"
      >
        <span className="mr-1 hidden items-center gap-1 text-[10px] text-faint sm:flex">
          <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          Files
        </span>
        {artifact.files.map((file) => {
          const meta = LANGUAGE_META[file.language];
          const active = file.id === activeFile.id;
          return (
            <button
              key={file.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setActiveFileId(file.id);
                if (mode === "preview") setMode("code");
              }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                active
                  ? "border-lineStrong/70 bg-raised text-ink"
                  : "border-transparent text-muted hover:bg-raised/60 hover:text-ink-soft",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden="true" />
              <span className="font-mono">{file.name}</span>
            </button>
          );
        })}
        <span className="ml-auto hidden shrink-0 pl-2 text-[10px] text-faint md:block">
          Drag the divider to resize
        </span>
      </div>

      {/* Panels */}
      <div
        ref={containerRef}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3 sm:p-4 lg:overflow-hidden",
          mode === "split" && "lg:grid",
        )}
        style={
          mode === "split"
            ? { gridTemplateColumns: `minmax(0, ${splitPercent}%) 8px minmax(0, 1fr)` }
            : undefined
        }
      >
        {showCode ? <CodePanel file={activeFile} /> : null}

        {mode === "split" ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize code and preview panels"
            aria-valuemin={30}
            aria-valuemax={72}
            aria-valuenow={Math.round(splitPercent)}
            tabIndex={0}
            onPointerDown={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setSplitPercent((value) => clamp(value - 4, 30, 72));
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                setSplitPercent((value) => clamp(value + 4, 30, 72));
              }
            }}
            className={cn(
              "hidden shrink-0 cursor-col-resize touch-none items-center justify-center rounded-full transition-colors lg:flex",
              dragging ? "bg-accent/50" : "bg-line/40 hover:bg-accent/35",
            )}
          >
            <span className="h-8 w-0.5 rounded-full bg-lineStrong/70" aria-hidden="true" />
          </div>
        ) : null}

        {showPreview ? <PreviewPanel artifact={artifact} /> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export function ArtifactsView() {
  const artifacts = DEMO_ARTIFACTS;
  const [selectedId, setSelectedId] = useState<string | null>(artifacts[0]?.id ?? null);
  const selected = artifacts.find((artifact) => artifact.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        eyebrow="Workspace"
        title="Artifacts"
        description="A local demonstration of code and rendered output side by side. Artifacts are seeded sample objects — nothing is generated, stored, or shared."
        icon={Box}
        actions={
          <>
            <Badge tone="neutral" className="h-7 px-2">
              <ShieldCheck className="h-2.5 w-2.5" />
              Sandboxed preview
            </Badge>
            <Tooltip label="Creating artifacts requires a model connection" side="bottom">
              <Button variant="primary" size="sm" disabled aria-label="New artifact — unavailable">
                <Plus className="h-3.5 w-3.5" />
                New artifact
              </Button>
            </Tooltip>
          </>
        }
      />

      <ArtifactList
        artifacts={artifacts}
        selectedId={selectedId}
        onSelect={setSelectedId}
        layout="horizontal"
      />

      <div className="flex min-h-0 flex-1">
        <ArtifactList
          artifacts={artifacts}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {selected ? (
          <ArtifactViewer
            key={selected.id}
            artifact={selected}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <EmptyState
              icon={Box}
              title="No artifact selected"
              description="Choose an artifact from the list to inspect its code and rendered preview. Everything here is local sample content."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedId(artifacts[0]?.id ?? null)}
                >
                  Open the first artifact
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
