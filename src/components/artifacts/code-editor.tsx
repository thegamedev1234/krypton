"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import markdown from "highlight.js/lib/languages/markdown";
import { LANGUAGE_META } from "@/lib/artifact-preview";
import type { ArtifactFile } from "@/types";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("markdown", markdown);

interface CodeEditorProps {
  file: ArtifactFile;
}

/**
 * Read-only code view with a line-number gutter and syntax highlighting.
 * Content is seeded demo data from the repository — no user HTML is injected
 * into the application document (highlight.js escapes its output).
 */
export function CodeEditor({ file }: CodeEditorProps) {
  const meta = LANGUAGE_META[file.language];

  const highlighted = useMemo(() => {
    try {
      return hljs.highlight(file.content, { language: meta.hljs }).value;
    } catch {
      return hljs.highlightAuto(file.content).value;
    }
  }, [file.content, meta.hljs]);

  const lineCount = useMemo(() => file.content.split("\n").length, [file.content]);

  return (
    <div className="flex min-h-0 flex-1 overflow-auto bg-[rgb(9_12_20)]">
      <div
        className="select-none border-r border-line/60 px-2.5 py-3 text-right font-mono text-[12px] leading-[1.7] text-[#4d5a73]"
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }, (_, index) => (
          <div key={index}>{index + 1}</div>
        ))}
      </div>
      <pre className="min-w-0 flex-1 overflow-visible px-3 py-3">
        <code
          className={`hljs language-${meta.hljs} font-mono text-[12px] leading-[1.7]`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
