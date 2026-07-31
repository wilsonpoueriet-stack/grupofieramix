-- FASE INICIAL DE BASE DE DATOS
create extension if not exists pgcrypto;

create table if not exists stations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  slogan text not null,
  genre text,
  logo_url text,
  stream_url text not null,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  image_url text,
  category text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  station_id uuid references stations(id) on delete cascade,
  program_name text not null,
  host_name text,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  active boolean default true
);

alter table stations enable row level security;
alter table news enable row level security;
alter table schedules enable row level security;

create policy "Public reads active stations"
on stations for select using (active = true);

create policy "Public reads published news"
on news for select using (published = true);

create policy "Public reads active schedules"
on schedules for select using (active = true);
