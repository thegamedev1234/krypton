"use client";

import { useState, type ReactNode } from "react";
import {
  CloudOff,
  Database,
  Info,
  Keyboard,
  LayoutPanelLeft,
  Lock,
  MessagesSquare,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Segmented, Switch } from "@/components/ui/switch";
import { DEMO_PROFILE, KEYBOARD_SHORTCUTS } from "@/lib/demo-data";
import { getModel, MODEL_TONE_CLASSES, MODELS } from "@/lib/models";
import { cn } from "@/lib/utils";
import type { MessageWidth, ModelId, ThemePreference } from "@/types";

const SECTION_LINKS = [
  { id: "identity", label: "Profile" },
  { id: "appearance", label: "Appearance" },
  { id: "chat", label: "Chat" },
  { id: "model", label: "Model" },
  { id: "interface", label: "Interface" },
  { id: "shortcuts", label: "Shortcuts" },
  { id: "about", label: "About" },
];

function SettingsCard({
  id,
  title,
  description,
  icon: Icon,
  children,
  footer,
  aside,
}: {
  id: string;
  title: string;
  description: string;
  icon: typeof Palette;
  children: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-4 overflow-hidden rounded-2xl border border-line bg-surface/45"
    >
      <header className="flex items-start gap-2.5 border-b border-line/70 px-4 py-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas/50 text-accentStrong">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={`${id}-heading`} className="text-[13px] font-semibold text-ink">
              {title}
            </h2>
            {aside}
          </div>
          <p className="mt-0.5 text-[11px] leading-4 text-muted">{description}</p>
        </div>
      </header>
      <div className="divide-y divide-line/50 px-4">{children}</div>
      {footer ? (
        <div className="border-t border-line/70 bg-canvas/30 px-4 py-2.5 text-[10px] leading-4 text-faint">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

function ControlRow({
  label,
  description,
  control,
  hint,
}: {
  label: string;
  description: string;
  control: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2.5 py-3">
      <div className="min-w-[12rem] flex-1">
        <p className="text-[13px] font-medium text-ink">{label}</p>
        <p className="mt-0.5 max-w-lg text-xs leading-relaxed text-muted">{description}</p>
        {hint ? <p className="mt-1 text-[10px] text-faint">{hint}</p> : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export function SettingsView() {
  const {
    settings,
    updateSetting,
    resetSettings,
    selectedModelId,
    setSelectedModelId,
    pushToast,
    hydrated,
  } = useWorkspace();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Interface preferences for this demonstration. Changes apply instantly and are stored only in this browser."
        icon={Settings2}
        actions={
          <>
            <Badge tone="neutral" className="h-7 px-2">
              <ShieldCheck className="h-2.5 w-2.5" />
              UI-only
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmReset(true)}
              disabled={!hydrated}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset defaults
            </Button>
          </>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-6">
          {/* In-page nav */}
          <nav
            aria-label="Settings sections"
            className="mb-4 flex flex-wrap gap-1.5 rounded-xl border border-line/60 bg-surface/40 p-1.5"
          >
            {SECTION_LINKS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-raised hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="space-y-4">
            {/* Identity ------------------------------------------------ */}
            <SettingsCard
              id="identity"
              title="Profile"
              description="A sample identity for this demo workspace. There is no sign-in, session, or account data."
              icon={UserRound}
              aside={<Badge tone="warning">Demo identity</Badge>}
              footer="A real profile area would need authentication and a user service. Neither exists in this build."
            >
              <div className="flex flex-wrap items-center gap-3 py-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-[linear-gradient(145deg,rgb(var(--raised)),rgb(var(--panel)))] text-xs font-semibold text-ink-soft">
                  {DEMO_PROFILE.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-ink">
                    {DEMO_PROFILE.displayName}
                    <span className="flex items-center gap-1 rounded-full border border-warning/25 bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                      <StatusDot tone="warning" />
                      Guest
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {DEMO_PROFILE.plan} · not authenticated
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button variant="secondary" size="sm" disabled title="Authentication is not part of this build">
                    Sign in
                  </Button>
                  <Button variant="ghost" size="sm" disabled title="Billing is not part of this build">
                    Manage plan
                  </Button>
                </div>
              </div>
            </SettingsCard>

            {/* Appearance --------------------------------------------- */}
            <SettingsCard
              id="appearance"
              title="Appearance"
              description="Theme and motion preferences applied to this interface."
              icon={Palette}
              aside={<Badge tone="neutral">UI only</Badge>}
              footer="Saved to localStorage in this browser. Clearing site data resets these preferences."
            >
              <ControlRow
                label="Theme"
                description="Dark is the designed default. System follows your operating system preference."
                control={
                  <Segmented<ThemePreference>
                    label="Theme"
                    value={settings.theme}
                    onChange={(value) => updateSetting("theme", value)}
                    options={[
                      { value: "dark", label: "Dark", icon: <Moon className="h-3 w-3" /> },
                      { value: "light", label: "Light", icon: <Sun className="h-3 w-3" /> },
                      { value: "system", label: "System", icon: <Monitor className="h-3 w-3" /> },
                    ]}
                  />
                }
              />
              <Switch
                label="Reduce motion"
                description="Removes entrance animations and transitions. The OS-level reduced-motion preference is always respected."
                checked={settings.reduceMotion}
                onChange={(checked) => updateSetting("reduceMotion", checked)}
              />
              <Switch
                label="Reduce transparency"
                description="Replaces blurred menu surfaces with solid backgrounds for better readability."
                checked={settings.reduceTransparency}
                onChange={(checked) => updateSetting("reduceTransparency", checked)}
              />
            </SettingsCard>

            {/* Chat ---------------------------------------------------- */}
            <SettingsCard
              id="chat"
              title="Chat preferences"
              description="How the composer and demo transcript behave in this session."
              icon={MessagesSquare}
              footer="These preferences only affect the local demo. A backend would decide real streaming behaviour."
            >
              <Switch
                label="Enter to send"
                description="When off, Enter inserts a new line and ⌘/Ctrl + Enter sends the message."
                checked={settings.enterToSend}
                onChange={(checked) => updateSetting("enterToSend", checked)}
              />
              <Switch
                label="Show timestamps"
                description="Displays the local sample clock time beside each message."
                checked={settings.showTimestamps}
                onChange={(checked) => updateSetting("showTimestamps", checked)}
              />
              <Switch
                label="Simulate streaming"
                description="Streams demo text word by word. Turn off to render each sample reply in one step."
                checked={settings.simulateStreaming}
                onChange={(checked) => updateSetting("simulateStreaming", checked)}
              />
              <Switch
                label="Show welcome suggestions"
                description="Displays the prompt cards on the empty workspace. Turning this off leaves a clean composer view."
                checked={settings.showWelcomeSuggestions}
                onChange={(checked) => updateSetting("showWelcomeSuggestions", checked)}
              />
            </SettingsCard>

            {/* Model --------------------------------------------------- */}
            <SettingsCard
              id="model"
              title="Default model"
              description="The tier preselected for new chats and the composer. Changing it here also updates the active composer."
              icon={Sparkles}
              aside={<Badge tone="neutral">No provider connected</Badge>}
              footer="Krypton-7, Krypton-5, and Krypton-lite are product labels for this interface. No inference service is connected."
            >
              <div className="grid gap-2 py-3.5 sm:grid-cols-3" role="radiogroup" aria-label="Default model">
                {MODELS.map((model) => {
                  const tone = MODEL_TONE_CLASSES[model.tone];
                  const active = settings.defaultModelId === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setSelectedModelId(model.id as ModelId);
                        pushToast({
                          title: `Default model set to ${model.name}`,
                          description: "Demo preference — no request is made.",
                          tone: "neutral",
                        });
                      }}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        active
                          ? "border-accent/40 bg-accent/[0.07]"
                          : "border-line bg-canvas/40 hover:border-lineStrong",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                          <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden="true" />
                          {model.name}
                        </span>
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border",
                            active ? "border-accent bg-accent text-accentInk" : "border-lineStrong",
                          )}
                          aria-hidden="true"
                        >
                          {active ? <span className="h-1.5 w-1.5 rounded-full bg-accentInk" /> : null}
                        </span>
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 text-muted">
                        {model.shortDescription}
                      </span>
                      <span className="mt-2 inline-flex rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-faint">
                        {model.speedLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
              <ControlRow
                label="Current tier in the composer"
                description={`The open workspace is using ${getModel(selectedModelId).name}. Opening a sample conversation temporarily adopts that thread's tier; a new chat returns to the default above.`}
                control={<Badge tone="accent">{getModel(selectedModelId).name}</Badge>}
              />
            </SettingsCard>

            {/* Interface ----------------------------------------------- */}
            <SettingsCard
              id="interface"
              title="Interface"
              description="Layout density and navigation defaults."
              icon={LayoutPanelLeft}
              footer="Sidebar width and reading width are stored locally, like all other preferences here."
            >
              <ControlRow
                label="Message width"
                description="Controls the maximum reading width of the transcript and composer."
                control={
                  <Segmented<MessageWidth>
                    label="Message width"
                    value={settings.messageWidth}
                    onChange={(value) => updateSetting("messageWidth", value)}
                    options={[
                      { value: "comfortable", label: "Comfortable" },
                      { value: "wide", label: "Wide" },
                    ]}
                  />
                }
              />
              <Switch
                label="Start with sidebar collapsed"
                description="Applies the next time the workspace loads in this browser."
                checked={settings.sidebarDefaultCollapsed}
                onChange={(checked) => updateSetting("sidebarDefaultCollapsed", checked)}
              />
              <Switch
                label="Show keyboard hints"
                description="Displays ⌘K, /, and Enter hints in the sidebar and composer."
                checked={settings.showKeyboardHints}
                onChange={(checked) => updateSetting("showKeyboardHints", checked)}
              />
            </SettingsCard>

            {/* Shortcuts ----------------------------------------------- */}
            <SettingsCard
              id="shortcuts"
              title="Keyboard shortcuts"
              description="Shortcuts that work today, plus the ones planned for a later release."
              icon={Keyboard}
              aside={<Badge tone="neutral">⌘ = Ctrl on Windows</Badge>}
            >
              <div className="py-1.5">
                {(["Navigation", "Composer", "Interface"] as const).map((group) => {
                  const entries = KEYBOARD_SHORTCUTS.filter((shortcut) => shortcut.group === group);
                  if (entries.length === 0) return null;
                  return (
                    <div key={group} className="py-2">
                      <p className="mb-1.5 text-2xs font-semibold uppercase tracking-[0.1em] text-faint">
                        {group}
                      </p>
                      <ul className="space-y-1">
                        {entries.map((shortcut) => (
                          <li
                            key={shortcut.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-1 py-1.5"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span
                                className={cn(
                                  "text-xs",
                                  shortcut.status === "active" ? "text-ink-soft" : "text-faint",
                                )}
                              >
                                {shortcut.label}
                              </span>
                              {shortcut.status === "planned" ? (
                                <Badge tone="neutral">Planned</Badge>
                              ) : null}
                            </span>
                            <span className="flex items-center gap-1">
                              {shortcut.keys.map((key) => (
                                <kbd key={key} className="kbd h-5 min-w-5 px-1.5 text-[10px]">
                                  {key}
                                </kbd>
                              ))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </SettingsCard>

            {/* About --------------------------------------------------- */}
            <SettingsCard
              id="about"
              title="About KRYPTON"
              description="A frontend-only demonstration of a premium AI workspace."
              icon={Info}
              aside={<Badge tone="accent">v0.1.0 · demo</Badge>}
            >
              <div className="grid gap-3 py-3.5 sm:grid-cols-2">
                <dl className="space-y-2 text-xs">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Interface</dt>
                    <dd className="text-ink-soft">Next.js App Router</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Language</dt>
                    <dd className="text-ink-soft">React + TypeScript</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Styling</dt>
                    <dd className="text-ink-soft">Tailwind CSS tokens</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Data</dt>
                    <dd className="text-ink-soft">Local demo state</dd>
                  </div>
                </dl>
                <div className="rounded-xl border border-line/70 bg-canvas/40 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                    <CloudOff className="h-3.5 w-3.5 text-warning" />
                    Deliberately not included
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11px] leading-4 text-muted">
                    <li>No model provider or API keys</li>
                    <li>No authentication or accounts</li>
                    <li>No database, storage, or uploads</li>
                    <li>No web search, voice, or automation</li>
                    <li>No API routes or server actions</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-line/50 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                  <Database className="h-3.5 w-3.5 text-accentStrong" />
                  Requires a backend in a later phase
                </p>
                <ul className="mt-1.5 grid gap-1 text-[11px] leading-4 text-muted sm:grid-cols-2">
                  <li>Conversation history and search</li>
                  <li>Account identity and sign-in</li>
                  <li>Synced preferences across devices</li>
                  <li>Artifact storage and sharing</li>
                  <li>Model routing and streaming</li>
                  <li>Connected tools and file ingestion</li>
                </ul>
              </div>
            </SettingsCard>

            <p className="flex items-start gap-1.5 pb-2 text-[10px] leading-4 text-faint">
              <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              All preferences on this page are UI-only and stored in this browser. Nothing is sent
              to a server, and no credentials or environment variables are used anywhere in this
              build.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          resetSettings();
          setConfirmReset(false);
          pushToast({
            title: "Settings reset",
            description: "Interface preferences are back to their defaults.",
            tone: "positive",
          });
        }}
        title="Reset interface settings?"
        description="Theme, motion, composer behaviour, model default, and layout preferences return to their defaults. Demo conversations are not affected."
        confirmLabel="Reset settings"
        destructive
      />
    </div>
  );
}
