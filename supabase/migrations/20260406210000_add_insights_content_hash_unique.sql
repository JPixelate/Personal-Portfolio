create unique index if not exists insights_posts_content_hash_unique_idx
  on public.insights_posts (content_hash)
  where content_hash is not null;
