import {
  BarChart3,
  Code2,
  FileSearch,
  Globe,
  GraduationCap,
  ImageIcon,
  Library,
  Mic,
  MousePointer2,
  PenLine,
} from "lucide-react";
import type { Capability, CapabilityCategory } from "@/types";

/**
 * Planned product capabilities for KRYPTON.
 *
 * None of these are connected in this frontend build. Each entry states its
 * status honestly: `demo` items have a local interface demo behind them,
 * `coming-soon` items have no working integration at all.
 */
export const CAPABILITIES: Capability[] = [
  {
    id: "web-research",
    name: "Web Research",
    category: "Research",
    summary: "Gather sources, compare claims, and return citations.",
    details:
      "A research pass would search, open sources, and assemble a cited brief. This build shows the interface shell only — no browsing happens.",
    status: "coming-soon",
    icon: Globe,
    highlights: ["Source gathering", "Citation format", "Comparison briefs"],
    statusNote: "Requires a retrieval backend. Interface preview only.",
  },
  {
    id: "coding-assistant",
    name: "Coding Assistant",
    category: "Build",
    summary: "Read a codebase, propose patches, explain failures.",
    details:
      "Ask about a stack trace or request a refactor. The path opens a demo conversation so you can see how code-heavy replies are rendered.",
    status: "demo",
    icon: Code2,
    highlights: ["Multi-file refactors", "Failure analysis", "Review notes"],
    href: "/chat",
    ctaLabel: "Open demo chat",
    statusNote: "Demo conversation with hand-written example output.",
  },
  {
    id: "document-analysis",
    name: "Document Analysis",
    category: "Research",
    summary: "Summarise long documents and extract structured facts.",
    details:
      "Upload, chunk, and query long-form documents with page-level citations. File handling is not connected in this build.",
    status: "coming-soon",
    icon: FileSearch,
    highlights: ["Long context", "Page citations", "Structured extraction"],
    statusNote: "Requires file ingestion. Not connected.",
  },
  {
    id: "image-understanding",
    name: "Image Understanding",
    category: "Create",
    summary: "Describe, compare, and reason about visual input.",
    details:
      "Vision capabilities would accept screenshots and diagrams as context. Attachments in this build never leave the browser.",
    status: "coming-soon",
    icon: ImageIcon,
    highlights: ["Screenshot review", "Diagram reading", "Visual QA"],
    statusNote: "Requires a vision model. Not connected.",
  },
  {
    id: "writing-assistant",
    name: "Writing Assistant",
    category: "Create",
    summary: "Draft, tighten, and restyle long-form work.",
    details:
      "Tone, structure, and length control for product copy, documentation, and email. Opens a demo conversation showing the writing flow.",
    status: "demo",
    icon: PenLine,
    highlights: ["Tone control", "Structural edits", "Length targets"],
    href: "/chat",
    ctaLabel: "Open demo chat",
    statusNote: "Demo conversation with hand-written example output.",
  },
  {
    id: "learning",
    name: "Learning & Explanations",
    category: "Learn",
    summary: "Explain concepts at the depth you actually need.",
    details:
      "Layered explanations from intuition to mechanism, with checks for understanding. Opens a demo conversation.",
    status: "demo",
    icon: GraduationCap,
    highlights: ["Layered depth", "Analogies", "Worked examples"],
    href: "/chat",
    ctaLabel: "Open demo chat",
    statusNote: "Demo conversation with hand-written example output.",
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    category: "Data",
    summary: "Inspect datasets, compute summaries, sanity-check results.",
    details:
      "Would run sandboxed analysis over uploaded tables and return charts plus reproducible steps. Not connected in this build.",
    status: "coming-soon",
    icon: BarChart3,
    highlights: ["Table profiling", "Chart specs", "Reproducible steps"],
    statusNote: "Requires a code execution sandbox. Not connected.",
  },
  {
    id: "voice",
    name: "Voice Interaction",
    category: "Interact",
    summary: "Talk to the workspace, hands free.",
    details:
      "Push-to-talk and continuous voice modes with streaming transcription. Microphone capture is not implemented here.",
    status: "coming-soon",
    icon: Mic,
    highlights: ["Push to talk", "Live transcript", "Voice commands"],
    statusNote: "Microphone capture is not implemented.",
  },
  {
    id: "computer-use",
    name: "Computer Use",
    category: "Interact",
    summary: "Delegate multi-step tasks in a sandboxed browser.",
    details:
      "An agent would act inside an isolated browser session with an approval step per action. No automation runs in this build.",
    status: "coming-soon",
    icon: MousePointer2,
    highlights: ["Sandboxed session", "Action approvals", "Step replay"],
    statusNote: "No automation capability exists in this demo.",
  },
  {
    id: "knowledge",
    name: "Knowledge & RAG",
    category: "Data",
    summary: "Ground answers in your own documents.",
    details:
      "Connect a document set, retrieve passages, and answer with citations. In this build only Markdown content is available, as artifacts.",
    status: "coming-soon",
    icon: Library,
    highlights: ["Custom sources", "Passage retrieval", "Inline citations"],
    href: "/artifacts",
    ctaLabel: "View demo artifacts",
    statusNote: "Requires an indexing backend. Browse local artifacts instead.",
  },
];

export const CAPABILITY_CATEGORIES: Array<CapabilityCategory | "All"> = [
  "All",
  "Research",
  "Build",
  "Create",
  "Learn",
  "Data",
  "Interact",
];
