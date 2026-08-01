import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { AnnotationCard } from "@/components/annotation-card";
import { Button } from "@/components/ui/button";
import { getProfile, toggleFollow } from "@/lib/annotations";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/u/$handle")({
  loader: async ({ params }) => {
    const data = await getProfile({
      data: { handle: params.handle },
    });
    if (!data) throw notFound();
    return data;
  },
  component: ProfilePage,
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)] px-4">
      <div className="text-center">
        <p className="text-lg font-semibold">Profile not found</p>
        <Button asChild className="mt-4" variant="secondary">
          <Link to="/feed">Back to feed</Link>
        </Button>
      </div>
    </div>
  ),
});

function ProfilePage() {
  const data = Route.useLoaderData();
  const { user } = useCurrentUserState();
  const [following, setFollowing] = useState(!!data.profile.isFollowing);
  const [followerCount, setFollowerCount] = useState(data.profile.followerCount);

  async function onFollow() {
    if (!user) {
      toast.message("Sign in to follow");
      return;
    }
    try {
      const res = await toggleFollow({ data: data.profile.userId });
      setFollowing(res.following);
      setFollowerCount((c) => c + (res.following ? 1 : -1));
    } catch {
      toast.error("Could not update follow");
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-bg-subtle)] text-lg font-semibold">
                {data.profile.image ? (
                  <img
                    src={data.profile.image}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  data.profile.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  {data.profile.name}
                </h1>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  @{data.profile.handle}
                </p>
              </div>
            </div>
            {user?.id !== data.profile.userId && (
              <Button
                size="sm"
                variant={following ? "secondary" : "default"}
                onClick={onFollow}
              >
                {following ? "Following" : "Follow"}
              </Button>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-[var(--color-fg-muted)]">
            <span>
              <strong className="text-[var(--color-fg)]">
                {data.profile.annotationCount}
              </strong>{" "}
              annotations
            </span>
            <span>
              <strong className="text-[var(--color-fg)]">{followerCount}</strong>{" "}
              followers
            </span>
            <span>
              <strong className="text-[var(--color-fg)]">
                {data.profile.followingCount}
              </strong>{" "}
              following
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {data.annotations.map((a) => (
            <AnnotationCard key={a.id} annotation={a} />
          ))}
        </div>
      </main>
    </div>
  );
}
