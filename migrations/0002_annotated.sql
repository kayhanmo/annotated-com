-- Annotated.com product schema
create table if not exists annotations (
  id              text primary key,
  slug            text not null unique,
  user_id         text not null,
  author_name     text not null,
  author_handle   text not null,
  author_image    text,
  media_type      text not null check (media_type in ('text', 'video', 'audio')),
  source_url      text not null,
  source_title    text not null,
  source_domain   text not null,
  clip_text       text,
  clip_start_sec  integer not null default 0,
  clip_end_sec    integer not null default 0,
  video_quality   text not null default '240p',
  commentary_text text not null default '',
  commentary_audio text,
  accent          text not null default 'ink',
  like_count      integer not null default 0,
  comment_count   integer not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists annotations_created_at_idx on annotations (created_at desc);
create index if not exists annotations_user_id_idx on annotations (user_id);
create index if not exists annotations_author_handle_idx on annotations (author_handle);

create table if not exists annotation_comments (
  id              text primary key,
  annotation_id   text not null references annotations(id) on delete cascade,
  user_id         text not null,
  author_name     text not null,
  author_handle   text not null,
  author_image    text,
  body            text not null,
  created_at      timestamptz not null default now()
);
create index if not exists annotation_comments_ann_idx on annotation_comments (annotation_id, created_at);

create table if not exists follows (
  follower_id   text not null,
  following_id  text not null,
  created_at    timestamptz not null default now(),
  primary key (follower_id, following_id)
);
create index if not exists follows_following_idx on follows (following_id);

create table if not exists claims (
  id              text primary key,
  annotation_id   text not null references annotations(id) on delete cascade,
  claimant_name   text not null,
  claimant_email  text not null,
  reason          text not null,
  status          text not null default 'open',
  created_at      timestamptz not null default now()
);
create index if not exists claims_annotation_idx on claims (annotation_id);

create table if not exists annotation_likes (
  annotation_id text not null references annotations(id) on delete cascade,
  user_id       text not null,
  created_at    timestamptz not null default now(),
  primary key (annotation_id, user_id)
);
