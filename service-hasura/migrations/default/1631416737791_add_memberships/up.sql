-- We sell memberships, not subscriptions. If someone is paying into our
-- product, that means that they're also creating content for us. Our paying
-- customers are not just customers – they're members of our team.
create table "membership_levels" (
  value text PRIMARY KEY
);
insert into "membership_levels" (value) VALUES
  ('basic'),
  ('supporter'),
  ('patron');
create table "memberships" (
  "id" uuid primary key references customers ON DELETE restrict,

  "level" text not null references membership_levels ON DELETE restrict,

  -- Switch on, and we guarantee it'll never be automatically switched off –
  -- so neither will "active".
  "lifetime" boolean not null DEFAULT false,
  check (
    (lifetime is false and active_until is not null) or
    (lifetime is true and active_until is null)
  ),

  -- Updated when the subscription is renewed, unless this is a lifetime
  -- subscripiton, in which case this will be null.
  "active_until" timestamptz,
  -- As the member consistently publishes public content, we'll allow them to
  -- keep all their membership privileges except for posting new content for a
  -- "sabbatical" period.
  -- This must be regularly updated, either by a cron job, as part of the
  -- action that publishes public posts, or when the subscription is renewed.
  -- If the customer has no sabbatical due to not having any content or due to
  -- having a lifetime membership, then this will be null.
  "sabbatical_available_until" timestamptz,

  -- nullable, as the real world throws situations at us where a member
  -- really shouldn't need to pay us money.
  "stripe_subscription_id" text unique,
  "stripe_subscription_status" text,

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);
