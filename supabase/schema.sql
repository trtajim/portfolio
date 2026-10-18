-- Supabase Schema for TR Tajim Portfolio
-- RE-RUNNABLE FULL CLEAN & RESET MIGRATION
-- Run this anytime in the Supabase SQL Editor to cleanly reset the portfolio database

create extension if not exists "uuid-ossp";

-- 0. Clean / Drop existing tables in reverse dependency order
drop table if exists public.posts cascade;
drop table if exists public.projects cascade;
drop table if exists public.profile cascade;

-- 1. Profile / Site Settings
create table public.profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null default 'TR Tajim',
  headline text not null default 'Web developer building open-source tools and lean web products.',
  whoami text[] not null default array[
    'I’m TR Tajim, a full-stack developer, competitive programmer and IoT enthusiast. I build web applications, Android apps and developer-focused projects.',
    'I mainly work with Laravel, Vue.js, React, PHP, Java and C++. I’m also part of HSCStack, an open-source community project for HSC and SSC students.'
  ],
  main_stack text[] not null default array['Laravel', 'Vue.js', 'React', 'PHP', 'Java', 'C++'],
  grouped_stacks jsonb not null default '[
    {"category": "Web", "items": "Laravel, PHP, Vue.js, React.js, MySQL"},
    {"category": "Mobile", "items": "Java, Android SDK, XML"},
    {"category": "Programming", "items": "C, C++"},
    {"category": "IoT", "items": "Arduino, IoT integration"},
    {"category": "DevOps", "items": "Linux, Bash, cPanel"}
  ]'::jsonb,
  social_links jsonb not null default '[
    {"label": "GitHub", "url": "https://github.com/trtajim"},
    {"label": "LinkedIn", "url": "https://linkedin.com/in/trtajim"},
    {"label": "Facebook", "url": "https://facebook.com/trtajim"}
  ]'::jsonb,
  stats jsonb not null default '[
    {"label": "years building", "value": "4+"},
    {"label": "projects shipped", "value": "15+"}
  ]'::jsonb,
  avatar_url text default null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Projects
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  summary text not null,
  pill text not null default 'Web',
  top_metric text default null,
  tags text[] not null default array[]::text[],
  actions jsonb not null default '[]'::jsonb,
  content text default '',
  image_url text default null,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  order_index int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Posts (Writing Articles)
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  subtitle text default null,
  content text not null default '',
  tags text[] not null default array[]::text[],
  image_url text default null,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  published_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;

-- Public Read Policies
create policy "Allow public read access on profile"
  on public.profile for select using (true);

create policy "Allow public read access on projects"
  on public.projects for select
  using (is_published = true or auth.role() = 'authenticated');

create policy "Allow public read access on posts"
  on public.posts for select
  using (is_published = true or auth.role() = 'authenticated');

-- Authenticated Admin Full CRUD Policies
create policy "Allow admin full access on profile"
  on public.profile for all to authenticated using (true) with check (true);

create policy "Allow admin full access on projects"
  on public.projects for all to authenticated using (true) with check (true);

create policy "Allow admin full access on posts"
  on public.posts for all to authenticated using (true) with check (true);

-- 4. Supabase Storage for Assets
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

drop policy if exists "Allow public read on portfolio-assets" on storage.objects;
create policy "Allow public read on portfolio-assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Allow authenticated upload on portfolio-assets" on storage.objects;
create policy "Allow authenticated upload on portfolio-assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-assets');

drop policy if exists "Allow authenticated update/delete on portfolio-assets" on storage.objects;
create policy "Allow authenticated update/delete on portfolio-assets"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'portfolio-assets');

-- 5. Realtime Publication (Safe Re-run)
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

alter publication supabase_realtime add table public.profile, public.projects, public.posts;

-- 6. Seed Initial Data
insert into public.profile (name, headline, whoami, main_stack, grouped_stacks, social_links)
values (
  'TR Tajim',
  'Web developer building open-source tools and lean web products.',
  array[
    'I’m TR Tajim, a full-stack developer, competitive programmer and IoT enthusiast. I build web applications, Android apps and developer-focused projects.',
    'I mainly work with Laravel, Vue.js, React, PHP, Java and C++. I’m also part of HSCStack, an open-source community project for HSC and SSC students.'
  ],
  array['Laravel', 'Vue.js', 'React', 'PHP', 'Java', 'C++'],
  '[
    {"category": "Web", "items": "Laravel, PHP, Vue.js, React.js, MySQL"},
    {"category": "Mobile", "items": "Java, Android SDK, XML"},
    {"category": "Programming", "items": "C, C++"},
    {"category": "IoT", "items": "Arduino, IoT integration"},
    {"category": "DevOps", "items": "Linux, Bash, cPanel"}
  ]'::jsonb,
  '[
    {"label": "GitHub", "url": "https://github.com/trtajim"},
    {"label": "LinkedIn", "url": "https://linkedin.com/in/trtajim"},
    {"label": "Facebook", "url": "https://facebook.com/trtajim"}
  ]'::jsonb
);

insert into public.projects (slug, title, summary, pill, top_metric, tags, actions, is_featured, is_published, order_index)
values
(
  'hscstack',
  'HSCStack',
  'A community-driven website and Facebook page for HSC and SSC students, offering organised study material. Built and maintained in the open by contributors.',
  'Web',
  '1,000+ registered users',
  array['Open source', 'Education', 'Community'],
  '[{"label": "Visit site", "url": "https://hscstack.com"}, {"label": "GitHub", "url": "https://github.com/hscstack"}]'::jsonb,
  true,
  true,
  1
),
(
  'iot-environment-monitor',
  'IoT Environment Monitor',
  'Battery-powered ESP32 sensor nodes sending real-time temperature, humidity and air quality telemetry over MQTT to a centralized web dashboard.',
  'IoT',
  '99.8% uptime',
  array['ESP32', 'C++', 'MQTT', 'Vue.js'],
  '[{"label": "GitHub", "url": "https://github.com/trtajim"}]'::jsonb,
  true,
  true,
  2
);

insert into public.posts (slug, title, subtitle, content, tags, is_featured, is_published, published_date)
values
(
  'building-a-store-without-paying-for-hosting',
  'Building a store without paying for hosting',
  'What a free-tier-only stack can and cannot do.',
  '# Building a store without paying for hosting\n\nWhat a free-tier-only stack can and cannot do.\n\n### The Setup\nDeploying modern static frontends with serverless backends enables virtually zero-cost operations during early-stage validation.',
  array['Architecture', 'Cloud', 'Cost-optimization'],
  true,
  true,
  '2026-08-14'
),
(
  'debugging-esp32-mesh-networks',
  'Debugging ESP32 mesh networks in practice',
  'Lessons learned from packet drops and battery optimization.',
  '# Debugging ESP32 mesh networks in practice\n\nPractical tips on handling dropped packets and sleep modes in remote node deployments.',
  array['IoT', 'Embedded', 'C++'],
  true,
  true,
  '2026-07-22'
);
