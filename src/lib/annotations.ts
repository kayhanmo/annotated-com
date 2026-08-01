import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { domainFromUrl, handleFromName, slugify } from "@/lib/utils";
import { SAMPLE_VIDEOS } from "@/lib/media";

export type MediaType = "text" | "video" | "audio";

export type Annotation = {
  id: string;
  slug: string;
  userId: string;
  authorName: string;
  authorHandle: string;
  authorImage: string | null;
  mediaType: MediaType;
  sourceUrl: string;
  sourceTitle: string;
  sourceDomain: string;
  clipText: string | null;
  clipStartSec: number;
  clipEndSec: number;
  videoQuality: string;
  commentaryText: string;
  commentaryAudio: string | null;
  clipVideoUrl: string | null;
  accent: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  likedByMe?: boolean;
  isFollowing?: boolean;
};

export type Comment = {
  id: string;
  annotationId: string;
  userId: string;
  authorName: string;
  authorHandle: string;
  authorImage: string | null;
  body: string;
  createdAt: string;
};

export type Profile = {
  userId: string;
  name: string;
  handle: string;
  image: string | null;
  annotationCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
};

type AnnotationRow = {
  id: string;
  slug: string;
  user_id: string;
  author_name: string;
  author_handle: string;
  author_image: string | null;
  media_type: MediaType;
  source_url: string;
  source_title: string;
  source_domain: string;
  clip_text: string | null;
  clip_start_sec: number;
  clip_end_sec: number;
  video_quality: string;
  commentary_text: string;
  commentary_audio: string | null;
  clip_video_url: string | null;
  accent: string;
  like_count: number;
  comment_count: number;
  created_at: string | Date;
};

function mapAnnotation(row: AnnotationRow, extras?: Partial<Annotation>): Annotation {
  return {
    id: row.id,
    slug: row.slug,
    userId: row.user_id,
    authorName: row.author_name,
    authorHandle: row.author_handle,
    authorImage: row.author_image,
    mediaType: row.media_type,
    sourceUrl: row.source_url,
    sourceTitle: row.source_title,
    sourceDomain: row.source_domain,
    clipText: row.clip_text,
    clipStartSec: Number(row.clip_start_sec),
    clipEndSec: Number(row.clip_end_sec),
    videoQuality: row.video_quality,
    commentaryText: row.commentary_text,
    commentaryAudio: row.commentary_audio,
    clipVideoUrl: row.clip_video_url ?? null,
    accent: row.accent,
    likeCount: Number(row.like_count),
    commentCount: Number(row.comment_count),
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : new Date(row.created_at).toISOString(),
    ...extras,
  };
}

async function authorFromUserId(userId: string): Promise<{
  name: string;
  handle: string;
  image: string | null;
}> {
  const sql = await getSql();
  const rows = await sql<{ name: string; email: string; image: string | null }>`
    select name, email, image from "user" where id = ${userId} limit 1
  `;
  const name =
    rows[0]?.name?.trim() ||
    rows[0]?.email?.split("@")[0] ||
    (userId === "dev-user" ? "Dev User" : "Annotator");
  return {
    name,
    handle: handleFromName(name),
    image: rows[0]?.image ?? null,
  };
}

const SEED: Omit<AnnotationRow, "created_at">[] = [
  {
    id: "seed-1",
    slug: "all-in-on-ai-bubbles",
    user_id: "seed-user-jason",
    author_name: "Maya Chen",
    author_handle: "mayachen",
    author_image: null,
    media_type: "video",
    source_url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    source_title: "All-In style debate — Is this an AI bubble?",
    source_domain: "youtube.com",
    clip_text: null,
    clip_start_sec: 1,
    clip_end_sec: 9,
    video_quality: "240p",
    commentary_text:
      "The useful framing here is not bubble vs not-bubble — it's whether infrastructure returns compound faster than the narrative. Clip this every cycle.",
    commentary_audio: null,
    clip_video_url: SAMPLE_VIDEOS.bunny,
    accent: "slate",
    like_count: 42,
    comment_count: 3,
  },
  {
    id: "seed-2",
    slug: "fair-use-for-clips",
    user_id: "seed-user-noah",
    author_name: "Noah Patel",
    author_handle: "noahp",
    author_image: null,
    media_type: "text",
    source_url: "https://www.eff.org/issues/fair-use",
    source_title: "Fair Use — Electronic Frontier Foundation",
    source_domain: "eff.org",
    clip_text:
      "Fair use is a legal doctrine that promotes freedom of expression by permitting the unlicensed use of copyright-protected works in certain circumstances.",
    clip_start_sec: 0,
    clip_end_sec: 0,
    video_quality: "240p",
    commentary_text:
      "This is the doctrinal backbone for short, attributed, commentary-first clips. Source link + claim button is the product expression of fair use hygiene.",
    commentary_audio: null,
    clip_video_url: null,
    accent: "ink",
    like_count: 28,
    comment_count: 1,
  },
  {
    id: "seed-3",
    slug: "this-week-in-startups-clip",
    user_id: "seed-user-aria",
    author_name: "Aria Okonkwo",
    author_handle: "ariaok",
    author_image: null,
    media_type: "audio",
    source_url: "https://thisweekinstartups.com/",
    source_title: "This Week in Startups — Founder interview",
    source_domain: "thisweekinstartups.com",
    clip_text: null,
    clip_start_sec: 0,
    clip_end_sec: 5,
    video_quality: "240p",
    commentary_text:
      "Seventy seconds of pure product intuition. The guest describes discovery as 'annotation of the open web' — basically the annotated thesis.",
    commentary_audio: null,
    clip_video_url: SAMPLE_VIDEOS.blazes,
    accent: "teal",
    like_count: 19,
    comment_count: 0,
  },
  {
    id: "seed-4",
    slug: "margin-notes-on-media",
    user_id: "seed-user-leo",
    author_name: "Leo Marquez",
    author_handle: "leom",
    author_image: null,
    media_type: "text",
    source_url: "https://www.newyorker.com/",
    source_title: "The New Yorker — Culture desk",
    source_domain: "newyorker.com",
    clip_text:
      "Criticism is not the opposite of enjoyment; it is the careful documentation of how a work lands in a particular mind at a particular time.",
    clip_start_sec: 0,
    clip_end_sec: 0,
    video_quality: "240p",
    commentary_text:
      "Annotated is criticism infrastructure for the feed era. Highlight → annotate → publish. The landing page is the permanent margin note.",
    commentary_audio: null,
    clip_video_url: null,
    accent: "rose",
    like_count: 61,
    comment_count: 2,
  },
  {
    id: "seed-5",
    slug: "youtube-clip-economy",
    user_id: "seed-user-sam",
    author_name: "Sam Rivera",
    author_handle: "samr",
    author_image: null,
    media_type: "video",
    source_url: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    source_title: "How short-form commentary actually works",
    source_domain: "youtube.com",
    clip_text: null,
    clip_start_sec: 2,
    clip_end_sec: 20,
    video_quality: "240p",
    commentary_text:
      "Downgrade to 240p, cap at 90s, always link back. If your clip can't survive those constraints, it wasn't a clip — it was a rip.",
    commentary_audio: null,
    clip_video_url: SAMPLE_VIDEOS.elephants,
    accent: "amber",
    like_count: 33,
    comment_count: 1,
  },
];

const SEED_COMMENTS: Array<{
  id: string;
  annotation_id: string;
  user_id: string;
  author_name: string;
  author_handle: string;
  body: string;
}> = [
  {
    id: "sc-1",
    annotation_id: "seed-1",
    user_id: "seed-user-noah",
    author_name: "Noah Patel",
    author_handle: "noahp",
    body: "Exactly — the infra ROI chart is the real debate.",
  },
  {
    id: "sc-2",
    annotation_id: "seed-1",
    user_id: "seed-user-aria",
    author_name: "Aria Okonkwo",
    author_handle: "ariaok",
    body: "Would love a thread of every time this argument reappears.",
  },
  {
    id: "sc-3",
    annotation_id: "seed-1",
    user_id: "seed-user-leo",
    author_name: "Leo Marquez",
    author_handle: "leom",
    body: "Publishing this as an annotation is the point.",
  },
  {
    id: "sc-4",
    annotation_id: "seed-2",
    user_id: "seed-user-sam",
    author_name: "Sam Rivera",
    author_handle: "samr",
    body: "File-a-claim on every page is underrated product design.",
  },
  {
    id: "sc-5",
    annotation_id: "seed-4",
    user_id: "seed-user-maya",
    author_name: "Maya Chen",
    author_handle: "mayachen",
    body: "Margin notes for the open web — yes.",
  },
  {
    id: "sc-6",
    annotation_id: "seed-4",
    user_id: "seed-user-noah",
    author_name: "Noah Patel",
    author_handle: "noahp",
    body: "This is the thesis sentence.",
  },
  {
    id: "sc-7",
    annotation_id: "seed-5",
    user_id: "seed-user-aria",
    author_name: "Aria Okonkwo",
    author_handle: "ariaok",
    body: "90s / 240p is a feature, not a bug.",
  },
];

async function ensureSeeded() {
  const sql = await getSql();
  const existing = await sql<{ c: number }>`select count(*)::int as c from annotations`;
  if ((existing[0]?.c ?? 0) > 0) {
    // Always refresh clip assets + windows on seed rows so local MP4s stay wired
    await sql`
      update annotations set
        clip_video_url = ${SAMPLE_VIDEOS.bunny},
        clip_start_sec = 1,
        clip_end_sec = 9,
        source_url = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        source_title = 'All-In style debate — Is this an AI bubble?'
      where id = 'seed-1'
    `;
    await sql`
      update annotations set
        clip_video_url = ${SAMPLE_VIDEOS.blazes},
        clip_start_sec = 0,
        clip_end_sec = 5
      where id = 'seed-3'
    `;
    await sql`
      update annotations set
        clip_video_url = ${SAMPLE_VIDEOS.elephants},
        clip_start_sec = 2,
        clip_end_sec = 20,
        source_url = 'https://www.youtube.com/watch?v=eRsGyueVLvQ'
      where id = 'seed-5'
    `;
    return;
  }

  for (let i = 0; i < SEED.length; i++) {
    const a = SEED[i];
    const created = new Date(Date.now() - (i + 1) * 3600_000 * 5).toISOString();
    await sql`
      insert into annotations (
        id, slug, user_id, author_name, author_handle, author_image,
        media_type, source_url, source_title, source_domain, clip_text,
        clip_start_sec, clip_end_sec, video_quality, commentary_text,
        commentary_audio, clip_video_url, accent, like_count, comment_count, created_at
      ) values (
        ${a.id}, ${a.slug}, ${a.user_id}, ${a.author_name}, ${a.author_handle}, ${a.author_image},
        ${a.media_type}, ${a.source_url}, ${a.source_title}, ${a.source_domain}, ${a.clip_text},
        ${a.clip_start_sec}, ${a.clip_end_sec}, ${a.video_quality}, ${a.commentary_text},
        ${a.commentary_audio}, ${a.clip_video_url}, ${a.accent}, ${a.like_count}, ${a.comment_count}, ${created}
      )
      on conflict (id) do nothing
    `;
  }

  for (const c of SEED_COMMENTS) {
    await sql`
      insert into annotation_comments (
        id, annotation_id, user_id, author_name, author_handle, author_image, body, created_at
      ) values (
        ${c.id}, ${c.annotation_id}, ${c.user_id}, ${c.author_name}, ${c.author_handle},
        ${null}, ${c.body}, ${new Date(Date.now() - 1800_000).toISOString()}
      )
      on conflict (id) do nothing
    `;
  }
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export const listFeed = createServerFn({ method: "GET" })
  .validator((data?: { filter?: "all" | "following"; userId?: string | null }) => data ?? {})
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const filter = data.filter ?? "all";
    const viewerId = data.userId ?? null;

    let rows: AnnotationRow[];
    if (filter === "following" && viewerId) {
      rows = await sql<AnnotationRow>`
        select a.* from annotations a
        inner join follows f on f.following_id = a.user_id
        where f.follower_id = ${viewerId}
        order by a.created_at desc
        limit 50
      `;
    } else {
      rows = await sql<AnnotationRow>`
        select * from annotations
        order by created_at desc
        limit 50
      `;
    }

    const liked = new Set<string>();
    const following = new Set<string>();
    if (viewerId && rows.length) {
      const ids = rows.map((r) => r.id);
      const likeRows = await sql.query<{ annotation_id: string }>(
        `select annotation_id from annotation_likes where user_id = $1 and annotation_id = any($2::text[])`,
        [viewerId, ids],
      );
      likeRows.forEach((r) => liked.add(r.annotation_id));

      const authorIds = [...new Set(rows.map((r) => r.user_id))];
      const followRows = await sql.query<{ following_id: string }>(
        `select following_id from follows where follower_id = $1 and following_id = any($2::text[])`,
        [viewerId, authorIds],
      );
      followRows.forEach((r) => following.add(r.following_id));
    }

    return rows.map((r) =>
      mapAnnotation(r, {
        likedByMe: liked.has(r.id),
        isFollowing: following.has(r.user_id),
      }),
    );
  });

export const getAnnotation = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<AnnotationRow>`
      select * from annotations where slug = ${slug} limit 1
    `;
    if (!rows[0]) return null;
    return mapAnnotation(rows[0]);
  });

export const listComments = createServerFn({ method: "GET" })
  .validator((annotationId: string) => annotationId)
  .handler(async ({ data: annotationId }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      annotation_id: string;
      user_id: string;
      author_name: string;
      author_handle: string;
      author_image: string | null;
      body: string;
      created_at: string | Date;
    }>`
      select * from annotation_comments
      where annotation_id = ${annotationId}
      order by created_at asc
    `;
    return rows.map(
      (r): Comment => ({
        id: r.id,
        annotationId: r.annotation_id,
        userId: r.user_id,
        authorName: r.author_name,
        authorHandle: r.author_handle,
        authorImage: r.author_image,
        body: r.body,
        createdAt:
          typeof r.created_at === "string"
            ? r.created_at
            : new Date(r.created_at).toISOString(),
      }),
    );
  });

export type CreateAnnotationInput = {
  mediaType: MediaType;
  sourceUrl: string;
  sourceTitle: string;
  clipText?: string | null;
  clipStartSec?: number;
  clipEndSec?: number;
  commentaryText: string;
  commentaryAudio?: string | null;
  clipVideoUrl?: string | null;
  accent?: string;
};

export const createAnnotation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: CreateAnnotationInput) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const author = await authorFromUserId(context.userId);

    const start = Math.max(0, Math.floor(data.clipStartSec ?? 0));
    let end = Math.max(start, Math.floor(data.clipEndSec ?? start));
    if (data.mediaType !== "text") {
      if (end - start > 90) end = start + 90;
      if (end === start) end = start + Math.min(90, 30);
    }

    const id = randomId("ann");
    const baseSlug =
      slugify(data.sourceTitle || data.commentaryText || "annotation") || "annotation";
    const slug = `${baseSlug}-${id.slice(-6)}`;
    const domain = domainFromUrl(data.sourceUrl);

    await sql`
      insert into annotations (
        id, slug, user_id, author_name, author_handle, author_image,
        media_type, source_url, source_title, source_domain, clip_text,
        clip_start_sec, clip_end_sec, video_quality, commentary_text,
        commentary_audio, clip_video_url, accent, like_count, comment_count
      ) values (
        ${id}, ${slug}, ${context.userId}, ${author.name}, ${author.handle}, ${author.image},
        ${data.mediaType}, ${data.sourceUrl}, ${data.sourceTitle}, ${domain},
        ${data.clipText ?? null}, ${start}, ${end}, ${"240p"},
        ${data.commentaryText.trim()}, ${data.commentaryAudio ?? null},
        ${data.clipVideoUrl ?? null},
        ${data.accent ?? "ink"}, ${0}, ${0}
      )
    `;

    const rows = await sql<AnnotationRow>`select * from annotations where id = ${id}`;
    return mapAnnotation(rows[0]!);
  });

export const addComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { annotationId: string; body: string }) => data)
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body) throw new Error("Comment cannot be empty");
    const sql = await getSql();
    const author = await authorFromUserId(context.userId);
    const id = randomId("cmt");

    await sql`
      insert into annotation_comments (
        id, annotation_id, user_id, author_name, author_handle, author_image, body
      ) values (
        ${id}, ${data.annotationId}, ${context.userId}, ${author.name}, ${author.handle},
        ${author.image}, ${body}
      )
    `;
    await sql`
      update annotations
      set comment_count = comment_count + 1
      where id = ${data.annotationId}
    `;

    return {
      id,
      annotationId: data.annotationId,
      userId: context.userId,
      authorName: author.name,
      authorHandle: author.handle,
      authorImage: author.image,
      body,
      createdAt: new Date().toISOString(),
    } satisfies Comment;
  });

export const toggleLike = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((annotationId: string) => annotationId)
  .handler(async ({ context, data: annotationId }) => {
    const sql = await getSql();
    const existing = await sql`
      select 1 from annotation_likes
      where annotation_id = ${annotationId} and user_id = ${context.userId}
      limit 1
    `;
    if (existing.length) {
      await sql`
        delete from annotation_likes
        where annotation_id = ${annotationId} and user_id = ${context.userId}
      `;
      await sql`
        update annotations set like_count = greatest(like_count - 1, 0)
        where id = ${annotationId}
      `;
      return { liked: false };
    }
    await sql`
      insert into annotation_likes (annotation_id, user_id)
      values (${annotationId}, ${context.userId})
      on conflict do nothing
    `;
    await sql`
      update annotations set like_count = like_count + 1
      where id = ${annotationId}
    `;
    return { liked: true };
  });

export const toggleFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((followingId: string) => followingId)
  .handler(async ({ context, data: followingId }) => {
    if (followingId === context.userId) return { following: false };
    const sql = await getSql();
    const existing = await sql`
      select 1 from follows
      where follower_id = ${context.userId} and following_id = ${followingId}
      limit 1
    `;
    if (existing.length) {
      await sql`
        delete from follows
        where follower_id = ${context.userId} and following_id = ${followingId}
      `;
      return { following: false };
    }
    await sql`
      insert into follows (follower_id, following_id)
      values (${context.userId}, ${followingId})
      on conflict do nothing
    `;
    return { following: true };
  });

export const fileClaim = createServerFn({ method: "POST" })
  .validator(
    (data: {
      annotationId: string;
      claimantName: string;
      claimantEmail: string;
      reason: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const name = data.claimantName.trim();
    const email = data.claimantEmail.trim();
    const reason = data.reason.trim();
    if (!name || !email || !reason) throw new Error("All claim fields are required");
    const sql = await getSql();
    const id = randomId("claim");
    await sql`
      insert into claims (id, annotation_id, claimant_name, claimant_email, reason)
      values (${id}, ${data.annotationId}, ${name}, ${email}, ${reason})
    `;
    return { id, status: "open" as const };
  });

export const getProfile = createServerFn({ method: "GET" })
  .validator((data: { handle: string; viewerId?: string | null }) => data)
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<{
      user_id: string;
      author_name: string;
      author_handle: string;
      author_image: string | null;
      c: number;
    }>`
      select user_id, author_name, author_handle, author_image, count(*)::int as c
      from annotations
      where author_handle = ${data.handle}
      group by user_id, author_name, author_handle, author_image
      limit 1
    `;
    if (!rows[0]) return null;
    const userId = rows[0].user_id;
    const followers = await sql<{ c: number }>`
      select count(*)::int as c from follows where following_id = ${userId}
    `;
    const following = await sql<{ c: number }>`
      select count(*)::int as c from follows where follower_id = ${userId}
    `;
    let isFollowing = false;
    if (data.viewerId) {
      const f = await sql`
        select 1 from follows
        where follower_id = ${data.viewerId} and following_id = ${userId}
        limit 1
      `;
      isFollowing = f.length > 0;
    }
    const profile: Profile = {
      userId,
      name: rows[0].author_name,
      handle: rows[0].author_handle,
      image: rows[0].author_image,
      annotationCount: Number(rows[0].c),
      followerCount: Number(followers[0]?.c ?? 0),
      followingCount: Number(following[0]?.c ?? 0),
      isFollowing,
    };
    const annotations = await sql<AnnotationRow>`
      select * from annotations
      where author_handle = ${data.handle}
      order by created_at desc
    `;
    return {
      profile,
      annotations: annotations.map((r) => mapAnnotation(r)),
    };
  });
