create extension if not exists pgcrypto;

-- You're a customer the moment you walk into a shop. Similarly, you're a
-- customer the moment you sign in to our website. Seven Stripes is not a drug
-- dealer; we don't have "users". We have customers, and hopefully, some of
-- those customers will become paying customers.
create table "customers" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "verified_email" text unique,
  "unverified_email" text not null,

  -- If someone doesn't want to provide their real name to us, that's their
  -- perogative. Similarly, it can be the case that a customer is an entire
  -- organization. Either way, it makes more sense for this to be
  -- "contact_name" than "name".
  "contact_name" text,

  "firebase_uid" text unique not null,
  "stripe_customer_id" text,

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);

-- User agent strings are normalized into a separate table because they're
-- huge and repetitive.
create table "user_agents" (
  "id" uuid primary key DEFAULT gen_random_uuid(),
  "user_agent" text not null unique,
  "last_logged_in_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);

create table "firebase_tokens" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  -- We use the combination of these two as a key to identify an individual
  -- firebase login token.
  "customer_id" uuid not null REFERENCES customers ON DELETE cascade,
  "auth_time" timestamptz not null,

  -- Either customer_id and auth_time are both specified, or neither are.
  check (
    (customer_id is null and auth_time is null) OR
    (customer_id is not null and auth_time is not null)
  ),

  unique ("customer_id", "auth_time"),

  -- Once a token has been revoked, a customer can no longer create new sessions
  -- associated with this token.
  "revoked" boolean not null DEFAULT false,
  -- This unique constraint supports the foreign key on the sessions table,
  -- which together with the unique constraint on customer_id/auth_time,
  -- ensures that an unrevoked session cannot be created on a revoked token,
  -- and that revoking a token cascades all associated session to revoked too.
  unique ("id", "revoked"),

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP,
  "last_logged_in_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);

-- A row should be inserted each time the customer opens a new instance of the
-- app, or an existing instance of the app changes its logged in customer.
create table "sessions" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  -- Each login returns a unique token, which the clients will need to store
  -- in memory and then supply on future requests.
  "token" text unique not null,

  "customer_id" uuid REFERENCES customers ON DELETE cascade,

  -- Once a session has been revoked, a customer can no longer make any changes
  -- from this session.
  "firebase_token_id" uuid,
  "revoked" boolean not null DEFAULT false,
  foreign key ("firebase_token_id", "revoked")
    REFERENCES firebase_tokens ("id", "revoked")
    MATCH SIMPLE
    ON UPDATE cascade
    ON DELETE cascade,

  -- The agent id can be set to anything; it's generate in a server-side
  -- cookie. This will typically change between browsers.
  "browser_or_device_id" uuid not null,
  "ip_address" inet not null,
  "user_agent_id" uuid not null REFERENCES user_agents ON DELETE restrict,

  "url" text, -- the paged where the login occurred, as specified by http referer

  -- The client can supply anything here. Keep in mind that as logins records
  -- can be anonymous, a null customer_id doesn't necessarily mean that a
  -- referral isn't associated with a customer – we'll also need to check for
  -- future login records with the same agent_id to know whether an anonymous
  -- referral stays anonymous.
  "referrer_code" text,
  "referrer_source" text, -- a url where they came from

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
create index "sessions_by_browser_or_device_idx" on "sessions" (browser_or_device_id);
create index "sessions_by_customer_idx" on "sessions" (customer_id) where (customer_id is not null);
create index "sessions_by_referrer_code_idx" on "sessions" (referrer_code);
create index "sessions_by_firebase_token_idx" on "sessions" (firebase_token_id) where (firebase_token_id is not null);
-- This index should allow authentication queries without needing to look in
-- the table itself, as it contains all data required for an auth lookup.
create index "sessions_by_unrevoked_token_and_customer_idx" on "sessions" (token, customer_id) where (revoked is false);
