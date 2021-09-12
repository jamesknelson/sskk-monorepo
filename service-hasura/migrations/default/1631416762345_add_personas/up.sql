
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
