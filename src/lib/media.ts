/** YouTube + direct video helpers for clip playback. */

/**
 * Local sample MP4s served from /public/clips (bundled with the app).
 * Reliable for HTML5 playback without third-party hotlink/CORS failures.
 */
export const SAMPLE_VIDEOS = {
  bunny: "/clips/bbb.mp4",
  elephants: "/clips/short2.mp4",
  blazes: "/clips/flower.mp4",
  escape: "/clips/sample.mp4",
  joyrides: "/clips/short1.mp4",
} as const;

export function parseYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "").trim();
      return id || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1]!;
      const shortsIdx = parts.indexOf("shorts");
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1]!;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function isDirectVideoUrl(url: string): boolean {
  try {
    if (url.startsWith("/clips/") || url.startsWith("/")) {
      return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
    }
    const path = new URL(url).pathname.toLowerCase();
    return /\.(mp4|webm|ogg|mov)(\?|$)/.test(path);
  } catch {
    return false;
  }
}

/** Privacy-enhanced embed locked to a clip window (YouTube start/end). */
export function youtubeClipEmbedSrc(
  videoId: string,
  startSec: number,
  endSec: number,
  opts?: { autoplay?: boolean },
): string {
  const start = Math.max(0, Math.floor(startSec));
  const end = Math.max(start + 1, Math.floor(endSec));
  const params = new URLSearchParams({
    start: String(start),
    end: String(end),
    modestbranding: "1",
    rel: "0",
    controls: "1",
    playsinline: "1",
  });
  if (opts?.autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params}`;
}

/**
 * Prefer a direct MP4 for reliable clip scrubbing in-app.
 * Falls back to YouTube page URL (embed via parseYoutubeId).
 */
export function resolvePlayableSrc(
  sourceUrl: string,
  clipVideoUrl?: string | null,
): {
  kind: "file" | "youtube";
  src: string;
  youtubeId?: string;
} {
  if (clipVideoUrl && isDirectVideoUrl(clipVideoUrl)) {
    return { kind: "file", src: clipVideoUrl };
  }
  if (isDirectVideoUrl(sourceUrl)) {
    return { kind: "file", src: sourceUrl };
  }
  const yt = parseYoutubeId(sourceUrl);
  if (yt) return { kind: "youtube", src: sourceUrl, youtubeId: yt };
  return { kind: "file", src: clipVideoUrl || sourceUrl };
}
