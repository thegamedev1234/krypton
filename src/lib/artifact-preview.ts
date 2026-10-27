import type { Artifact, ArtifactFile, ArtifactLanguage } from "@/types";

/**
 * Builds a single self-contained HTML document for the sandboxed preview
 * iframe by inlining the artifact's local CSS and JavaScript files.
 *
 * The preview is rendered with `sandbox="allow-scripts"` (no
 * `allow-same-origin`), so scripts run in an opaque origin and cannot reach
 * the KRYPTON application, its storage, or its DOM.
 */

export function getPrimaryFile(artifact: Artifact): ArtifactFile {
  return (
    artifact.files.find((file) => file.language === "html") ??
    artifact.files.find((file) => file.language === "markdown") ??
    artifact.files[0]
  );
}

export function isMarkdownArtifact(artifact: Artifact): boolean {
  const primary = getPrimaryFile(artifact);
  return primary.language === "markdown";
}

export function getMarkdownFile(artifact: Artifact): ArtifactFile | null {
  return artifact.files.find((file) => file.language === "markdown") ?? null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FALLBACK_DOCUMENT = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { height: 100%; margin: 0; }
      body {
        display: grid;
        place-items: center;
        padding: 2rem;
        background: #06080f;
        color: #93a0b8;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        text-align: center;
      }
      p { max-width: 26rem; font-size: 0.85rem; line-height: 1.7; }
    </style>
  </head>
  <body>
    <p>This artifact has no HTML entry file, so there is nothing to preview.
    Open a different artifact from the list, or inspect the source in the Code tab.</p>
  </body>
</html>`;

export function buildPreviewDocument(artifact: Artifact): string {
  const htmlFile = artifact.files.find((file) => file.language === "html");
  if (!htmlFile) return FALLBACK_DOCUMENT;

  let document = htmlFile.content;

  for (const file of artifact.files) {
    if (file.language === "css") {
      const pattern = new RegExp(
        `<link[^>]*href=["']${escapeRegExp(file.name)}["'][^>]*>`,
        "gi",
      );
      document = document.replace(
        pattern,
        () => `<style data-krypton-file="${file.name}">\n${file.content}\n</style>`,
      );
    }

    if (file.language === "javascript") {
      const pattern = new RegExp(
        `<script[^>]*src=["']${escapeRegExp(file.name)}["'][^>]*>\\s*</script>`,
        "gi",
      );
      document = document.replace(
        pattern,
        () => `<script data-krypton-file="${file.name}">\n${file.content}\n</script>`,
      );
    }
  }

  return document;
}

export const LANGUAGE_META: Record<
  ArtifactLanguage,
  { label: string; short: string; dot: string; hljs: string }
> = {
  html: { label: "HTML", short: "HTML", dot: "bg-warning", hljs: "xml" },
  css: { label: "CSS", short: "CSS", dot: "bg-accent", hljs: "css" },
  javascript: { label: "JavaScript", short: "JS", dot: "bg-ice", hljs: "javascript" },
  markdown: { label: "Markdown", short: "MD", dot: "bg-violet", hljs: "markdown" },
};
