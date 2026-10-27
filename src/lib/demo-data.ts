import type {
  Conversation,
  ShortcutDefinition,
  SuggestedPrompt,
  WorkspaceProfile,
} from "@/types";

/**
 * FRONTEND DEMO DATA.
 *
 * Every conversation, message, and timestamp below is hand-written sample
 * content used to demonstrate the interface. Nothing here is fetched,
 * persisted, or produced by a model. The `simulated: true` flag on assistant
 * messages is rendered in the UI so a demo reply can never be mistaken for
 * real model output.
 */

export const DEMO_PROFILE: WorkspaceProfile = {
  displayName: "Alex Morgan",
  initials: "AM",
  plan: "Guest workspace",
  isGuest: true,
};

export const DEMO_SUGGESTIONS: SuggestedPrompt[] = [
  {
    id: "suggestion-code",
    category: "Code",
    title: "Refactor a React data table",
    prompt:
      "Refactor a React data table so it supports column resizing, keyboard navigation, and a sticky header without re-rendering every row.",
    icon: "code",
  },
  {
    id: "suggestion-write",
    category: "Write",
    title: "Draft a product update",
    prompt:
      "Write a three-paragraph product update announcing our new Krypton-7 tier for engineering teams. Keep it clear and free of marketing filler.",
    icon: "pen",
  },
  {
    id: "suggestion-research",
    category: "Research",
    title: "Compare two approaches",
    prompt:
      "Compare optimistic UI updates with server-confirmed updates for a chat app. Include a trade-off table and a recommendation.",
    icon: "compass",
  },
  {
    id: "suggestion-learn",
    category: "Learn",
    title: "Explain a concept simply",
    prompt:
      "Explain how retrieval-augmented generation works using a simple analogy, then walk through the request lifecycle step by step.",
    icon: "graduation",
  },
];

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-streaming",
    title: "Streaming tokens without layout shift",
    modelId: "krypton-7",
    pinned: true,
    demoGroup: "today",
    createdAt: "2026-10-27T08:42:00Z",
    updatedAt: "2026-10-27T09:06:00Z",
    messages: [
      {
        id: "msg-streaming-1",
        role: "user",
        content:
          "I'm streaming tokens into a React chat view and the list jumps every time a chunk lands. The composer also fights the scroll position on mobile. How should I structure this?",
        createdAt: "2026-10-27T08:42:00Z",
        status: "complete",
      },
      {
        id: "msg-streaming-2",
        role: "assistant",
        modelId: "krypton-7",
        createdAt: "2026-10-27T08:42:08Z",
        simulated: true,
        status: "complete",
        content: `The jump almost never comes from the streaming text itself — it comes from the container that holds it. Three things are usually happening at once.

## 1. The scroll container is the message list

If the page scrolls, every new token that changes document height also moves the composer and the scrollbar. Keep the transcript in a fixed-height flex column with \`overflow-y: auto\`, and let only that element scroll.

\`\`\`tsx
function Transcript({ messages }: { messages: Message[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);

  // Track whether the reader is parked at the bottom.
  function onScroll(event: React.UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  }

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || !pinnedRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto overscroll-contain"
    >
      {messages.map((message) => (
        <MessageRow key={message.id} message={message} />
      ))}
    </div>
  );
}
\`\`\`

Run the scroll correction in \`useLayoutEffect\`, not \`useEffect\`. Layout effects fire after the DOM is measured but before paint, so the user never sees the intermediate frame.

## 2. Reserve the layout for pending content

Rendering a "thinking" bubble that collapses into a taller answer causes a second jump. Give the pending row a \`min-height\` that matches a typical paragraph, and animate only \`opacity\`.

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Whole page scrolls while streaming | Composer in normal flow | \`h-dvh\` grid with a single scroll child |
| List snaps to top | Re-mounting the list on each chunk | Stable \`key\` + memoized rows |
| Composer rises on mobile | \`100vh\` and a textarea growth loop | \`h-dvh\` + \`max-height\` on the textarea |
| Jitter at the bottom | Scroll correction before paint | \`useLayoutEffect\` |

## 3. Debounce the auto-scroll, not the DOM

Throttle scroll writes to one per frame so a burst of chunks cannot queue dozens of layout reads:

\`\`\`ts
const frame = requestAnimationFrame(() => {
  el.scrollTop = el.scrollHeight;
});
return () => cancelAnimationFrame(frame);
\`\`\`

> A useful rule: the transcript owns the scroll, the shell owns the viewport, and the composer owns nothing but its own height.

If you tell me whether you're on the App Router with a server stream or a client-side mock, I can adapt the example to your chunk source.`,
      },
    ],
  },
  {
    id: "conv-design-tokens",
    title: "Design tokens for a dark workspace",
    modelId: "krypton-5",
    pinned: true,
    demoGroup: "today",
    createdAt: "2026-10-27T07:18:00Z",
    updatedAt: "2026-10-27T07:31:00Z",
    messages: [
      {
        id: "msg-tokens-1",
        role: "user",
        content:
          "We're standardising colour tokens for a dark-first product UI. What naming scheme holds up when a light theme gets added later?",
        createdAt: "2026-10-27T07:18:00Z",
        status: "complete",
      },
      {
        id: "msg-tokens-2",
        role: "assistant",
        modelId: "krypton-5",
        createdAt: "2026-10-27T07:18:06Z",
        simulated: true,
        status: "complete",
        content: `Name tokens by **role**, never by colour. \`surface-raised\` survives a theme change; \`navy-800\` does not.

## A naming scheme that scales

1. **Primitives** — the raw palette. Never referenced by components.
2. **Semantic tokens** — what the colour means (\`canvas\`, \`panel\`, \`ink-muted\`).
3. **Component tokens** — only when a semantic token genuinely doesn't fit.

\`\`\`css
:root {
  /* primitive: only used to compose semantics */
  --navy-950: 7 9 16;
  --blue-400: 108 156 255;

  /* semantic */
  --canvas: var(--navy-950);
  --panel: 15 19 30;
  --line: 31 38 55;
  --ink: 234 239 248;
  --accent: var(--blue-400);
}

[data-theme="light"] {
  --canvas: 246 248 252;
  --panel: 255 255 255;
  --line: 224 229 238;
  --ink: 15 21 34;
  --accent: 52 105 220;
}
\`\`\`

Storing colour as an **RGB triplet** rather than a hex value is the trick that makes the whole system practical: Tailwind can then apply opacity modifiers without a second token.

\`\`\`css
.panel {
  background-color: rgb(var(--panel) / 0.9);
  border: 1px solid rgb(var(--line));
}
\`\`\`

## Rules worth enforcing in review

- If a token name contains a colour word, reject it.
- Text tokens come in exactly three weights: \`ink\`, \`ink-soft\`, \`muted\`. A fourth usually means the hierarchy is unclear.
- Borders get one token. Two border tokens is a design conversation, not a CSS problem.
- Contrast is checked on the *composited* background, not the token value in isolation.

> Keep the semantic layer small enough to memorise. Twenty well-named tokens beat a hundred precise ones nobody can recall.

For a dark-first product, also check that every semantic token has a deliberate light value before the theme ships — retrofitting later is where contrast regressions hide.`,
      },
      {
        id: "msg-tokens-3",
        role: "user",
        content: "How do I handle focus rings and hover states in that scheme?",
        createdAt: "2026-10-27T07:29:00Z",
        status: "complete",
      },
      {
        id: "msg-tokens-4",
        role: "assistant",
        modelId: "krypton-5",
        createdAt: "2026-10-27T07:31:00Z",
        simulated: true,
        status: "complete",
        content: `Give interaction its own layer instead of reusing brand colour everywhere.

\`\`\`css
:root {
  --ring: 118 162 255;
  --hover: rgb(255 255 255 / 0.045);
  --active: rgb(255 255 255 / 0.075);
}
\`\`\`

- **Focus** uses \`--ring\` and \`:focus-visible\` only, so a mouse click never leaves a ring behind.
- **Hover** is a translucent wash rather than a new solid colour, so it works on panels, menus, and cards without extra tokens.
- **Disabled** is opacity plus \`pointer-events: none\` — never a lower-contrast text token, which fails accessibility checks.

That keeps the palette to roughly a dozen decisions and makes dark-to-light switching a one-file change.`,
      },
    ],
  },
  {
    id: "conv-postgres",
    title: "Postgres index strategy for activity feeds",
    modelId: "krypton-7",
    demoGroup: "yesterday",
    createdAt: "2026-10-26T16:04:00Z",
    updatedAt: "2026-10-26T16:22:00Z",
    messages: [
      {
        id: "msg-pg-1",
        role: "user",
        content:
          "Our activity feed query is doing a sequential scan on 40M rows. It filters by workspace, orders by created_at, and filters out soft-deleted rows. What index should I add?",
        createdAt: "2026-10-26T16:04:00Z",
        status: "complete",
      },
      {
        id: "msg-pg-2",
        role: "assistant",
        modelId: "krypton-7",
        createdAt: "2026-10-26T16:04:11Z",
        simulated: true,
        status: "complete",
        content: `Match the index to the exact shape of the predicate and the sort.

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_activity_feed
  ON activity (workspace_id, created_at DESC, id DESC)
  WHERE deleted_at IS NULL;
\`\`\`

**Why this shape:**

- \`workspace_id\` is the equality predicate, so it leads. Leading with \`created_at\` would make the workspace filter a post-filter over the whole index.
- \`created_at DESC\` matches the \`ORDER BY\`, turning the sort into an index walk.
- \`id DESC\` breaks ties and makes keyset pagination stable.
- The partial predicate removes soft-deleted rows from the index entirely — usually a 5–15% size win, sometimes more.
- \`CONCURRENTLY\` avoids the write lock on a table this size.

## Verify it actually gets used

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, actor_id, verb, created_at
FROM activity
WHERE workspace_id = $1
  AND deleted_at IS NULL
  AND (created_at, id) < ($2, $3)
ORDER BY created_at DESC, id DESC
LIMIT 30;
\`\`\`

Look for \`Index Scan\` or \`Index Only Scan\` and a \`Buffers: shared hit\` count that stays flat as you page deeper.

| Pattern | Index consequence |
| --- | --- |
| Offset pagination (\`OFFSET 5000\`) | Index still used, but rows are read and discarded |
| Keyset pagination | Stable latency at any depth |
| \`ORDER BY created_at\` without a limit | Planner may prefer a sort over the index |

Two follow-ups worth checking before you ship:

1. If the feed also filters by \`actor_id\`, you need a second partial index rather than widening this one.
2. If the table gets heavy updates on \`deleted_at\`, watch bloat — a partial index still pays for each version update that touches it.

> Desired behaviour, not symptom: confirm with \`EXPLAIN\` on production-shaped data. Index choices that look right on 100k rows often lose to a bitmap scan at 40M.`,
      },
    ],
  },
  {
    id: "conv-launch-email",
    title: "Launch email for Krypton-5",
    modelId: "krypton-5",
    demoGroup: "yesterday",
    createdAt: "2026-10-26T10:45:00Z",
    updatedAt: "2026-10-26T11:02:00Z",
    messages: [
      {
        id: "msg-email-1",
        role: "user",
        content:
          "Draft a launch email for Krypton-5. Audience is existing users on Krypton-lite. It should feel calm and useful, not hypey. Under 180 words.",
        createdAt: "2026-10-26T10:45:00Z",
        status: "complete",
      },
      {
        id: "msg-email-2",
        role: "assistant",
        modelId: "krypton-5",
        createdAt: "2026-10-26T10:45:05Z",
        simulated: true,
        status: "complete",
        content: `**Subject:** A steadier default is now available

**Preview text:** Krypton-5 is now the default tier in your workspace.

---

Hi Alex,

You've been using Krypton-lite for quick answers. It's still there whenever you need it — but there's a new default.

**Krypton-5** is the middle tier: more context, more careful reasoning, and better at holding a long thread together. It's the one we reach for on writing, research, and everyday product work.

- **Switch any time** from the model selector under the composer.
- **Nothing resets.** Your conversations stay exactly where they are.
- **Krypton-7** is available when a problem needs deeper engineering reasoning.

You don't need to do anything to try it. Open a new chat and Krypton-5 will be waiting.

— The KRYPTON team

---

A few notes on the choices:

> "Steadier default" positions the tier as a change in temperament rather than a feature launch. That fits an audience that already trusts the product.

I kept the bullets to three, avoided a hero image, and put the switch instruction before the reasoning so skimmers get the action first.`,
      },
    ],
  },
  {
    id: "conv-rag",
    title: "Explain RAG without the jargon",
    modelId: "krypton-5",
    demoGroup: "previous",
    createdAt: "2026-10-23T14:12:00Z",
    updatedAt: "2026-10-23T14:20:00Z",
    messages: [
      {
        id: "msg-rag-1",
        role: "user",
        content:
          "Explain retrieval-augmented generation to a product manager who has never worked with LLMs.",
        createdAt: "2026-10-23T14:12:00Z",
        status: "complete",
      },
      {
        id: "msg-rag-2",
        role: "assistant",
        modelId: "krypton-5",
        createdAt: "2026-10-23T14:12:07Z",
        simulated: true,
        status: "complete",
        content: `Think of an open-book exam.

A model on its own answers from memory. Sometimes that memory is stale or invented. RAG hands the model the right pages of the textbook before it answers — and asks it to cite what it read.

## The five steps

1. **Prepare the library.** Documents are split into small passages and converted into numeric fingerprints ("embeddings") that capture meaning.
2. **Ask a question.** The question gets the same treatment: converted into a fingerprint.
3. **Retrieve.** The system finds the passages whose fingerprints sit closest to the question's.
4. **Assemble.** Those passages are pasted into the prompt as context, with a strict instruction to answer only from them.
5. **Generate.** The model writes an answer using the supplied passages and returns citations.

| Without RAG | With RAG |
| --- | --- |
| Answers from training data | Answers from documents you control |
| Hard to verify | Cite the passage used |
| Goes stale | Reflects the latest indexed content |
| Cannot see internal docs | Can answer from internal docs |

## What it does *not* fix

- **It doesn't guarantee truth.** Poor retrieval produces a confident wrong answer.
- **It isn't memory.** The model doesn't learn from retrieved text; it just reads it in the moment.
- **Chunking matters more than model choice.** Bad splits produce fragments that answer half a question.

> For a PM, the useful mental model is: RAG is a search problem wearing a language-model coat. Most quality issues show up in retrieval, not generation.`,
      },
    ],
  },
  {
    id: "conv-landscape",
    title: "Q4 competitive landscape scan",
    modelId: "krypton-lite",
    demoGroup: "previous",
    createdAt: "2026-10-21T09:30:00Z",
    updatedAt: "2026-10-21T09:36:00Z",
    messages: [
      {
        id: "msg-scan-1",
        role: "user",
        content:
          "Give me a quick framework for scanning the competitive landscape next quarter. Keep it short.",
        createdAt: "2026-10-21T09:30:00Z",
        status: "complete",
      },
      {
        id: "msg-scan-2",
        role: "assistant",
        modelId: "krypton-lite",
        createdAt: "2026-10-21T09:30:03Z",
        simulated: true,
        status: "complete",
        content: `Four lenses, one page each:

| Lens | Question | Signal to track |
| --- | --- | --- |
| Product | What did they ship? | Changelog cadence, docs diffs |
| Positioning | Who are they selling to now? | Landing page headline changes |
| Pricing | How do they meter usage? | Seats vs. tokens vs. credits |
| Distribution | Where do they show up? | Integrations, marketplace listings |

Then ask one uncomfortable question per competitor: *what would make our current positioning wrong?*

> Keep the scan to one page. A landscape doc nobody rereads is just an expensive newsletter.

Note: this is a planning framework, not a live market scan.`,
      },
    ],
  },
];

export const KEYBOARD_SHORTCUTS: ShortcutDefinition[] = [
  {
    id: "shortcut-new-chat",
    label: "Start a new chat",
    keys: ["⌘", "K"],
    group: "Navigation",
    status: "active",
  },
  {
    id: "shortcut-search",
    label: "Focus conversation search",
    keys: ["/"],
    group: "Navigation",
    status: "active",
  },
  {
    id: "shortcut-sidebar",
    label: "Toggle sidebar",
    keys: ["⌘", "B"],
    group: "Navigation",
    status: "active",
  },
  {
    id: "shortcut-send",
    label: "Send message",
    keys: ["Enter"],
    group: "Composer",
    status: "active",
  },
  {
    id: "shortcut-newline",
    label: "New line",
    keys: ["Shift", "Enter"],
    group: "Composer",
    status: "active",
  },
  {
    id: "shortcut-stop",
    label: "Stop a simulated response",
    keys: ["Esc"],
    group: "Composer",
    status: "active",
  },
  {
    id: "shortcut-model",
    label: "Open model selector",
    keys: ["⌘", "M"],
    group: "Composer",
    status: "planned",
    note: "Planned — use the composer selector for now.",
  },
  {
    id: "shortcut-artifacts",
    label: "Jump to Artifacts",
    keys: ["G", "A"],
    group: "Navigation",
    status: "planned",
    note: "Planned — use the sidebar for now.",
  },
  {
    id: "shortcut-command",
    label: "Command palette",
    keys: ["⌘", "⇧", "P"],
    group: "Interface",
    status: "planned",
    note: "Planned for a later release.",
  },
];
