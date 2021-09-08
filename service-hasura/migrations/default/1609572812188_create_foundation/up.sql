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
  "contact_name" text not null,

  "firebase_uid" text unique not null,
  "stripe_customer_id" text,

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);

-- User agent strings are normalized into a separate table because they're
-- huge and repetitive.
create table "user_agents" (
  "id" uuid primary key DEFAULT gen_random_uuid(),
  "user_agent" text not null unique
);

-- TODO

-- create a "firebase_tokens" table w/ the custid/auth_time as a unique key,
-- w/ a "revoked_at" line and an id which we can use to reference it in "logins"

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

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP,

  -- Once a login has been revoked, a customer can no longer make any changes
  -- from this login.
  "revoked_at" timestamptz
);

-- A row should be inserted each time the customer opens a new instance of the
-- app, or an existing instance of the app changes its logged in customer.
create table "logins" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "firebase_token_id" uuid REFERENCES firebase_tokens ON DELETE set null,

  -- The agent id can be set to anything; it's generate in a server-side
  -- cookie.
  "agent_id" uuid not null,
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
create index "logins_by_referrer_code_idx" on logins ("referrer_code");
create index "logins_by_agent_idx" on logins ("agent_id");

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
  -- If the user has no sabbatical due to not having any content or due to
  -- having a lifetime membership, then this will be null.
  "sabbatical_available_until" timestamptz,

  -- nullable, as the real world throws situations at us where a member
  -- really shouldn't need to pay us money.
  "stripe_subscription_id" text unique,
  "stripe_subscription_status" text,

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

create table "personas" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),

  "name" text not null,
  "photo_url" text,

  "customer_id" uuid not null references customers ON DELETE restrict,

  -- Specify whether you want people to be able to see your highest priority
  -- address in your byline badge. If not, people won't have a way to reply to
  -- you.
  "list_address_with_byline" boolean not null DEFAULT true,

  "preferred_broadcast_time" time not null,
  check (
    preferred_broadcast_time = time '00:00' OR
    preferred_broadcast_time = time '12:00'
  ),

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);
create index persona_customer_idx on personas (customer_id);

-- A list of personas that have been added to other customers' reading lists.
-- This data, and its aggregates, is private to everyone except the reader.
-- To be clear, this means that customers don't know how many other customers
-- are reading them – and that's a feature not a bug. It gives readers a reason
-- to reach out to writers and say they appreciate their work, and the client
-- should give customers an option to do this when they subscribe.
create table "readers" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "customer_id" uuid not null references customers ON DELETE cascade,
  "persona_id" uuid not null references personas ON DELETE cascade,
  unique ("customer_id", "persona_id"),

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
create index reader_persona_id on readers (persona_id);

-- An address is a unique identifier that you can pass to someone else to
-- allow them to reach you. If you have someone's address, you can send to
-- that address.
--
-- People can filter their inbox so that they don't see everything sent to them.
-- By default, they won't see anything sent to @thepublic (even though they're
-- part of this list). They can add a persona to their reading list to allow
-- things they've received from them to be seen.
--
-- There are also some reserved and special addresses, where there is no single
-- associated persona, but the address means something in relation to the
-- persona who sent the letter. E.g. @myself, @myreaders, etc.
--
-- Eventually, groups will also be able to be assigned addresses, so that
-- anybody who joins that group will receive all letters sent to that group's
-- address. However, these letters will not immediately become public on the
-- groups' page. We'll allow for private groups where the address is not
-- published, and where people require permission to send to the group. We'll
-- also allow group members to filter their inbox so they only receive messages
-- from other group members, even though anyone can post to it.
--
-- The key distinction to keep in mind is that addresses are somewhere you send
-- things *to*, whereas letters come *from* a persona. The persona may publish
-- a return address, or may not – it's up to them.
create table "address_types" (
  value text PRIMARY KEY
);
insert into "address_types" (value) VALUES
  ('email'),
  -- You cannot access a guest persona through a member address, even though a
  -- member address *may* persist after the persona reverts to a guest.
  -- You cannot create a member address unless it is associated with a member
  -- persona.
  ('guest'),
  ('member'),
  ('myself'),
    -- only allowed for single-contributor letters
  ('nobody'),
  ('quoted-participants'),
    -- addressees, contributors and signatories of all linked letters, along
    -- with the recursive participants of those quoted or linked letters, but
    -- excluding anyone who has recorded a mute against any letter along the
    -- link chain. automatically added as a bcc when addressing the public.
  ('quoted-contributors-and-signatories'),
    -- addresses just the addressees of the quoted letters
  ('quoted-addressees'),
    -- addresses just the addressees of the quoted letters
  ('persona-readers'),
    -- addresses the readers of personas on the letter's contributor list
  ('public'),
    -- address *everyone*
  ('reserved'),
    -- for reserving handles that should not be available to
    -- customers, despite having no meaning to the system
  ('the-editor'),
    -- this may be removed at some point in favor of an actual
    -- editor account, but for now, it can be automated.
  ('url-holders');
    -- allow access to anyone who has a URL for the letter;
create table "addresses" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),

  "type" text references address_types ON DELETE restrict,

  -- Once an address has been released, it's type will go `null` in order to
  -- remove the address from the uniqueness constraint. However, the address
  -- will remain in the table so that letters previously addressed here retain
  -- complete metadata.
  "handle" text not null unique,
  check (
    case
      when "type" = 'email' then
        -- need to find a better way to handle this
        handle ~ '\\w@\\w'
      when "type" = 'guest' then
        (handle ~ '^[a-zA-Z0-9_]+$')
          and persona_id is not null
          and length(handle) >= 10
          and length(handle) < 16
          -- starts with a number
          and (handle ~ '^[0-9]{1}[a-zA-Z0-9_]+$')
          -- contains at least 3 numbers
          and array_length(regexp_split_to_array(handle, E'[0-9]'), 1) > 3
      when "type" = 'member' then
        (handle ~ '^[a-zA-Z0-9_]+$')
          and persona_id is not null
          and length(handle) >= 1
          and length(handle) < 16
      else
        persona_id is null
          or (handle ~ '^[a-zA-Z0-9_]+$') and "type" is null
    end
  ),
  
  -- A null persona is available for some types that have a special meaning
  -- relative to the person who used it, e.g. "my subscribers", "my readers",
  -- etc. For email addresses, a null persona indicates that nobody has verified
  -- ownership of that email yet.
  "persona_id" uuid references personas ON DELETE cascade,

  -- If false, you'll be able to confirm that this address exists, but you won't
  -- receive any information on who it may be linked to.
  "discovers_linked_persona" boolean not null DEFAULT false,

  -- If false, you'll be able to send to this address, but it won't appear in
  -- search results.
  "listed_in_search" boolean not null DEFAULT false,

  -- When a search produces multiple addresses with the same persona_id (or type
  -- if the persona_id is null), then one address with the highest listing
  -- priority will be recommended.
  "listing_priority" smallint not null DEFAULT 1,

  -- Set after an address should no longer be reserved for this persona, e.g.
  -- after they've stopped paying dues, used any sabbatical period, and then
  -- exceeded a grace period.
  -- It's important to disable addreses this way instead of deleting them from
  -- the database so that any letters to the address keep retain their
  -- information.
  "released_at" timestamptz,
  check ("released_at" is null or "type" is null),

  -- A persona can have at most one of each type of username. Emails don't
  -- count as usernames.
  "username_flag" boolean,
  check (username_flag is true or username_flag is null),
  unique ("persona_id", "type", "username_flag"),

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
-- This is to allow for a foreign key ensuring the type matches, as used in
-- the deliveries table.
create index address_id_type_fk_idx on addresses (id, type);

create table "letters" (
  "id" uuid primary key DEFAULT gen_random_uuid(),
  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);

-- Once all approval_required contributors for a letter have approved a draft,
-- and all signature_required contributors have also signed that draft, and a
-- finalized locked draft has been set, then so long as any specified
-- delivery time has not been passed, a record should be created containing
-- the letter content.
create table "sent_letters" (
  "id" uuid primary key REFERENCES letters ON DELETE cascade,

  -- Allows anybody to sign your letter, and become party to any further
  -- correspondence. Defaults to false, because anyone who signs this will be
  -- given the same weight visually as signing contributors. The only way to
  -- distinguish the contributors is that they'll positioned earlier than the
  -- signatories. Anb desides, we really don't  want to create a situation where
  -- people mash a hypothetical "sign" button in a similar way to "like"
  -- buttons.
  "allow_public_to_sign" boolean not null,

  -- Indicates that any signatures must reserve a broadcast slot to be used for
  -- a public address.
  "reserve_broadcast_slot" boolean not null,

  -- For the fk enforcing signature consistency
  unique (
    "id",
    "allow_public_to_sign",
    "reserve_broadcast_slot"
  ),

  -- Indicates that this letter is a revision to a previously sent letter,
  -- and thus automatically includes all destinations of the previous letter. If
  -- any of the original letter's contributors sign the revised letter, the
  -- revised letter will link to this one. If *all* signing contributors of the
  -- original letter sign the new letter, then instead it will replace the
  -- original letter, and will provide a link to the original.
  "revises_letter_id" uuid REFERENCES sent_letters ON DELETE cascade,

  -- Points to the lead-positioned contributor. We need this so that we're able
  -- to add a scoped constraint on url slug uniqueness.
  "lead_persona_id" uuid not null REFERENCES personas ON DELETE cascade,

  "url_slug" text,
  unique ("lead_persona_id", "url_slug"),

  -- An editor_state meant for read-only display, stripped of selection and
  -- other sensitive information, but retaining formatting. Important parts
  -- of the content are denormalized and copied out into separate fields so
  -- that they can be queried separately.
  "content" json not null,

  -- A text version of the content.
  "content_text" text not null,

  -- Content vector, for full-text search support.
  "content_tsv" tsvector not null,

  -- Can contains any title, specified as-is.
  "content_title" text,

  -- A short description of the content, not necessarily taken from
  -- the content itself. Used for SEO descriptions and in lists.
  "content_blurb" text,

  -- A short extract contained in the content, for use when the
  -- contributors don't want to place the full letter directly in index pages.
  "content_extract" text,

  -- A deleted letter is treated as instantly gone, no matter what time of day
  -- it is deleted. This is only meant for use by moderators - not the customers
  -- themselves. For customers, a retraction or revision is more appropriate.
  "deleted_at" timestamptz,
  
  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
create index sent_letter_revisions_idx on sent_letters (revises_letter_id);
create index sent_letter_content_tsv_idx ON sent_letters USING GIN (content_tsv);

-- Records relations between sent letters that quote or link to each
-- other, so that we're able to easily find all replies and forwards of a
-- letter, and also so that we're able to fetch all quoted content in a single
-- query.
create table "links" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "linking_letter_id" uuid not null REFERENCES sent_letters ON DELETE cascade,
  "linked_letter_id" uuid not null REFERENCES sent_letters ON DELETE cascade,
  unique ("linking_letter_id", "linked_letter_id"),

  -- If true, indicates that a quote from the linked letter has been included
  -- in the content.
  "quoted" boolean not null
);
create index link_linked_letters_idx on links (linked_letter_id);

create table "recipients" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "letter_id" uuid not null REFERENCES sent_letters ON DELETE cascade,

  -- If an address or letter is deleted, we want to be able to retain the fact
  -- that the letter was sent to a deleted address, so we set address_id to null.
  -- This may be relative to the signatures with the same letter id.
  "address_id" uuid REFERENCES addresses ON DELETE set null,

  "name" text,

  -- If set to true, indicates that the persona is being copied in as a curtesy,
  -- but the letter is not directly addressed to them.
  "copy" boolean not null DEFAULT false,

  -- If set to false, the destination will received the letter, but this
  -- destination will not be visible to other recipients of the letter. Acts
  -- like a "bcc".
  "listed" boolean not null DEFAULT true,

  "position" smallint not null DEFAULT 0,
  unique ("letter_id", "position")
);
create index recipient_addresses_idx on recipients (address_id);

create table "drafts" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),

  "letter_id" uuid not null REFERENCES letters ON DELETE cascade,

  "revises_letter_id" uuid REFERENCES sent_letters ON DELETE cascade,

  "editor_state" json not null,

  -- This can be expanded out into a recipient row in a view, but the system
  -- will need to ensure that each of the recipient ids actually exist.
  "recipients" json not null,

  -- The system should enforce that this is true if one of the recipients is a
  -- "public" type. This allows for foreign keys on the "approvals" table
  -- ensuring that each contributors' approvals reserve broadcast slots if
  -- required.
  "reserve_broadcast_slot" boolean not null,

  "allow_public_to_sign" boolean not null DEFAULT false,

  "url_slug" text,
  check (
    (url_slug ~ '^[a-zA-Z0-9-]+$') and
    -- Why max 80 characters? a quick google seems to suggest that's about
    -- the limit of many other services. I'm honestly not sure the reasoning
    -- behind it though. We can always change it later.
    length(url_slug) <= 80
  ),

  -- The date can be null for early drafts, but a final draft requires a value
  -- so that approvals will validate. The possibility of null dates is intended
  -- to help single contributors create letters that are posted in the next
  -- available slot. A non-null date requires a time as well.
  "date" date,
  "time" time,
  check (
    "date" is null OR (
      "time" = time '00:00' OR
      "time" = time '12:00'
    )
  ),

  -- There can be at most *one* unlocked draft, which will be the draft that is
  -- updated and shared between collaborators. Only locked drafts can be
  -- approved and used for the finalized letter. Locked drafts cannot be
  -- unlocked, and can no longer be edited, but *can* be forked into new
  -- unlocked draft.
  "locked_flag" boolean,
  "working_draft_flag" boolean,
  check (
    working_draft_flag is true and locked_flag is null
      or (working_draft_flag is null and locked_flag is true)
  ),
  unique (letter_id, working_draft_flag),

  -- Only locked rows with a date can be approved, so we create a separate
  -- column that mirrors the id only approvable, which the fk on approvals
  -- can reference.
  "id_when_approvable" uuid,
  check (
    id_when_approvable is null or (
      id_when_approvable is not null
      and id_when_approvable = id
      and locked_flag is true
      and "date" is not null
    )
  ),
  unique (id_when_approvable, letter_id, "date", reserve_broadcast_slot),

  "created_or_updated_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
create index draft_revisions_idx on drafts (revises_letter_id);

create table "contributors" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),
  "letter_id" uuid not null REFERENCES letters ON DELETE cascade,
  "persona_id" uuid not null REFERENCES personas ON DELETE cascade,
  unique ("persona_id", "letter_id"),
  unique ("id", "persona_id", "letter_id"), -- for fk

  -- Allows customers to accept/reject contribution requests. Deleting the
  -- record allows further requests. Setting to `false` ignores future requests.
  -- TODO: this probably needs a more thorough approach, including the ability
  -- to invite people who aren't yet customers. But I don't think this would
  -- affect the rest of the database structure, so this is good enough for now.
  "rsvp" boolean,

  -- Indicates where the contributor will appear in the list of authors and/or
  -- signatures.
  "position" smallint not null DEFAULT 1,
  check (position >= 1),
  unique ("letter_id", "position"),

  -- If true, the system will not allow this letter to be posted without an
  -- approval from this contributor.
  "approval_required" boolean not null,

  -- The first contributor will always provide the url scope for a post if
  -- required, and a signature is required from the contributor if they do.
  -- All signatories will then link to that one canonical URL. It may not
  -- really be fair, but this is the best I could come up with, given that:
  -- * We can't put all contributors in the URL, as they may not fit.
  -- * We want a single canonical URL for SEO purposes, even if there are
  --   multiple leaders/contributors.
  -- * Removing the handle scope would require slugs to be unique globally,
  --   which would get tricky with growth.
  "provides_url_scope" boolean,
  check (
    provides_url_scope is null
    or (
      provides_url_scope is true
        and can_not_sign is false
        and position = 1
    )
  ),
  unique ("letter_id", "provides_url_scope"),

  -- Allows this contributor to invite/disinvite contributors, assign
  -- permissions, set whose signatures are required, and specify the order
  -- in which contributors are listed. Each letter must have at least one
  -- administrator.
  "can_administrate" boolean not null DEFAULT false,

  "can_send" boolean not null DEFAULT false,
  "can_draft" boolean not null DEFAULT false,

  -- This is negated to allow a foreign key against approvals, checking that
  -- an non-signing approval is valid.
  "can_not_sign" boolean not null DEFAULT false,
  unique ("persona_id", "letter_id", "can_not_sign") -- for fk
);

-- Each persona only gets a single broadcast slot per day, which they're able
-- to use to sign something addressed to everyone.
create table "broadcast_slots" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "persona_id" uuid not null REFERENCES personas ON DELETE cascade,
  "letter_id" uuid not null REFERENCES letters ON DELETE cascade,
  -- Note: there's no foreign key between slots/contributors, as letters may
  -- open signatures to the public.

  "date" date not null,
  unique ("persona_id", "date")
);
-- The other side of the fk on "approvals", that together with a fk to the
-- drafts table, ensures that if a draft has approval records for
-- each of the letters contributors, its safe to post even as a broadcast.
create unique index broadcast_slots_idx on broadcast_slots (id, letter_id, persona_id, "date");

-- Indicates that a contributor to a letter has approved publication of a
-- specific draft. The foreign keys on this table should ensure that customers
-- cannot approve a public draft that they intend to sign unless they've
-- reserved a broadcast slot for it, that contributors requiring a signature
-- have provided that signature, and that approvals are removed if a persona
-- is removed as a contributor, or if a personal decides to post something else
-- in a broadcast slot.
create table "approvals" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),

  "approvable_draft_id" uuid not null,
  "letter_id" uuid not null,
  "date" date not null,
  "reserve_broadcast_slot" boolean not null,
  foreign key (approvable_draft_id, letter_id, "date", reserve_broadcast_slot)
    REFERENCES drafts (id_when_approvable, letter_id, "date", reserve_broadcast_slot)
    MATCH FULL
    ON DELETE CASCADE,

  -- If true, the approver will *not* have their signature added to the final
  -- letter upon send.
  "will_not_sign_flag" boolean,
  check (will_not_sign_flag is true or will_not_sign_flag is null),

  -- We need two contributor fks to simulate "match partial" - one "match full"
  -- to ensure that the approval is removed if the contributor is removed, and
  -- another "match simple" to ensure that the customer has approved a signature
  -- if that is required.
  "persona_id" uuid not null,
  unique ("approvable_draft_id", "persona_id"),
  foreign key (persona_id, letter_id)
    REFERENCES contributors (persona_id, letter_id)
    MATCH FULL
    ON DELETE CASCADE,
  foreign key (persona_id, letter_id, will_not_sign_flag)
    REFERENCES contributors (persona_id, letter_id, can_not_sign)
    MATCH SIMPLE,

  -- If we're approving a public post, ensure that the persona has reserved
  -- the correct broadcast slot, so that they won't be posting publicly twice
  -- in one day. If the slot is removed, then remove the approval record.
  "broadcast_slot_id" uuid REFERENCES broadcast_slots ON DELETE cascade,
  check (reserve_broadcast_slot is false or will_not_sign_flag is true or broadcast_slot_id is not null),
  foreign key (broadcast_slot_id, letter_id, persona_id, "date")
    REFERENCES broadcast_slots (id, letter_id, persona_id, "date")
    MATCH SIMPLE
    ON DELETE CASCADE,

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
create index approval_broadcast_slots_idx on approvals (broadcast_slot_id);

-- Someone approving a draft has to also approve any signatures that *may* come
-- before their own. This mirrors real life - when signing a letter, a
-- signatory can see whose signatures came before, but without being a leader,
-- cannot control who else signs the letter after them.
create table "approval_allowed_prior_signatures" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),

  "approval_id" uuid not null REFERENCES approvals ON DELETE cascade,
  "persona_id" uuid not null REFERENCES personas ON DELETE cascade,
  unique ("approval_id", "persona_id"),

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);

-- This table has less constraints than some other tables, as signatures are
-- only ever created by the system itself.
create table "signatures" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "letter_id" uuid not null,
  "allow_public_to_sign" boolean not null,
  "reserve_broadcast_slot" boolean not null,
  foreign key (letter_id, allow_public_to_sign, reserve_broadcast_slot)
    REFERENCES sent_letters (id, allow_public_to_sign, reserve_broadcast_slot)
    MATCH FULL
    ON DELETE CASCADE,
  
  "persona_id" uuid not null REFERENCES personas ON DELETE cascade,

  "contributor_id" uuid,
  foreign key (contributor_id, persona_id, letter_id)
    REFERENCES contributors (id, persona_id, letter_id)
    MATCH SIMPLE
    ON DELETE CASCADE,
  
  -- Ensure the persona is allowed to sign this letter.
  check (
    allow_public_to_sign is true
      OR contributor_id is not null
  ),

  "date" date not null,
  "time" time not null,
  check (
    "time" = time '00:00' OR
    "time" = time '12:00'
  ),

  -- If the letter requires a broadcast slot, adding it here will cause the
  -- foreign key to restrict that slot from being used elsewhere.
  "broadcast_slot_id" uuid REFERENCES broadcast_slots ON DELETE restrict ON UPDATE restrict,
  foreign key (broadcast_slot_id, letter_id, persona_id, "date")
    REFERENCES broadcast_slots (id, letter_id, persona_id, "date")
    MATCH SIMPLE
    ON DELETE CASCADE,

  -- Check that there's a broadcast slot reserved for the signature if required.
  check (
    broadcast_slot_id is not null
      OR reserve_broadcast_slot is false
  ),

  -- Retractions must be accompanied by a letter explaining the retraction.
  -- This way, in the client, the signature can be visually crossed out on
  -- when displayed in copies of the letter associated with someone who hasn't
  -- retracted it, while on the page of the persona who retracted the letter,
  -- a retraction can be displayed in place of it.
  "retracted_by_signature_id" uuid REFERENCES signatures ON DELETE set null
);
create index signature_letters_idx on signatures (letter_id);

-- Allows a customer do mute corresponce regarding a letter they're linked with.
create table "flag_types" (
  value text PRIMARY KEY
);
insert into "flag_types" (value) VALUES
  ('mute'),
  ('read'),
  ('starred');
create table "flags" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "type" text not null REFERENCES flag_types ON DELETE restrict,

  "letter_id" uuid not null REFERENCES sent_letters ON DELETE cascade,
  "customer_id" uuid not null REFERENCES customers ON DELETE cascade,
  unique ("customer_id", "letter_id", "type"),

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
create index flags_letter_idx on flags (letter_id);

create table "disposal_reasons" (
  value text PRIMARY KEY
);
insert into "disposal_reasons" (value) VALUES
  ('spam');
create table "disposals" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "reason" text REFERENCES disposal_reasons ON DELETE restrict,

  "letter_id" uuid not null REFERENCES sent_letters ON DELETE cascade,
  "customer_id" uuid not null REFERENCES customers ON DELETE cascade,
  unique ("letter_id", "customer_id"),

  -- Once this date is reached, the disposal will be hidden from the customer,
  -- and they'll no longer be able to undo it.
  "seal_at" timestamptz not null,

  "created_at" timestamptz not null DEFAULT CURRENT_TIMESTAMP
);
create index disposal_customers_idx on disposals (customer_id);
