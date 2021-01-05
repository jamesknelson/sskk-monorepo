create table "posts" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "profile_id" uuid not null REFERENCES profiles ON DELETE cascade,

  -- These comprise a "match full" foreign key which is added later.
  "latest_version_id" uuid,
  "latest_version_locked_for_publication" boolean,
  "latest_version_slug" text,

  "ranking" integer,

  "created_at" timestamp not null DEFAULT CURRENT_TIMESTAMP,

  -- Once published_at is set, it can't be changed -- and can only be set
  -- to a value in the future. To remove the post, you must delete it.
  "published_at" timestamp,

  "deleted_at" timestamp,

  check (
    published_at is null OR (
      (
        -- Everybody needs to pick one of the same 3 publication times, as this
        -- ensures that assuming a typical 8-hour workday, there'll be no more
        -- than one daily interruption in any given timezone.
        published_at::time = time '00:00' OR
        published_at::time = time '08:00' OR
        published_at::time = time '16:00'
      ) AND (
        -- Ensure that once a post is marked as published, we'll always have a
        -- version available for display, and it'll never accidentally be a
        -- draft.
        latest_version_locked_for_publication is true
      )
    )
  )
);

-- Prevents members from publishing more than one post on a given day.
create unique index posts_by_profile_and_date_idx
  ON posts ("profile_id", (date(published_at)) DESC)
  WHERE (published_at IS NOT NULL);

-- Ensures that all published posts are accessible via at least one slug.
create unique index posts_by_profile_and_slug_idx
  ON posts ("profile_id", "latest_version_slug")
  WHERE (published_at IS NOT NULL AND deleted_at IS NULL);

create index posts_by_date_and_ranking_idx
  ON posts ("published_at" DESC, "ranking" DESC)
  WHERE (published_at IS NOT NULL AND deleted_at IS NULL);

create index posts_by_profile_idx
  ON posts ("profile_id" DESC, "published_at" DESC NULLS FIRST);

create table "post_versions" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),
  "post_id" uuid not null REFERENCES posts ON DELETE cascade,

  "slug" text not null,
  "title" text not null,

  "editor_state" json,
  "content" json,

  "locked_for_publication" boolean not null DEFAULT false,

  "created_at" timestamp not null DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp not null DEFAULT CURRENT_TIMESTAMP,

  check (locked_for_publication is false OR content is not null)
);

-- Ensures we have at most one draft version.
create unique index post_versions_single_draft
  ON post_versions (post_id, locked_for_publication)
  WHERE ("locked_for_publication" is false);

-- Useful for finding posts by previous slugs.
create index post_versions_by_slug_and_date_idx
  ON post_versions ("slug", "updated_at" DESC)
  WHERE ("locked_for_publication" is true);

create index post_versions_idx
  ON post_versions ("post_id", "updated_at" DESC);

-- Necessary to create a foreign key constraint from posts to the latest
-- versions.
create unique index post_version_slugs
  ON post_versions ("id", "locked_for_publication", "slug");

alter table posts
  ADD CONSTRAINT latest_version_fk
  FOREIGN KEY (latest_version_id, latest_version_locked_for_publication, latest_version_slug)
  REFERENCES post_versions (id, locked_for_publication, slug)
  MATCH FULL
  ON UPDATE CASCADE;
