import { useCallback, useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { AnnotationCard } from "@/components/annotation-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  listFeed,
  toggleFollow,
  toggleLike,
  type Annotation,
} from "@/lib/annotations";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  const { user, isPending } = useCurrentUserState();
  const [filter, setFilter] = useState<"all" | "following">("all");
  const [items, setItems] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listFeed({
        data: {
          filter,
          userId: user?.id ?? null,
        },
      });
      setItems(data);
    } catch {
      toast.error("Could not load feed");
    } finally {
      setLoading(false);
    }
  }, [filter, user?.id]);

  useEffect(() => {
    if (isPending) return;
    void load();
  }, [isPending, load]);

  async function handleLike(id: string) {
    if (!user) {
      toast.message("Sign in to like annotations");
      return;
    }
    try {
      const res = await toggleLike({ data: id });
      setItems((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                likedByMe: res.liked,
                likeCount: a.likeCount + (res.liked ? 1 : -1),
              }
            : a,
        ),
      );
    } catch {
      toast.error("Could not update like");
    }
  }

  async function handleFollow(userId: string) {
    if (!user) {
      toast.message("Sign in to follow people");
      return;
    }
    try {
      const res = await toggleFollow({ data: userId });
      setItems((prev) =>
        prev.map((a) =>
          a.userId === userId ? { ...a, isFollowing: res.following } : a,
        ),
      );
    } catch {
      toast.error("Could not update follow");
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
              Public annotations from across the web
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/clip">New clip</Link>
          </Button>
        </div>

        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as "all" | "following")}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-[var(--color-bg-elevated)]"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] px-6 py-16 text-center">
            <p className="text-sm font-medium">No annotations yet</p>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
              {filter === "following"
                ? "Follow people to see their clips here."
                : "Open the sidebar and publish the first one."}
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link to="/clip">Open sidebar</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((a) => (
              <AnnotationCard
                key={a.id}
                annotation={a}
                onLike={handleLike}
                onFollow={handleFollow}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
