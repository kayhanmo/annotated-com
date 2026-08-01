import { useEffect, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  AudioLines,
  ExternalLink,
  FileText,
  Heart,
  MessageCircle,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { ClaimDialog } from "@/components/claim-dialog";
import { ClipPlayer } from "@/components/clip-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  addComment,
  getAnnotation,
  listComments,
  toggleFollow,
  toggleLike,
  type Comment,
} from "@/lib/annotations";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatRelativeTime, formatTimestamp } from "@/lib/utils";

export const Route = createFileRoute("/a/$slug")({
  loader: async ({ params }) => {
    const annotation = await getAnnotation({ data: params.slug });
    if (!annotation) throw notFound();
    const comments = await listComments({ data: annotation.id });
    return { annotation, comments };
  },
  component: AnnotationPage,
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)] px-4">
      <div className="text-center">
        <p className="text-lg font-semibold">Annotation not found</p>
        <Button asChild className="mt-4" variant="secondary">
          <Link to="/feed">Back to feed</Link>
        </Button>
      </div>
    </div>
  ),
});

function AnnotationPage() {
  const data = Route.useLoaderData();
  const { user } = useCurrentUserState();
  const [annotation, setAnnotation] = useState(data.annotation);
  const [comments, setComments] = useState<Comment[]>(data.comments);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setAnnotation(data.annotation);
    setComments(data.comments);
  }, [data]);

  const Icon =
    annotation.mediaType === "video"
      ? Video
      : annotation.mediaType === "audio"
        ? AudioLines
        : FileText;

  async function onLike() {
    if (!user) {
      toast.message("Sign in to like");
      return;
    }
    try {
      const res = await toggleLike({ data: annotation.id });
      setAnnotation((a) => ({
        ...a,
        likedByMe: res.liked,
        likeCount: a.likeCount + (res.liked ? 1 : -1),
      }));
    } catch {
      toast.error("Could not like");
    }
  }

  async function onFollow() {
    if (!user) {
      toast.message("Sign in to follow");
      return;
    }
    try {
      const res = await toggleFollow({ data: annotation.userId });
      setFollowing(res.following);
    } catch {
      toast.error("Could not follow");
    }
  }

  async function onComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.message("Sign in to comment");
      return;
    }
    if (!body.trim()) return;
    setBusy(true);
    try {
      const c = await addComment({
        data: { annotationId: annotation.id, body },
      });
      setComments((prev) => [...prev, c]);
      setAnnotation((a) => ({ ...a, commentCount: a.commentCount + 1 }));
      setBody("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Comment failed");
    } finally {
      setBusy(false);
    }
  }

  const hasAv =
    annotation.mediaType !== "text" &&
    (annotation.clipVideoUrl || annotation.sourceUrl);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <Icon className="mr-1 h-3 w-3" />
              {annotation.mediaType}
            </Badge>
            {annotation.mediaType === "video" && (
              <Badge variant="accent">{annotation.videoQuality}</Badge>
            )}
            {annotation.mediaType !== "text" && (
              <Badge variant="outline">
                {formatTimestamp(annotation.clipStartSec)}–
                {formatTimestamp(annotation.clipEndSec)} · max 90s
              </Badge>
            )}
          </div>
          <ClaimDialog annotationId={annotation.id} />
        </div>

        <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-soft)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <Link
                  to="/u/$handle"
                  params={{ handle: annotation.authorHandle }}
                  className="font-medium hover:underline"
                >
                  {annotation.authorName}
                </Link>
                <span className="text-[var(--color-fg-subtle)]">
                  @{annotation.authorHandle}
                </span>
                <span className="text-[var(--color-fg-subtle)]">·</span>
                <time className="text-[var(--color-fg-subtle)]">
                  {formatRelativeTime(annotation.createdAt)}
                </time>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                {annotation.sourceTitle}
              </h1>
            </div>
            <Button
              size="sm"
              variant={following ? "secondary" : "outline"}
              onClick={onFollow}
            >
              {following ? "Following" : "Follow"}
            </Button>
          </div>

          {hasAv && (
            <div className="mt-5">
              <ClipPlayer
                sourceUrl={annotation.sourceUrl}
                clipVideoUrl={annotation.clipVideoUrl}
                startSec={annotation.clipStartSec}
                endSec={annotation.clipEndSec}
                title={annotation.sourceTitle}
                qualityLabel={annotation.videoQuality || "240p"}
                autoplay={false}
                loopClip
              />
            </div>
          )}

          {annotation.clipText && (
            <blockquote className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm leading-relaxed">
              <span className="mark-highlight text-[var(--color-fg)]">
                “{annotation.clipText}”
              </span>
            </blockquote>
          )}

          <p className="mt-5 text-base leading-relaxed text-[var(--color-fg)]/95">
            {annotation.commentaryText}
          </p>

          {annotation.commentaryAudio && (
            <audio
              className="mt-4 w-full"
              controls
              src={annotation.commentaryAudio}
              preload="none"
            />
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
            <a
              href={annotation.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Original source · {annotation.sourceDomain}
            </a>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className={annotation.likedByMe ? "text-[var(--color-danger)]" : ""}
              >
                <Heart
                  className={`h-4 w-4 ${annotation.likedByMe ? "fill-current" : ""}`}
                />
                {annotation.likeCount}
              </Button>
              <span className="inline-flex items-center gap-1 px-2 text-sm text-[var(--color-fg-muted)]">
                <MessageCircle className="h-4 w-4" />
                {annotation.commentCount}
              </span>
            </div>
          </div>
        </article>

        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">Comments</h2>
          <form onSubmit={onComment} className="mt-4 space-y-3">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={user ? "Add a comment…" : "Sign in to comment"}
              disabled={!user}
            />
            <Button type="submit" size="sm" disabled={!user || busy || !body.trim()}>
              {busy ? "Posting…" : "Post comment"}
            </Button>
          </form>

          <ul className="mt-6 space-y-4">
            {comments.length === 0 && (
              <li className="text-sm text-[var(--color-fg-muted)]">
                No comments yet — start the conversation.
              </li>
            )}
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-x-2 text-sm">
                  <Link
                    to="/u/$handle"
                    params={{ handle: c.authorHandle }}
                    className="font-medium hover:underline"
                  >
                    {c.authorName}
                  </Link>
                  <span className="text-[var(--color-fg-subtle)]">
                    @{c.authorHandle}
                  </span>
                  <span className="text-[var(--color-fg-subtle)]">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
