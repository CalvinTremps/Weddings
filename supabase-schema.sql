-- Run this in your Supabase SQL editor to set up the database

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  code text unique not null,
  created_at timestamptz default now()
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references guests(id) on delete cascade unique,
  attending boolean not null,
  plus_one_name text,
  dietary_restrictions text,
  song_request text,
  message text,
  submitted_at timestamptz default now()
);

-- Enable Row Level Security
alter table guests enable row level security;
alter table rsvps enable row level security;

-- Guests: anyone can look up by code (needed for code entry page)
create policy "guests_read_by_code" on guests
  for select using (true);

-- RSVPs: anyone can insert/update (guest authenticated by code in app logic)
create policy "rsvps_insert" on rsvps
  for insert with check (true);

create policy "rsvps_update" on rsvps
  for update using (true);

create policy "rsvps_select" on rsvps
  for select using (true);
