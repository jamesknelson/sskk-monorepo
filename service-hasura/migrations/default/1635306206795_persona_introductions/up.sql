create or replace function is_valid_url_slug(url_slug text)
returns boolean LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  select (
    (url_slug ~ '^[a-zA-Z0-9-]+$') and
    -- Why max 80 characters? a quick google seems to suggest that's about
    -- the limit of many other services. I'm honestly not sure the reasoning
    -- behind it though. We can always change it later.
    length(url_slug) <= 80
  );
$$;

create or replace function is_valid_publication_time(publication_time time)
returns boolean LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  select (
    "publication_time" = time '00:00' OR
    "publication_time" = time '12:00'
  );
$$;

create table "customer_onboardings" (
  "id" uuid not null primary key references customers ON DELETE cascade,

  -- If true, we won't redirect the user to the onboarding flow on login –
  -- allowing them to read, without joining with a persona account.
  "skip_onboarding_redirect_on_login" boolean,

  "address_type" text references address_types ON DELETE set null,
  "address_handle" text,

  "persona_name" text,
  "persona_photo_url" text,

  "introduction_letter_editor_state" json,
  "introduction_letter_extra_recipients" json,

  "introduction_letter_url_slug" text,
  check (is_valid_url_slug(introduction_letter_url_slug)),

  -- The date can be null for early drafts, but a final draft requires a value
  -- so that approvals will validate. The possibility of null dates is intended
  -- to help single contributors create letters that are posted in the next
  -- available slot. A non-null date requires a time as well.
  "introduction_letter_date" date,
  "introduction_letter_time" time,
  check (
    "introduction_letter_time" is null OR
    is_valid_publication_time(introduction_letter_time)
  ),

  "updated_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);