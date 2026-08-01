import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SidebarClipper } from "@/components/sidebar-clipper";

export const Route = createFileRoute("/clip")({
  component: ClipPage,
});

function ClipPage() {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
            Primary surface
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Chrome sidebar clipper
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            Full end-to-end clip flow in a side-panel layout: pick a page, select
            a text passage or ≤90s media window, add text or audio commentary,
            and publish a public landing page with source link + File a claim.
          </p>
        </div>
        <SidebarClipper />
      </main>
    </div>
  );
}
