import type { ModelId } from "@/types";
import { getModel } from "@/lib/models";
import { truncate } from "@/lib/utils";

/**
 * LOCAL SIMULATED RESPONSES.
 *
 * This module is the entire "model" for the demo build. It performs keyword
 * matching against hand-written templates and returns local strings — there
 * is no network request, no provider, and no inference. Replace this module
 * with an API client later; nothing in the UI depends on how it is produced.
 */

type Intent = "code" | "writing" | "research" | "learning" | "general";

const INTENT_PATTERNS: Array<{ intent: Intent; pattern: RegExp }> = [
  {
    intent: "code",
    pattern:
      /\b(code|refactor|react|typescript|javascript|css|sql|postgres|api|bug|error|stack|function|component|index|query|deploy|build)\b/i,
  },
  {
    intent: "writing",
    pattern:
      /\b(write|draft|email|copy|announce|blog|post|tone|rewrite|headline|newsletter|launch)\b/i,
  },
  {
    intent: "research",
    pattern:
      /\b(compare|research|trade-?off|analy[sz]e|market|landscape|competitor|evaluate|decision)\b/i,
  },
  {
    intent: "learning",
    pattern:
      /\b(explain|learn|teach|what is|how does|why does|understand|concept|beginner)\b/i,
  },
];

function detectIntent(prompt: string): Intent {
  return (
    INTENT_PATTERNS.find((entry) => entry.pattern.test(prompt))?.intent ?? "general"
  );
}

function excerpt(prompt: string, max = 110): string {
  return truncate(prompt.replace(/\s+/g, " ").trim(), max);
}

const DISCLAIMER =
  "> Demo response. This is pre-written local sample content, not output from a language model.";

function codeReply(prompt: string, modelName: string): string {
  return `Here's how I'd approach **${excerpt(prompt, 84)}**.

## Plan

1. Isolate the smallest unit that can be verified on its own.
2. Add the type boundary before the behaviour.
3. Cover the failure path with one test, then refactor.

\`\`\`ts
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; message: string };

async function load<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(\`Request failed with \${response.status}\`);
  }
  return (await response.json()) as T;
}
\`\`\`

## Trade-offs

| Option | Strength | Cost |
| --- | --- | --- |
| Discriminated union state | Impossible states unreachable | Slightly more verbosity |
| Separate booleans | Fast to write | Invalid combinations possible |
| External state library | Shared caching | Extra dependency to justify |

Two things I'd check before committing:

- Confirm the abort signal is threaded through every fetch call, otherwise the state machine can resolve after unmount.
- If this runs in the App Router, keep the fetching function on the server and pass plain data across the boundary.

This reply came from ${modelName}'s demo script, so treat the specifics as an illustration rather than a review of your codebase.

${DISCLAIMER}`;
}

function writingReply(prompt: string, modelName: string): string {
  return `Here's a first pass for **${excerpt(prompt, 84)}**.

## Draft

**Subject:** A clearer way to start

Hi there,

Most tools ask you to configure them before they're useful. We'd rather you open it, ask a question, and get something you can act on.

That's the change this week: a faster default tier, a calmer interface, and fewer settings between you and the work.

- **Krypton-5** is now the default for everyday tasks.
- **Krypton-lite** stays one click away for quick questions.
- **Krypton-7** is there when the problem needs more time.

Nothing you've saved has moved. Open a chat and try it.

— The team

## Why the draft looks like this

- The subject promises a change in experience, not a feature.
- Three bullets only — a fourth would dilute the list.
- The call to action is a single, low-effort sentence.

> If the audience is existing users, lead with what stayed the same. It reduces the sense that something was taken away.

Want a shorter version for an in-product banner, or a more formal version for a release note?

Drafted with the ${modelName} demo script in this frontend build.

${DISCLAIMER}`;
}

function researchReply(prompt: string, modelName: string): string {
  return `For **${excerpt(prompt, 84)}**, I'd structure the comparison before filling in details.

## Framing

Two questions decide most of the answer:

1. What is the cost of being wrong for a few seconds?
2. Who needs to see the change — one person, or everyone in a shared view?

## Comparison

| Criterion | Option A | Option B |
| --- | --- | --- |
| Perceived speed | Immediate | Slightly delayed |
| Complexity | Rollback logic required | Simpler happy path |
| Failure visibility | Silent unless handled | Surfaces an error state |
| Best fit | Local, reversible actions | Shared, consequential actions |

## Recommendation

Start with the simpler option, then add the optimistic layer only where users repeat the action often enough for latency to matter.

> A useful test: if nobody would notice a 300ms delay, they probably won't notice the rollback either — but they will notice a stuck state.

To make this a real research pass, I'd need to look at your stack and constraints. This demo build has no browsing capability, so the comparison above is a reasoning scaffold rather than a sourced survey.

Prepared with the ${modelName} demo script; no research service was contacted.

${DISCLAIMER}`;
}

function learningReply(prompt: string, modelName: string): string {
  return `Let's build up **${excerpt(prompt, 84)}** in layers.

## The intuition

Think of it as a librarian who has read the shelf but never the index. Hand them the right three pages and their answer suddenly improves — not because they got smarter, but because the question got narrower.

## The mechanism

1. **Convert** the question into a representation you can compare.
2. **Search** for the closest matches in a prepared store.
3. **Constrain** the answer to those matches.
4. **Return** the result alongside its sources.

## Where it usually breaks

- The prepared store is chunked badly, so matches are fragments.
- Too many passages are retrieved and the relevant one gets buried.
- The instruction doesn't require citations, so verification becomes manual.

> The counter-intuitive part: improving retrieval quality usually helps more than switching to a larger model.

## Check yourself

If you can explain *why* a stale document produces a confident wrong answer, you've got the core idea.

Explained with the ${modelName} demo script.

${DISCLAIMER}`;
}

function generalReply(prompt: string, modelName: string): string {
  return `Here's a structured way to think about **${excerpt(prompt, 84)}**.

## What I'd clarify first

- **Goal** — what decision or artifact does this unblock?
- **Constraint** — time, budget, or something that cannot change?
- **Audience** — who reads the result, and what do they already know?

## A first pass

1. Write the outcome as one sentence with a verb in it.
2. List the three things that must be true for it to work.
3. Pick the cheapest of those three to test this week.

## What "good" looks like

| Weak signal | Strong signal |
| --- | --- |
| Vague agreement in review | Specific, testable objection |
| Scope grows each meeting | Scope shrinks as unknowns resolve |
| Output is a document | Output is a decision |

> If you share the constraint you're working inside, I can turn this into a concrete plan.

This is a demo response from ${modelName}'s local script — ${modelName} is not connected to a model provider in this build.

${DISCLAIMER}`;
}

const REPLIES: Record<Intent, (prompt: string, modelName: string) => string> = {
  code: codeReply,
  writing: writingReply,
  research: researchReply,
  learning: learningReply,
  general: generalReply,
};

const RETRY_OPENERS = [
  "",
  "Taking a second pass, with a slightly different structure.\n\n",
  "Here's an alternative framing for the same request.\n\n",
];

/**
 * Produces a local, clearly-labelled demo reply.
 * @param attempt 0 for the first reply, incremented on each retry.
 */
export function createSimulatedReply(
  prompt: string,
  modelId: ModelId,
  attempt = 0,
): string {
  const model = getModel(modelId);
  const intent = detectIntent(prompt);
  const body = REPLIES[intent](prompt, model.name);
  const opener = RETRY_OPENERS[attempt % RETRY_OPENERS.length];
  return `${opener}${body}`;
}

/** Short conversation title derived from the first message. */
export function createConversationTitle(prompt: string): string {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  if (!cleaned) return "New chat";
  return truncate(cleaned.replace(/[.?!]+$/, ""), 52);
}

export { detectIntent };
