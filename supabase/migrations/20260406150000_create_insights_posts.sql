create extension if not exists "pgcrypto";

create table if not exists public.insights_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  category text not null,
  color text not null default 'indigo',
  featured boolean not null default false,
  read_time text not null,
  published_at date not null,
  status text not null default 'published',
  source text not null default 'ai',
  content_hash text,
  prompt text,
  model_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists insights_posts_slug_idx
  on public.insights_posts (slug);

create index if not exists insights_posts_published_at_idx
  on public.insights_posts (published_at desc);

create index if not exists insights_posts_featured_idx
  on public.insights_posts (featured desc, published_at desc);

create index if not exists insights_posts_status_idx
  on public.insights_posts (status);

create index if not exists insights_posts_category_idx
  on public.insights_posts (category);

create or replace function public.set_updated_at_insights_posts()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_insights_posts_updated_at on public.insights_posts;

create trigger trg_insights_posts_updated_at
before update on public.insights_posts
for each row
execute function public.set_updated_at_insights_posts();

create table if not exists public.insight_generation_runs (
  id uuid primary key default gen_random_uuid(),
  generated_for_date date not null unique,
  prompt text not null,
  model_name text not null,
  status text not null default 'pending',
  content_hash text,
  post_slug text,
  raw_output jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists insight_generation_runs_status_idx
  on public.insight_generation_runs (status);

create index if not exists insight_generation_runs_created_at_idx
  on public.insight_generation_runs (created_at desc);

create or replace function public.set_updated_at_insight_generation_runs()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_insight_generation_runs_updated_at on public.insight_generation_runs;

create trigger trg_insight_generation_runs_updated_at
before update on public.insight_generation_runs
for each row
execute function public.set_updated_at_insight_generation_runs();

alter table public.insights_posts enable row level security;
alter table public.insight_generation_runs enable row level security;

drop policy if exists "public_read_published_insights_posts" on public.insights_posts;
create policy "public_read_published_insights_posts"
on public.insights_posts
for select
using (status = 'published');

drop policy if exists "service_only_insights_posts" on public.insights_posts;
create policy "service_only_insights_posts"
on public.insights_posts
for all
using (false)
with check (false);

drop policy if exists "service_only_insight_generation_runs" on public.insight_generation_runs;
create policy "service_only_insight_generation_runs"
on public.insight_generation_runs
for all
using (false)
with check (false);
