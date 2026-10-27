"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu as MenuIcon, MessageSquarePlus } from "lucide-react";
import { KryptonMark, KryptonWordmark } from "@/components/brand/krypton-mark";
import { Sidebar } from "@/components/layout/sidebar";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { ToastViewport } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

const SECTION_LABELS: Record<string, string> = {
  "/chat": "AI Assistant",
  "/": "AI Assistant",
  "/tools": "Explore tools",
  "/artifacts": "Artifacts",
  "/settings": "Settings",
};

function MobileTopbar() {
  const { setMobileSidebarOpen, startNewChat } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const label = SECTION_LABELS[pathname] ?? "KRYPTON";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line/70 bg-surface/70 px-2.5 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="icon-btn h-9 w-9"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-4 w-4" />
      </button>

      <Link href="/chat" className="flex min-w-0 items-center gap-2" aria-label="KRYPTON workspace">
        <KryptonMark size={22} />
        <span className="flex min-w-0 flex-col leading-none">
          <KryptonWordmark className="text-[11px]" />
          <span className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-faint">
            {label}
          </span>
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip label="New chat" side="bottom">
          <button
            type="button"
            onClick={() => {
              startNewChat();
              router.push("/chat");
            }}
            className="icon-btn h-9 w-9"
            aria-label="New chat"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <a
        href="#krypton-main"
        className="sr-only-focusable absolute left-3 top-3 z-[100] rounded-lg border border-line bg-panel px-3 py-2 text-xs text-ink"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main id="krypton-main" className="relative min-h-0 flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      <ToastViewport />
    </div>
  );
}
