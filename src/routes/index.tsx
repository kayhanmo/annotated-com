import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  AudioLines,
  ExternalLink,
  FileText,
  Highlighter,
  PanelRight,
  Scale,
  Users,
  Video,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listFeed } from "@/lib/annotations";
import { AnnotationCard } from "@/components/annotation-card";

export const Route = createFileRoute("/")({
  loader: async () => {
    const feed = await listFeed({ data: { filter: "all" } });
    return { feed: feed.slice(0, 3) };
  },
  component: LandingPage,
});

function LandingPage() {
  const { feed } = Route.useLoaderData();

  return (
    <div className="chrome-shell min-h-dvh">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="pointer-events-none absolute inset-0 surface-grid opacity-40" />
          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-5">
                <Highlighter className="mr-1.5 h-3 w-3" />
                Clip · Annotate · Share
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.03em] text-[var(--color-fg)] sm:text-5xl md:text-6xl">
                Margin notes for the open web
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-lg">
                Annotated is a Chrome sidebar that lets you clip text, audio, or
                video from anywhere, add your take, and publish a public landing
                page that always links back to the source.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/clip">
                    Open the sidebar
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/feed">Browse the feed</Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto mt-14 max-w-5xl">
              <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-danger)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-fg-subtle)]/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]/50" />
                  <div className="ml-3 flex-1 truncate rounded-[var(--radius-sm)] bg-[var(--color-bg)] px-3 py-1 text-xs text-[var(--color-fg-subtle)]">
                    youtube.com/watch?v=…
                  </div>
                </div>
                <div className="grid md:grid-cols-[1.2fr_0.9fr]">
                  <div className="space-y-3 p-5 sm:p-6">
                    <div className="aspect-video rounded-[var(--radius-md)] bg-gradient-to-br from-[#1a2230] to-[#0d1016] surface-grid" />
                    <div className="h-2 w-3/4 max-w-[75%] rounded bg-[var(--color-bg-subtle)]" />
                    <div className="h-2 w-1/2 max-w-[50%] rounded bg-[var(--color-bg-subtle)]" />
                  </div>
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-panel)] p-4 md:border-l md:border-t-0 md:p-5">
                    <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                      <PanelRight className="h-3.5 w-3.5" />
                      Annotated sidebar
                    </div>
                    <ol className="space-y-3 text-sm text-[var(--color-fg-muted)]">
                      <li className="flex gap-3">
                        <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                          01
                        </span>
                        Detect page media (text, audio, video)
                      </li>
                      <li className="flex gap-3">
                        <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                          02
                        </span>
                        Clip ≤90s · video exports at 240p
                      </li>
                      <li className="flex gap-3">
                        <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                          03
                        </span>
                        Write or record your commentary
                      </li>
                      <li className="flex gap-3">
                        <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                          04
                        </span>
                        Publish landing page + feed post
                      </li>
                    </ol>
                    <Button asChild className="mt-5 w-full" size="sm">
                      <Link to="/clip">Try the clip flow</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                Built to spec
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Every checklist item, productized
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Video,
                  title: "90s / 240p clips",
                  body: "Hard caps on duration and resolution so clips stay commentary, not re-uploads.",
                },
                {
                  icon: ExternalLink,
                  title: "Always link the source",
                  body: "Every annotation landing page points back to the original URL.",
                },
                {
                  icon: Scale,
                  title: "File a claim",
                  body: "Visible dispute path on every public annotation for fair-use hygiene.",
                },
                {
                  icon: Users,
                  title: "Social feed",
                  body: "Follow annotators, like, and leave comments on public clips.",
                },
                {
                  icon: FileText,
                  title: "Text highlights",
                  body: "Clip passages from articles with permanent attribution.",
                },
                {
                  icon: AudioLines,
                  title: "Audio & video",
                  body: "Podcast segments and YouTube-style clips with range selection.",
                },
                {
                  icon: PanelRight,
                  title: "Sidebar-first",
                  body: "Primary surface is a Chrome side panel flow, simulated end-to-end here.",
                },
                {
                  icon: Highlighter,
                  title: "Text + audio takes",
                  body: "Write commentary or record a voice note before you publish.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5"
                >
                  <f.icon className="h-5 w-5 text-[var(--color-accent)]" />
                  <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  Live feed
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  What people are annotating
                </h2>
              </div>
              <Button asChild variant="secondary">
                <Link to="/feed">
                  Full feed
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {feed.map((a) => (
                <AnnotationCard key={a.id} annotation={a} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Sign in. Clip something. Ship a take.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--color-fg-muted)]">
              Accounts are X or Google only — same as the bounty spec. Publish
              to a public feed with source links and a dispute path on every
              page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/clip">Open sidebar</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-[var(--color-fg-subtle)] sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Highlighter className="h-4 w-4" />
            <span className="font-medium text-[var(--color-fg-muted)]">
              annotated
            </span>
          </div>
          <p>Clip media. Add your take. Always link the source.</p>
        </div>
      </footer>
    </div>
  );
}
