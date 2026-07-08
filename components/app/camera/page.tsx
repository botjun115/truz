import type { Metadata } from "next";
import { CameraViewport } from "@/components/Camera/CameraViewport";
import { Header } from "@/components/Header/Header";

export const metadata: Metadata = { title: "New Quest" };

export default function CameraPage() {
  return (
    <div className="page-shell">
      <Header title="New Quest" backHref="/" />
      <main className="page-content flex flex-col gap-4 pt-2">
        <CameraViewport />
      </main>
    </div>
  );
}
