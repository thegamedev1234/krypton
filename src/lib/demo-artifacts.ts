import type { Artifact } from "@/types";

/**
 * FRONTEND DEMO ARTIFACTS.
 *
 * Local demonstration objects. Nothing is uploaded, saved to a database, or
 * shared between devices — refreshing the page restores these seed values.
 */
export const DEMO_ARTIFACTS: Artifact[] = [
  {
    id: "artifact-aurora",
    title: "Aurora — Krypton-7 launch page",
    summary:
      "A self-contained landing page produced during a demo session. HTML, CSS, and JavaScript preview together inside a sandboxed frame.",
    kind: "Landing page",
    modelId: "krypton-7",
    createdAt: "2026-10-27T08:05:00Z",
    updatedAt: "2026-10-27T08:24:00Z",
    isDemo: true,
    files: [
      {
        id: "file-aurora-html",
        name: "index.html",
        language: "html",
        content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Aurora — Krypton-7</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="nav">
      <a class="brand" href="#top">
        <span class="brand-mark" aria-hidden="true"></span>
        Aurora
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#features">Features</a>
        <a href="#details">Details</a>
        <a class="nav-cta" href="#start">Get started</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero">
        <p class="eyebrow">Krypton-7 · deep reasoning tier</p>
        <h1>Architecture that holds up under review.</h1>
        <p class="lede">
          A calm workspace for the problems that need a longer chain of
          thought — refactors, migrations, and design decisions you
          can defend.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-demo="start">
            Start a session
          </button>
          <button class="btn btn-ghost" data-demo="docs">Read the brief</button>
        </div>
        <p class="hero-note" data-status role="status">
          Static preview — controls are visual only.
        </p>
      </section>

      <section class="grid" id="features">
        <article class="card">
          <span class="card-index">01</span>
          <h2>Long context</h2>
          <p>Keep the whole migration in view, not a single file.</p>
        </article>
        <article class="card">
          <span class="card-index">02</span>
          <h2>Review-ready</h2>
          <p>Every recommendation states its trade-off and its failure mode.</p>
        </article>
        <article class="card">
          <span class="card-index">03</span>
          <h2>Deliberate pace</h2>
          <p>Optimised for correctness on hard problems, not for speed.</p>
        </article>
      </section>

      <section class="detail" id="details">
        <div>
          <h2>Why a slower tier</h2>
          <p>
            Most assistant interfaces optimise the first response. Structural
            work fails later — at review, at migration, at the second
            engineer. Krypton-7 is tuned for that second moment.
          </p>
        </div>
        <dl class="specs">
          <div><dt>Reasoning</dt><dd>Extended</dd></div>
          <div><dt>Context</dt><dd>Long</dd></div>
          <div><dt>Best for</dt><dd>Systems</dd></div>
        </dl>
      </section>
    </main>

    <footer class="footer" id="start">
      <p>KRYPTON demo artifact · rendered locally in a sandboxed frame.</p>
    </footer>

    <script src="script.js"></script>
  </body>
</html>
`,
      },
      {
        id: "file-aurora-css",
        name: "styles.css",
        language: "css",
        content: `:root {
  --bg: #06080f;
  --panel: #0e1320;
  --line: #1e2638;
  --ink: #e9eef8;
  --muted: #93a0b8;
  --accent: #6c9cff;
  --violet: #9684ff;
  color-scheme: dark;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background:
    radial-gradient(60rem 30rem at 15% -10%, rgba(108, 156, 255, 0.12), transparent 60%),
    radial-gradient(50rem 28rem at 90% 0%, rgba(150, 132, 255, 0.1), transparent 62%),
    var(--bg);
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem clamp(1rem, 5vw, 3.5rem);
  border-bottom: 1px solid var(--line);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--ink);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.brand-mark {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: linear-gradient(140deg, var(--accent), var(--violet));
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.85rem;
}

.nav-links a {
  color: var(--muted);
  text-decoration: none;
  transition: color 140ms ease;
}

.nav-links a:hover { color: var(--ink); }

.nav-cta {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink) !important;
}

main { padding: 0 clamp(1rem, 5vw, 3.5rem); }

.hero {
  max-width: 46rem;
  padding: clamp(3rem, 9vw, 6rem) 0 clamp(2rem, 5vw, 3rem);
}

.eyebrow {
  margin: 0 0 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.15rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 600;
  background: linear-gradient(180deg, #fff, #b9c8e4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lede {
  margin: 1.1rem 0 0;
  max-width: 34rem;
  color: var(--muted);
  font-size: 1rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.75rem;
}

.btn {
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
}

.btn:active { transform: translateY(1px); }

.btn-primary {
  background: linear-gradient(180deg, #7ba7ff, #5b8df0);
  color: #06122c;
}

.btn-primary:hover { filter: brightness(1.06); }

.btn-ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--ink);
}

.btn-ghost:hover { border-color: #33415c; background: rgba(255, 255, 255, 0.03); }

.hero-note {
  margin-top: 0.9rem;
  font-size: 0.75rem;
  color: #6f7d95;
  min-height: 1.2em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 0.85rem;
  padding-bottom: 1rem;
}

.card {
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent);
  border-radius: 14px;
  padding: 1.15rem;
}

.card-index {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  color: var(--violet);
}

.card h2 {
  margin: 0.5rem 0 0.35rem;
  font-size: 0.975rem;
  font-weight: 600;
}

.card p { margin: 0; font-size: 0.85rem; color: var(--muted); }

.detail {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  margin: 2.5rem 0 3rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--line);
}

.detail h2 { margin: 0 0 0.6rem; font-size: 1.1rem; letter-spacing: -0.01em; }
.detail p { margin: 0; color: var(--muted); font-size: 0.9rem; max-width: 30rem; }

.specs { margin: 0; display: grid; gap: 0.65rem; }
.specs div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(30, 38, 56, 0.7);
}
.specs dt { color: #7b889f; font-size: 0.8rem; }
.specs dd { margin: 0; font-size: 0.8rem; }

.footer {
  border-top: 1px solid var(--line);
  padding: 1.1rem clamp(1rem, 5vw, 3.5rem);
  color: #64718a;
  font-size: 0.75rem;
}

.footer p { margin: 0; }

@media (max-width: 620px) {
  .nav-links a:not(.nav-cta) { display: none; }
  .detail { grid-template-columns: 1fr; gap: 1.25rem; }
}
`,
      },
      {
        id: "file-aurora-js",
        name: "script.js",
        language: "javascript",
        content: `// Sandboxed demo behaviour. This script runs only inside the artifact
// preview iframe and cannot touch the KRYPTON application.
const status = document.querySelector("[data-status]");

document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.demo;
    if (!status) return;

    status.textContent =
      action === "start"
        ? "Demo preview — no session was created."
        : "Demo preview — no document was opened.";

    status.animate(
      [{ opacity: 0.2 }, { opacity: 1 }],
      { duration: 220, easing: "ease-out" },
    );
  });
});
`,
      },
    ],
  },
  {
    id: "artifact-message",
    title: "Assistant message bubble",
    summary:
      "A compact message row with model attribution and copy affordance. Useful as a starting point for a design-system component.",
    kind: "Component",
    modelId: "krypton-5",
    createdAt: "2026-10-26T15:40:00Z",
    updatedAt: "2026-10-26T15:52:00Z",
    isDemo: true,
    files: [
      {
        id: "file-message-html",
        name: "index.html",
        language: "html",
        content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Message bubble</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="stage">
      <article class="turn">
        <div class="turn-head">
          <span class="avatar" aria-hidden="true">K</span>
          <span class="author">KRYPTON</span>
          <span class="model">Krypton-5</span>
        </div>
        <div class="bubble">
          <p>
            A message row reads best when the speaker is identified once, at
            the top, rather than repeated on every line.
          </p>
          <ul>
            <li>Keep the metadata on a single line.</li>
            <li>Use the bubble for content the reader can copy.</li>
          </ul>
        </div>
        <div class="turn-actions">
          <button type="button">Copy</button>
          <button type="button">Retry</button>
        </div>
      </article>
    </main>
  </body>
</html>
`,
      },
      {
        id: "file-message-css",
        name: "styles.css",
        language: "css",
        content: `:root {
  color-scheme: dark;
  --panel: #0d1220;
  --raised: #141a29;
  --line: #212a3d;
  --ink: #e8eef9;
  --muted: #8d9bb4;
  --accent: #6c9cff;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
  background: #06080f;
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}

.stage { width: 100%; max-width: 34rem; }

.turn-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
}

.avatar {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #06122c;
  background: linear-gradient(140deg, #a5c4ff, #6c9cff);
}

.author {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.model {
  font-size: 0.68rem;
  color: #9db9ff;
  border: 1px solid rgba(108, 156, 255, 0.24);
  background: rgba(108, 156, 255, 0.1);
  border-radius: 999px;
  padding: 0.05rem 0.45rem;
}

.bubble {
  border: 1px solid var(--line);
  border-radius: 4px 14px 14px 14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.025), transparent), var(--panel);
  padding: 1rem 1.15rem;
  font-size: 0.9rem;
  line-height: 1.7;
  color: #c9d4e6;
}

.bubble p { margin: 0; }
.bubble ul { margin: 0.6rem 0 0; padding-left: 1.1rem; display: grid; gap: 0.3rem; }
.bubble li::marker { color: var(--accent); }

.turn-actions {
  display: flex;
  gap: 0.35rem;
  margin-top: 0.5rem;
  opacity: 0.6;
  transition: opacity 150ms ease;
}

.turn:hover .turn-actions,
.turn:focus-within .turn-actions { opacity: 1; }

.turn-actions button {
  font: inherit;
  font-size: 0.72rem;
  color: var(--muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 0.25rem 0.55rem;
  cursor: pointer;
}

.turn-actions button:hover {
  color: var(--ink);
  border-color: var(--line);
  background: var(--raised);
}

.turn-actions button:focus-visible {
  outline: 2px solid rgba(108, 156, 255, 0.8);
  outline-offset: 1px;
}
`,
      },
    ],
  },
  {
    id: "artifact-brief",
    title: "Product brief — Krypton-7",
    summary:
      "A markdown brief drafted in the writing demo. Markdown artifacts render as formatted documents in the Preview tab.",
    kind: "Document",
    modelId: "krypton-5",
    createdAt: "2026-10-24T11:02:00Z",
    updatedAt: "2026-10-24T11:30:00Z",
    isDemo: true,
    files: [
      {
        id: "file-brief-md",
        name: "brief.md",
        language: "markdown",
        content: `# Krypton-7 — product brief

**Status:** draft for review
**Tier:** Advanced reasoning
**Owner:** Product

## Problem

Teams doing structural work — migrations, architecture reviews, incident
analysis — abandon chat interfaces at the first hard question. The replies are
fast, but shallow. They answer the prompt instead of the problem.

## Position

Krypton-7 is the deliberate tier. It optimises for correctness on long,
connected tasks, and it is expected to feel slower than Krypton-5.

> If a reply cannot explain its trade-offs, it is not finished.

## What it does well

- Multi-file refactors with a visible plan
- Failure analysis from logs and stack traces
- Design reviews that name the failure mode, not just the pattern

## What it should not promise

1. Live web access
2. Execution of untrusted code
3. Certainty where the underlying data is incomplete

## Success signals

| Signal | Baseline | Target |
| --- | --- | --- |
| Retry rate on coding threads | 22% | below 12% |
| Threads with 3+ follow-ups | 41% | above 55% |
| Reported incorrect patches | 9% | below 4% |

---

*Written in a KRYPTON demo session. This document is sample content, not a
commitment.*
`,
      },
    ],
  },
];
