"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface MenuProps {
  trigger: ReactElement<{
    onClick?: (event: React.MouseEvent) => void;
    "aria-expanded"?: boolean;
    "aria-haspopup"?: "menu" | "dialog" | "listbox";
  }>;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: "start" | "end";
  label: string;
  className?: string;
  /** Minimum width of the menu surface, in pixels. */
  minWidth?: number;
}

/**
 * Portal-based dropdown. Renders outside scroll containers so conversation
 * menus are never clipped by the sidebar, and dismisses on outside pointer
 * down or Escape.
 */
export function Menu({
  trigger,
  children,
  align = "end",
  label,
  className,
  minWidth = 208,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: minWidth,
  });

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  const updatePosition = useCallback(() => {
    // The wrapper uses `display: contents`, so measure the real trigger node.
    const anchor =
      (anchorRef.current?.firstElementChild as HTMLElement | null) ?? anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const width = Math.max(minWidth, rect.width);
    const viewportPadding = 8;
    let left = align === "end" ? rect.right - width : rect.left;
    left = Math.min(Math.max(left, viewportPadding), window.innerWidth - width - viewportPadding);
    const estimatedHeight = panelRef.current?.offsetHeight ?? 220;
    let top = rect.bottom + 6;
    if (top + estimatedHeight > window.innerHeight - viewportPadding) {
      top = Math.max(viewportPadding, rect.top - estimatedHeight - 6);
    }
    setPosition({ top, left, width });
  }, [align, minWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const raf = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(raf);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        anchorRef.current?.querySelector<HTMLElement>("button, [role='button']")?.focus();
      }
    }

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  const enhancedTrigger = cloneElement(trigger, {
    "aria-expanded": open,
    "aria-haspopup": "menu" as const,
    onClick: (event: React.MouseEvent) => {
      trigger.props.onClick?.(event);
      setOpen((current) => !current);
    },
  });

  return (
    <>
      <span ref={anchorRef} className="contents">
        {enhancedTrigger}
      </span>
      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              role="menu"
              aria-label={label}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: position.width,
              }}
              className={cn("menu-surface z-[70] animate-scale-in", className)}
            >
              {typeof children === "function" ? children(close) : children}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

interface MenuItemProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  hint?: string;
  selected?: boolean;
}

export function MenuItem({
  icon,
  children,
  onClick,
  destructive,
  disabled,
  hint,
  selected,
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "menu-item",
        destructive &&
          "text-danger/90 hover:bg-danger/10 hover:text-danger focus-visible:bg-danger/10",
        selected && "text-ink",
      )}
    >
      {icon ? <span className="shrink-0 text-faint">{icon}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint ? <span className="shrink-0 font-mono text-2xs text-faint">{hint}</span> : null}
      {selected ? (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true">
          <path
            d="M3.5 8.5l3 3 6-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-line" role="separator" />;
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-2.5 pb-1 pt-1.5 text-2xs font-semibold uppercase tracking-[0.09em] text-faint">
      {children}
    </p>
  );
}
