create extension if not exists pgcrypto;

create table "profiles" (
  "id" uuid not null primary key DEFAULT gen_random_uuid(),

  "handle" text unique,

  "display_name" text not null,
  "avatar_url" text,

  "created_at" timestamp not null DEFAULT CURRENT_TIMESTAMP
);

create table "members" (
  "id" uuid primary key DEFAULT gen_random_uuid(),

  "firebase_uid" text not null unique,

  "profile_id" uuid unique references profiles ON DELETE set null,

  "created_at" timestamp not null DEFAULT CURRENT_TIMESTAMP
);
