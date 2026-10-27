import type { Metadata } from "next";
import { ArtifactsView } from "@/components/artifacts/artifacts-view";

export const metadata: Metadata = {
  title: "Artifacts",
  description:
    "Inspect demo artifacts with a code view and a sandboxed HTML preview. Local sample objects only.",
};

export default function ArtifactsPage() {
  return <ArtifactsView />;
}
