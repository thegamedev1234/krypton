import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { WorkspaceProvider } from "@/components/providers/workspace-provider";

export const metadata: Metadata = {
  title: {
    default: "KRYPTON — AI workspace",
    template: "%s · KRYPTON",
  },
  description:
    "KRYPTON is a frontend-only demonstration of a premium AI workspace: conversations, model tiers, artifacts, tools, and settings.",
  applicationName: "KRYPTON",
  keywords: ["KRYPTON", "AI workspace", "frontend demo", "Next.js"],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#070910",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies the stored UI theme before first paint so the interface never
 * flashes the wrong background. Purely local: reads one localStorage key,
 * no network, no credentials.
 */
const THEME_BOOT_SCRIPT = `(function(){try{
  var raw = localStorage.getItem('krypton.ui-settings.v1');
  var settings = raw ? JSON.parse(raw) : {};
  var theme = settings.theme || 'dark';
  if (theme === 'system') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.motion = settings.reduceMotion ? 'reduced' : 'full';
  document.documentElement.dataset.reduceTransparency = settings.reduceTransparency ? 'true' : 'false';
}catch(error){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-motion="full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <WorkspaceProvider>
          <AppShell>{children}</AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
