# KRYPTON — AI workspace (frontend only)

A polished, dark-first AI workspace interface built with **Next.js App Router**, **React**,
**TypeScript**, **Tailwind CSS**, **Lucide**, and self-hosted **Geist** typography. Conversations, model tiers, artifacts, tools, and
settings are all demonstrated with local React state.

> **This repository is a frontend demonstration.** There is no model provider, API route, server
> action, database, authentication, file ingestion, web search, voice, or automation. Every
> assistant reply is pre-written sample content rendered in the UI and explicitly labelled
> "Demo". It is intentionally easy to attach a real backend later — see
> [Adding a backend](#adding-a-backend).

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

Quality gates used for this build:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # production build
```

### Deploying to Vercel

Standard zero-configuration Next.js deployment:

1. Push this repository to GitHub.
2. Import it in Vercel and keep the detected defaults
   (framework **Next.js**, install `npm install`, build `npm run build`, output handled by Next).
3. No environment variables, secrets, or custom server settings are required.

---

## Routes

| Route        | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| `/`          | Assistant workspace (welcome screen or active conversation)                  |
| `/chat`      | Same workspace, addressable route used by sidebar navigation                |
| `/artifacts` | Artifact list, code view, and sandboxed preview                             |
| `/tools`     | Capability roadmap with honest demo / coming-soon status                    |
| `/settings`  | Interface-only preferences, shortcuts, and the about panel                  |
| `*`          | Styled 404 inside the application shell                                      |

---

## What is implemented

### Shell and navigation

- Persistent sidebar with KRYPTON mark + wordmark, new chat, conversation search, pinned
  conversations, groups for **Today / Yesterday / Previous**, section navigation, settings, and a
  guest profile area.
- Collapsible desktop rail (icon-only with tooltips) and an accessible mobile drawer
  (Escape to close, focus moved into the panel, backdrop dismissal).
- Global shortcuts: `⌘/Ctrl + K` new chat, `⌘/Ctrl + B` toggle sidebar, `/` focus conversation
  search. Planned shortcuts are labelled as planned rather than faked.

### Chat workspace

- Welcome screen with a compact symbol, headline, supporting copy, prominent composer, and four
  suggested prompts that fill (never auto-send) the composer.
- Sample conversations with markdown rendering: paragraphs, lists, ordered lists, tables, inline
  code, fenced code with syntax highlighting and per-block copy, blockquotes, and links.
- Assistant turns show the model tier and a **Demo** badge; user turns are visually distinct.
- Copy response, retry the latest response, streaming simulation with a caret, pending typing
  indicator, stop control, stopped state, and an error state with retry.
- Composer: auto-growing textarea, Enter to send / Shift+Enter for a new line (configurable),
  attachment demo with validation, character counter, tools menu, tier selector, and a stop button
  while a demo response streams.

### Model tiers

`Krypton-7` (advanced coding and complex tasks), `Krypton-5` (balanced everyday assistant), and
`Krypton-lite` (fast, lightweight answers) are selectable from the composer, the welcome state, and
settings. These are KRYPTON product labels for this interface — not third-party models.

### Artifacts

- Artifact list with kind, model, file count, and updated date.
- Code panel with line numbers, syntax highlighting, per-file tabs (HTML / CSS / JavaScript /
  Markdown), and copy.
- Preview panel with a real draggable split on desktop, Code / Split / Preview modes, a stacked
  layout on small screens, and a refresh control.
- HTML artifacts render in an iframe with `sandbox="allow-scripts"` (no `allow-same-origin`), so
  demo scripts run in an opaque origin and cannot reach the app, its storage, or its DOM.
- Markdown artifacts render through the app's React markdown renderer instead of being executed.
- Empty state when no artifact is selected.

### Tools and settings

- Ten planned capability cards with category filters and search. Two point at local demo
  conversations; the rest open an informational "coming soon" dialog that explains what would be
  required. Nothing pretends to be connected.
- Settings across appearance (theme, reduced motion, reduced transparency), chat behaviour, default
  model, interface density, keyboard shortcuts, and about. Preferences persist to `localStorage`
  and reset via a confirmation dialog.

### Accessibility and interaction details

- Semantic landmarks, labelled controls, `aria-current`, `aria-pressed`, `aria-checked`, and
  live regions for the transcript and toasts.
- Visible `:focus-visible` rings, keyboard-operable menus and dialogs, Escape handling,
  outside-click dismissal, and a skip link.
- Reduced-motion support from both the OS preference and the in-app setting.
- Empty, disabled, pending, streaming, stopped, and error states designed rather than improvised.

---

## Project structure

```
src/
  app/                    routes, global styles, icon, loading/error/not-found
    chat/ tools/ artifacts/ settings/
  components/
    brand/                KRYPTON mark + wordmark
    layout/               app shell, sidebar, page header
    chat/                 workspace, welcome, header, messages, markdown, composer, model selector
    artifacts/            artifacts view, code editor
    tools/                capability discovery
    settings/             settings sections
    ui/                   button, dialog, menu, tooltip, switch, badge, skeleton, toast, code block
    providers/            workspace provider (all demo state)
  lib/                    demo data, demo replies, assistant seam, artifacts, settings, utils
  types/                  shared interfaces (messages, conversations, models, artifacts, ...)
```

### Demo state boundaries

- `src/lib/demo-data.ts` — sample conversations, profile, suggestions, shortcuts.
- `src/lib/demo-chat.ts` — keyword-matched, hand-written reply templates.
- `src/lib/demo-artifacts.ts` — local artifact objects and preview sources.
- `src/components/providers/workspace-provider.tsx` — session state, simulated streaming, toasts.
- Conversations live in React state only. Renaming, deleting, or sending messages affects the
  current session; a refresh restores the seed data.

---

## Adding a backend

The interface depends on small, explicit seams:

1. **`src/lib/assistant-client.ts`** defines `AssistantClient`. Replace `demoAssistantClient` with
   an implementation that streams from your API. The workspace provider calls
   `demoAssistantClient.reply({...})` in exactly two places.
2. **`src/types/index.ts`** already models `ChatMessage`, `Conversation`, `Artifact`, `ModelTier`,
   `AppSettings`, and statuses (`pending`, `streaming`, `complete`, `error`), so an API response can
   be mapped onto them directly.
3. **`src/components/providers/workspace-provider.tsx`** owns conversation state and the simulated
   stream loop. Swap `runSimulation` for a real stream reader while keeping the same message
   patches.
4. **Settings** are currently `localStorage` only (`src/lib/settings.ts`). Account-scoped settings
   would add persistence behind the same `updateSetting` API.

Please keep the frontend-only boundary unless the backend phase is explicitly started: no provider
SDKs, API keys, database clients, or server routes belong in this repository today.

---

## Known limitations

- Replies are simulated with a local script; they are not model output.
- Conversation history, renames, deletions, and attachments exist only in memory for the session.
- Attachments show file names and sizes; file contents are never read or uploaded.
- Artifacts are seeded demo objects; there is no creation, storage, or sharing.
- Settings persist in this browser only and do not sync.
- No authentication: the profile is a labelled guest demo identity.
- No tool, search, vision, voice, or computer-use capability is connected.

---

## Verification

| Check                       | Result |
| --------------------------- | ------ |
| `npm run typecheck`         | pass   |
| `npm run lint`              | pass   |
| `npm run build`             | pass (static routes) |
| Route smoke test (`/`, `/chat`, `/tools`, `/artifacts`, `/settings`, unknown route) | 200 / 404 as expected |
