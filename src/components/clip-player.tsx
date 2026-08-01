import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  parseYoutubeId,
  resolvePlayableSrc,
  youtubeClipEmbedSrc,
} from "@/lib/media";
import { formatTimestamp, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ClipPlayerProps = {
  sourceUrl: string;
  clipVideoUrl?: string | null;
  startSec: number;
  endSec: number;
  title?: string;
  qualityLabel?: string;
  className?: string;
  autoplay?: boolean;
  loopClip?: boolean;
  compact?: boolean;
};

/**
 * Plays a fair-use style clip:
 * - Direct video files: seeks to start, stops at end, rendered at ~240p scale
 * - YouTube: privacy embed with start/end params
 */
export function ClipPlayer({
  sourceUrl,
  clipVideoUrl,
  startSec,
  endSec,
  title,
  qualityLabel = "240p",
  className,
  autoplay = false,
  loopClip = true,
}: ClipPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(startSec);
  const [ready, setReady] = useState(false);
  const [mediaDuration, setMediaDuration] = useState<number | null>(null);
  const playable = resolvePlayableSrc(sourceUrl, clipVideoUrl);

  // Clamp clip window to actual media duration when known
  const safeEnd =
    mediaDuration != null
      ? Math.min(endSec, Math.max(0.5, mediaDuration - 0.05))
      : endSec;
  const safeStart = Math.min(startSec, Math.max(0, safeEnd - 0.5));
  const duration = Math.max(0.5, safeEnd - safeStart);
  const progress = Math.min(1, Math.max(0, (current - safeStart) / duration));

  useEffect(() => {
    const el = videoRef.current;
    if (!el || playable.kind !== "file") return;

    const onMeta = () => {
      const d = Number.isFinite(el.duration) ? el.duration : null;
      setMediaDuration(d);
      const end =
        d != null ? Math.min(endSec, Math.max(0.5, d - 0.05)) : endSec;
      const start = Math.min(startSec, Math.max(0, end - 0.5));
      el.currentTime = start;
      setCurrent(start);
      setReady(true);
      if (autoplay) {
        void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };
    const onTime = () => {
      const t = el.currentTime;
      setCurrent(t);
      const end =
        mediaDuration != null
          ? Math.min(endSec, Math.max(0.5, mediaDuration - 0.05))
          : endSec;
      const start = Math.min(startSec, Math.max(0, end - 0.5));
      if (t >= end - 0.05) {
        if (loopClip) {
          el.currentTime = start;
        } else {
          el.pause();
          setPlaying(false);
          el.currentTime = start;
        }
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onErr = () => setReady(false);

    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("error", onErr);
    if (el.readyState >= 1) onMeta();
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("error", onErr);
    };
  }, [playable.kind, playable.src, startSec, endSec, autoplay, loopClip, mediaDuration]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = safeStart;
    setCurrent(safeStart);
  }, [safeStart, playable.src]);

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      if (el.currentTime < safeStart || el.currentTime >= safeEnd) {
        el.currentTime = safeStart;
      }
      void el.play();
    } else {
      el.pause();
    }
  }

  if (playable.kind === "youtube" && playable.youtubeId) {
    const src = youtubeClipEmbedSrc(playable.youtubeId, startSec, endSec, {
      autoplay,
    });
    return (
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-black",
          className,
        )}
      >
        <div className="relative aspect-video">
          <div className="absolute inset-0 origin-center scale-[0.55] sm:scale-[0.65]">
            <iframe
              title={title ?? "Video clip"}
              src={src}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-2">
            <Badge className="border-white/20 bg-black/55 text-[var(--color-fg)] backdrop-blur-sm">
              YouTube clip · {qualityLabel}
            </Badge>
            <Badge className="border-white/20 bg-black/55 text-[var(--color-fg)] backdrop-blur-sm">
              {formatTimestamp(startSec)}–{formatTimestamp(endSec)}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-black",
        className,
      )}
    >
      <div className="relative aspect-video">
        <div className="absolute inset-0 grid place-items-center overflow-hidden bg-[#0a0a0c]">
          <video
            ref={videoRef}
            src={playable.src}
            className="h-full w-full object-contain"
            style={{
              maxHeight: 240,
              width: "100%",
              filter: "contrast(1.02) saturate(0.95)",
            }}
            playsInline
            preload="metadata"
            muted={muted}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2">
          <Badge className="border-white/20 bg-black/55 text-[var(--color-fg)] backdrop-blur-sm">
            Clip · {qualityLabel}
          </Badge>
          <Badge className="border-white/20 bg-black/55 text-[var(--color-fg)] backdrop-blur-sm">
            {formatTimestamp(safeStart)}–{formatTimestamp(safeEnd)} · max 90s
          </Badge>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10">
          <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full bg-[var(--color-accent)] transition-[width] duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-[var(--color-fg)] hover:bg-white/10"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-[var(--color-fg)] hover:bg-white/10"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <span className="ml-1 text-[11px] tabular-nums text-white/70">
                {formatTimestamp(Math.max(safeStart, current) - safeStart)} /{" "}
                {formatTimestamp(duration)}
              </span>
            </div>
            {!ready && (
              <span className="text-[11px] text-white/50">Loading clip…</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function youtubeThumb(url: string): string | null {
  const id = parseYoutubeId(url);
  if (!id) return null;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
