-- Run once in Supabase: SQL Editor → New query → Run
create table if not exists public.players (
  phone text primary key,
  session_id uuid not null unique,
  first_name text not null,
  last_name text not null,
  city text not null,
  attempts_used int not null default 0,
  attempts_left int not null default 3,
  best_distance_km int not null default 0,
  best_discount int not null default 0,
  promo_code text,
  character text,
  status text not null default 'left_contacts',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists players_session_id_idx on public.players (session_id);
