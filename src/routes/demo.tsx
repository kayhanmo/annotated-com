import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Badge variant="accent" className="mb-4">
          Bounty submission demo
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Annotated — product walkthrough
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
          Video walkthrough of the annotated.com build: Chrome sidebar clipper,
          real 240p video clips (≤90s), public feed, annotation landing pages
          with source links, and File a claim. Use this recording for the J-Cal
          bounty entry.
        </p>

        <div className="mt-8 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-black shadow-[var(--shadow-card)]">
          <video
            className="aspect-video w-full"
            controls
            playsInline
            preload="metadata"
            poster=""
          >
            <source src="/demo/annotated-submission.mp4" type="video/mp4" />
            <source src="/demo/annotated-submission.webm" type="video/webm" />
          </video>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href="/demo/annotated-submission.mp4" download>
              Download MP4
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href="/demo/annotated-submission.webm" download>
              Download WebM
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/clip">Open live sidebar</Link>
          </Button>
        </div>

        <ul className="mt-10 space-y-2 text-sm text-[var(--color-fg-muted)]">
          <li>· Real HTML5 video clips scrubbed to a ≤90s window at 240p</li>
          <li>· Source URL always linked on the annotation landing page</li>
          <li>· Visible File a claim control on every annotation</li>
          <li>· Public social feed with follow / like / comment</li>
          <li>· Sign-in via X or Google only</li>
        </ul>
      </main>
    </div>
  );
}
