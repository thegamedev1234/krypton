"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

function extractText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return extractText(element.props.children);
  }
  return "";
}

interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Renders fenced code blocks with a language label and copy control.
 * Used as the `pre` renderer for the markdown pipeline, so syntax
 * highlighting continues to come from rehype-highlight.
 */
export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const codeElement = children as ReactElement<{ className?: string; children?: ReactNode }> | null;
  const className = codeElement?.props?.className ?? "";
  const match = /language-([\w-]+)/.exec(className);
  const language = match?.[1] ?? "code";
  const raw = extractText(codeElement?.props?.children).replace(/\n$/, "");

  async function handleCopy() {
    const ok = await copyToClipboard(raw);
    if (ok) setCopied(true);
  }

  return (
    <div className="code-shell my-3">
      <div className="flex items-center justify-between gap-2 border-b border-line/80 bg-[rgb(9_12_20)] px-3 py-1.5">
        <span className="font-mono text-2xs uppercase tracking-[0.08em] text-[#7d8aa4]">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-2xs font-medium transition-colors",
            copied ? "text-positive" : "text-[#8f9db8] hover:bg-white/[0.06] hover:text-white",
          )}
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}
