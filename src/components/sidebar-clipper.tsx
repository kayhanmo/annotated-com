import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AudioLines,
  Check,
  ChevronRight,
  FileText,
  Highlighter,
  Mic,
  MicOff,
  PanelRight,
  Square,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { DEMO_SOURCES, type DemoSource } from "@/lib/demo-sources";
import { createAnnotation } from "@/lib/annotations";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ClipPlayer } from "@/components/clip-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatTimestamp } from "@/lib/utils";

type Step = "source" | "clip" | "commentary" | "done";

export function SidebarClipper() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [sourceId, setSourceId] = useState(DEMO_SOURCES[0]!.id);
  const source = useMemo(
    () => DEMO_SOURCES.find((s) => s.id === sourceId) ?? DEMO_SOURCES[0]!,
    [sourceId],
  );
  const [step, setStep] = useState<Step>("source");
  const defaultStart = source.defaultStart ?? 30;
  const defaultEnd = source.defaultEnd ?? Math.min(90, defaultStart + 60);
  const [range, setRange] = useState<[number, number]>([defaultStart, defaultEnd]);
  const [selectedText, setSelectedText] = useState(source.highlight ?? "");
  const [commentary, setCommentary] = useState("");
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrubVideoRef = useRef<HTMLVideoElement>(null);

  const duration = source.durationSec ?? 300;
  const clipLen = Math.min(90, Math.max(0, range[1] - range[0]));

  // Keep scrubber video parked at clip start when range changes
  useEffect(() => {
    const el = scrubVideoRef.current;
    if (!el) return;
    const seek = () => {
      try {
        el.currentTime = range[0];
      } catch {
        /* ignore */
      }
    };
    if (el.readyState >= 1) seek();
    else el.addEventListener("loadedmetadata", seek, { once: true });
  }, [range[0], source.clipVideoUrl]);

  function pickSource(s: DemoSource) {
    setSourceId(s.id);
    setStep("source");
    setSelectedText(s.highlight ?? "");
    const start = s.defaultStart ?? 30;
    const end = s.defaultEnd ?? Math.min(start + 60, 90);
    setRange([start, end]);
    setCommentary("");
    setAudioDataUrl(null);
    setPublishedSlug(null);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => setAudioDataUrl(String(reader.result));
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      toast.error("Microphone permission is required for audio commentary.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function publish() {
    if (isPending) return;
    if (!user) {
      toast.message("Sign in with X or Google to publish.");
      navigate({ to: "/login" });
      return;
    }
    if (!commentary.trim() && !audioDataUrl) {
      toast.error("Add a text or audio commentary before publishing.");
      return;
    }
    setPublishing(true);
    try {
      const ann = await createAnnotation({
        data: {
          mediaType: source.mediaType,
          sourceUrl: source.url,
          sourceTitle: source.title,
          clipText:
            source.mediaType === "text"
              ? selectedText || source.body.slice(0, 280)
              : null,
          clipStartSec: source.mediaType === "text" ? 0 : range[0],
          clipEndSec: source.mediaType === "text" ? 0 : range[1],
          commentaryText: commentary.trim() || "Audio commentary attached.",
          commentaryAudio: audioDataUrl,
          clipVideoUrl: source.clipVideoUrl ?? null,
        },
      });
      setPublishedSlug(ann.slug);
      setStep("done");
      toast.success("Annotation published with video clip.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Publish failed";
      if (msg === "Unauthorized") {
        toast.message("Sign in with X or Google to publish.");
        navigate({ to: "/login" });
      } else {
        toast.error(msg);
      }
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-0 lg:overflow-hidden lg:rounded-[var(--radius-2xl)] lg:border lg:border-[var(--color-border)] lg:bg-[var(--color-bg-elevated)] lg:shadow-[var(--shadow-card)]">
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)] lg:rounded-none lg:border-0 lg:border-r">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-danger)]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-fg-subtle)]/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]/60" />
          <div className="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs text-[var(--color-fg-muted)]">
            <PanelRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{source.url}</span>
          </div>
        </div>

        <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
          <aside className="hidden border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 sm:block">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Demo pages
            </p>
            <div className="space-y-1">
              {DEMO_SOURCES.map((s) => {
                const Icon =
                  s.mediaType === "video"
                    ? Video
                    : s.mediaType === "audio"
                      ? AudioLines
                      : FileText;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickSource(s)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-xs transition",
                      s.id === source.id
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                        : "text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]",
                    )}
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-2">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap gap-2 sm:hidden">
              {DEMO_SOURCES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pickSource(s)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px]",
                    s.id === source.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                      : "border-[var(--color-border)] text-[var(--color-fg-muted)]",
                  )}
                >
                  {s.mediaType}
                </button>
              ))}
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              {source.domain}
              {source.channel ? ` · ${source.channel}` : ""}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              {source.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              {source.description}
            </p>

            {(source.mediaType === "video" || source.mediaType === "audio") &&
              source.clipVideoUrl && (
                <div className="mt-5">
                  <ClipPlayer
                    sourceUrl={source.url}
                    clipVideoUrl={source.clipVideoUrl}
                    startSec={range[0]}
                    endSec={range[1]}
                    title={source.title}
                    qualityLabel="240p"
                    loopClip
                  />
                  <p className="mt-2 text-[11px] text-[var(--color-fg-subtle)]">
                    Live clip preview — window {formatTimestamp(range[0])}–
                    {formatTimestamp(range[1])} · exported at 240p · max 90s
                  </p>
                </div>
              )}

            {source.mediaType === "text" && (
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                <p>
                  {source.body
                    .split(source.highlight ?? "___NEVER___")
                    .map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && source.highlight ? (
                          <mark
                            className={cn(
                              "rounded-sm bg-[color-mix(in_oklab,var(--color-mark)_28%,transparent)] px-0.5 text-[var(--color-fg)]",
                              selectedText === source.highlight &&
                                "ring-1 ring-[var(--color-accent)]",
                            )}
                          >
                            {source.highlight}
                          </mark>
                        ) : null}
                      </span>
                    ))}
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedText(
                      source.highlight ?? source.body.slice(0, 200),
                    );
                    setStep("clip");
                  }}
                >
                  <Highlighter className="h-3.5 w-3.5" />
                  Highlight passage
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="flex min-h-[520px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] lg:rounded-none lg:border-0">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-[var(--radius-xs)] bg-[var(--color-fg)] text-[var(--color-primary-fg)]">
              <Highlighter className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-tight">Annotated</p>
              <p className="text-[10px] text-[var(--color-fg-subtle)]">
                Chrome sidebar
              </p>
            </div>
          </div>
          <Badge variant="accent">side panel</Badge>
        </div>

        <div className="flex items-center gap-1 border-b border-[var(--color-border)] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
          {(["source", "clip", "commentary", "done"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 opacity-40" />}
              <span
                className={cn(
                  "rounded px-1.5 py-0.5",
                  step === s &&
                    "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
                )}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {step === "source" && (
            <>
              <div>
                <p className="text-sm font-medium">Page detected</p>
                <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                  {source.mediaType === "video" &&
                    "Video page — select a ≤90s window. Clip plays for real at 240p."}
                  {source.mediaType === "audio" &&
                    "Podcast segment — select a ≤90s window."}
                  {source.mediaType === "text" &&
                    "Article — highlight a passage to annotate."}
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
                <p className="text-xs font-medium text-[var(--color-fg)]">
                  {source.title}
                </p>
                <p className="mt-1 text-[11px] text-[var(--color-fg-subtle)]">
                  {source.domain}
                </p>
              </div>
              <Button
                onClick={() => {
                  if (source.mediaType === "text") {
                    setSelectedText(
                      source.highlight ?? source.body.slice(0, 200),
                    );
                  }
                  setStep("clip");
                }}
              >
                Start clip
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === "clip" && (
            <>
              {source.mediaType === "text" ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Highlighted text</p>
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-xs leading-relaxed text-[var(--color-fg-muted)]">
                    <span className="mark-highlight text-[var(--color-fg)]">
                      {selectedText || "Select text on the page."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Clip window</p>
                    <Badge variant={clipLen <= 90 ? "accent" : "outline"}>
                      {clipLen}s / 90s max
                    </Badge>
                  </div>
                  {source.clipVideoUrl && (
                    <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-black">
                      <video
                        ref={scrubVideoRef}
                        src={source.clipVideoUrl}
                        className="aspect-video w-full object-contain"
                        style={{ maxHeight: 160 }}
                        muted
                        playsInline
                        preload="metadata"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                  <Slider
                    min={0}
                    max={Math.min(duration, 600)}
                    step={1}
                    value={range}
                    onValueChange={(v) => {
                      const [a, b] = v as [number, number];
                      if (b - a > 90) {
                        if (a !== range[0]) setRange([b - 90, b]);
                        else setRange([a, a + 90]);
                      } else {
                        setRange([a, b]);
                      }
                    }}
                  />
                  <div className="flex justify-between text-xs text-[var(--color-fg-subtle)]">
                    <span>Start {formatTimestamp(range[0])}</span>
                    <span>End {formatTimestamp(range[1])}</span>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-3 text-[11px] text-[var(--color-fg-muted)]">
                    Video clips are played and exported at{" "}
                    <span className="font-medium text-[var(--color-fg)]">
                      240p
                    </span>{" "}
                    with a hard 90-second cap for fair-use hygiene.
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setStep("source")}
                >
                  Back
                </Button>
                <Button className="flex-1" onClick={() => setStep("commentary")}>
                  Generate landing page
                </Button>
              </div>
            </>
          )}

          {step === "commentary" && (
            <>
              {source.mediaType !== "text" && source.clipVideoUrl && (
                <ClipPlayer
                  sourceUrl={source.url}
                  clipVideoUrl={source.clipVideoUrl}
                  startSec={range[0]}
                  endSec={range[1]}
                  title={source.title}
                  compact
                />
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">Your commentary</p>
                <Textarea
                  value={commentary}
                  onChange={(e) => setCommentary(e.target.value)}
                  placeholder="Add your take — why this clip matters."
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Audio commentary</p>
                <div className="flex flex-wrap gap-2">
                  {!recording ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={startRecording}
                    >
                      <Mic className="h-3.5 w-3.5" />
                      Record
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={stopRecording}
                    >
                      <Square className="h-3.5 w-3.5" />
                      Stop
                    </Button>
                  )}
                  {audioDataUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAudioDataUrl(null)}
                    >
                      <MicOff className="h-3.5 w-3.5" />
                      Clear audio
                    </Button>
                  )}
                </div>
                {audioDataUrl && (
                  <audio
                    controls
                    src={audioDataUrl}
                    className="w-full"
                    preload="metadata"
                  />
                )}
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-[11px] text-[var(--color-fg-muted)]">
                Publishing creates a public landing page with a playable video
                clip, source link, and a visible{" "}
                <span className="text-[var(--color-fg)]">File a claim</span>{" "}
                button.
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setStep("clip")}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={publishing}
                  onClick={publish}
                >
                  {publishing ? "Publishing…" : "Publish to feed"}
                </Button>
              </div>
            </>
          )}

          {step === "done" && publishedSlug && (
            <div className="flex flex-1 flex-col items-start justify-center gap-4 py-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-semibold">Live with video</p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                  Your annotation includes a playable clip window and appears in
                  the social feed.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/a/$slug",
                      params: { slug: publishedSlug },
                    })
                  }
                >
                  Open landing page
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate({ to: "/feed" })}
                >
                  Browse feed
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep("source");
                    setCommentary("");
                    setAudioDataUrl(null);
                    setPublishedSlug(null);
                  }}
                >
                  Clip another
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
