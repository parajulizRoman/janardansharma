-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. POSTS TABLE
create type post_type as enum ('news', 'press', 'statement', 'article');

create table public.posts (
  id uuid not null default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  type post_type not null default 'news',
  published_at timestamp with time zone default now(),
  cover_image text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (id)
);

-- 2. EVENTS TABLE
create type event_type as enum ('rally', 'meeting', 'interview', 'other');

create table public.events (
  id uuid not null default uuid_generate_v4(),
  title text not null,
  description text,
  location text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  type event_type default 'other',
  image_url text,
  created_at timestamp with time zone default now(),
  primary key (id)
);

-- 3. MEDIA TABLE
create type media_type as enum ('image', 'video');

create table public.media (
  id uuid not null default uuid_generate_v4(),
  title text,
  url text not null,
  type media_type default 'image',
  created_at timestamp with time zone default now(),
  primary key (id)
);

-- 4. MESSAGES TABLE (Contact Form)
create table public.messages (
  id uuid not null default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default now(),
  primary key (id)
);

-- 5. POLICIES / VISION TABLE
create table public.policies (
  id uuid not null default uuid_generate_v4(),
  title text not null,
  content text not null,
  "order" integer default 0,
  created_at timestamp with time zone default now(),
  primary key (id)
);

-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.media enable row level security;
alter table public.messages enable row level security;
alter table public.policies enable row level security;

-- Policies for POSTS (Public read, Admin all)
-- Assuming admin has a specific role or we stick to service role for writing for now.
-- For simplicity in this starter, we allow public read. Use Service Role in backend for writes.
create policy "Public posts are viewable by everyone" on public.posts for select using (true);

-- Policies for EVENTS
create policy "Public events are viewable by everyone" on public.events for select using (true);

-- Policies for MEDIA
create policy "Public media are viewable by everyone" on public.media for select using (true);

-- Policies for MESSAGES
-- Only allow insert for public (anyone can send message)
create policy "Anyone can insert messages" on public.messages for insert with check (true);
-- Only service role (or admin) can view messages. No public select policy.

-- Policies for POLICIES
create policy "Public policies are viewable by everyone" on public.policies for select using (true);

-- STORAGE BUCKETS
-- You will need to create a 'media' bucket in Supabase Storage.
-- insert into storage.buckets (id, name, public) values ('media', 'media', true);

-- Storage Policies
-- create policy "Media is publicly accessible" on storage.objects for select using ( bucket_id = 'media' );
-- create policy "Anyone can upload media" on storage.objects for insert with check ( bucket_id = 'media' ); -- WARNING: RESTRICT THIS IN PROD
