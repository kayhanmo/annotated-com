-- Direct playable clip asset (mp4) when available, separate from source attribution URL
alter table annotations add column if not exists clip_video_url text;
