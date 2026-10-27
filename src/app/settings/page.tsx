import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Interface-only KRYPTON settings: appearance, chat behaviour, default model, layout, shortcuts, and about.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
