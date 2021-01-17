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

  "slug" text,
  "title" text,

  "editor_state" json,
  "content" json,

  "locked_for_publication" boolean not null DEFAULT false,

  -- TODO: once hasura supports upsert on partial unique indexes, remove this
  -- and instead create an index on locked_for_publication.
  "is_draft" boolean DEFAULT true,

  "created_at" timestamp not null DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp not null DEFAULT CURRENT_TIMESTAMP,

  check (locked_for_publication is false OR content is not null),

  -- Force is_draft to null or true, so that we can enforce that there's max
  -- one draft using a uniqueness constraint, enabling draft upsert in hasura.
  check (
    (is_draft is true and locked_for_publication is false) OR
    (is_draft is null OR locked_for_publication is true)
  ),

  constraint post_versions_locked_for_publication UNIQUE (post_id, is_draft)
);

-- -- Ensures we have at most one draft version.
-- create unique index post_versions_single_draft
--   ON post_versions (post_id, locked_for_publication)
--   WHERE ("locked_for_publication" is false);

-- Useful for finding posts by previous slugs.
create index post_versions_by_slug_and_date_idx
  ON post_versions ("slug", "updated_at" DESC)
  WHERE ("slug" IS NOT NULL AND "locked_for_publication" is true);

create index post_versions_idx
  ON post_versions ("post_id", "updated_at" DESC);

-- Necessary to create a foreign key constraint from posts to the latest
-- versions.
create unique index post_version_fk_index_1
  ON post_versions ("id", "locked_for_publication");
create unique index post_version_fk_index_2
  ON post_versions ("id", "locked_for_publication", "slug");

alter table posts
  ADD CONSTRAINT latest_version_fk_1
  FOREIGN KEY (latest_version_id, latest_version_locked_for_publication)
  REFERENCES post_versions (id, locked_for_publication)
  MATCH FULL
  ON UPDATE CASCADE;

alter table posts
  ADD CONSTRAINT latest_version_fk_2
  FOREIGN KEY (latest_version_id, latest_version_locked_for_publication, latest_version_slug)
  REFERENCES post_versions (id, locked_for_publication, slug)
  ON UPDATE CASCADE;

---

CREATE FUNCTION trigger_set_post_version_is_draft()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_draft = CASE WHEN NEW.locked_for_publication = true THEN null ELSE true END;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_post_version_is_draft
  BEFORE INSERT OR UPDATE ON post_versions
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_post_version_is_draft();