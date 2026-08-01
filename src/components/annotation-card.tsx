import { Link } from "@tanstack/react-router";
import {
  AudioLines,
  ExternalLink,
  FileText,
  Heart,
  MessageCircle,
  Video,
} from "lucide-react";
import type { Annotation } from "@/lib/annotations";
import { formatRelativeTime, formatTimestamp, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipPlayer } from "@/components/clip-player";

const mediaIcon = {
  text: FileText,
  video: Video,
  audio: AudioLines,
} as const;

export function AnnotationCard({
  annotation,
  onLike,
  onFollow,
  compact,
  showPlayer = true,
}: {
  annotation: Annotation;
  onLike?: (id: string) => void;
  onFollow?: (userId: string) => void;
  compact?: boolean;
  showPlayer?: boolean;
}) {
  const Icon = mediaIcon[annotation.mediaType];
  const hasVideo =
    showPlayer &&
    annotation.mediaType !== "text" &&
    (annotation.clipVideoUrl || annotation.sourceUrl);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-soft)] transition hover:border-[var(--color-border-strong)]",
        compact && "rounded-[var(--radius-lg)]",
      )}
    >
      {hasVideo ? (
        <div className="border-b border-[var(--color-border)]">
          <ClipPlayer
            sourceUrl={annotation.sourceUrl}
            clipVideoUrl={annotation.clipVideoUrl}
            startSec={annotation.clipStartSec}
            endSec={annotation.clipEndSec}
            title={annotation.sourceTitle}
            qualityLabel={annotation.videoQuality || "240p"}
            compact
            loopClip
          />
        </div>
      ) : (
        <div className="relative h-20 bg-gradient-to-br from-[#2a3a4c] to-[#121820]">
          <div className="absolute inset-0 surface-grid opacity-30" />
          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
            <Badge className="border-white/20 bg-black/45 text-[var(--color-fg)] backdrop-blur-sm">
              <Icon className="mr-1 h-3 w-3" />
              {annotation.mediaType}
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <Link
                to="/u/$handle"
                params={{ handle: annotation.authorHandle }}
                className="font-medium text-[var(--color-fg)] hover:underline"
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
            <Link
              to="/a/$slug"
              params={{ slug: annotation.slug }}
              className="mt-1 block text-base font-semibold tracking-tight text-[var(--color-fg)] hover:text-[var(--color-accent)]"
            >
              {annotation.sourceTitle}
            </Link>
            {annotation.mediaType !== "text" && (
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">
                Clip {formatTimestamp(annotation.clipStartSec)}–
                {formatTimestamp(annotation.clipEndSec)} ·{" "}
                {annotation.videoQuality || "240p"}
              </p>
            )}
          </div>
          {onFollow && (
            <Button
              size="sm"
              variant={annotation.isFollowing ? "secondary" : "outline"}
              onClick={() => onFollow(annotation.userId)}
            >
              {annotation.isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {annotation.clipText && (
          <blockquote className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <span className="mark-highlight text-[var(--color-fg)]">
              “{annotation.clipText}”
            </span>
          </blockquote>
        )}

        <p className="text-sm leading-relaxed text-[var(--color-fg)]/90">
          {annotation.commentaryText}
        </p>

        {annotation.commentaryAudio && (
          <audio
            controls
            className="w-full"
            src={annotation.commentaryAudio}
            preload="none"
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          <a
            href={annotation.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {annotation.sourceDomain}
          </a>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(annotation.likedByMe && "text-[var(--color-danger)]")}
              onClick={() => onLike?.(annotation.id)}
            >
              <Heart
                className={cn("h-4 w-4", annotation.likedByMe && "fill-current")}
              />
              {annotation.likeCount}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/a/$slug" params={{ slug: annotation.slug }}>
                <MessageCircle className="h-4 w-4" />
                {annotation.commentCount}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
