import type { Metadata } from "next";
import { ToolsView } from "@/components/tools/tools-view";

export const metadata: Metadata = {
  title: "Explore tools",
  description:
    "Planned KRYPTON capabilities with honest status labels: local demo interfaces or clearly marked coming-soon scopes.",
};

export default function ToolsPage() {
  return <ToolsView />;
}
