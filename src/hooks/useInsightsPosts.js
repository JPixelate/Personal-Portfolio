import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mapInsightRow } from '../utils/insights.js';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useInsightsPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/insights`);
        if (!response.ok) {
          throw new Error(`Insights API failed with ${response.status}`);
        }

        const payload = await response.json();
        const rows = Array.isArray(payload.posts) ? payload.posts : [];

        if (!active) return;

        setPosts(rows.map(mapInsightRow));
        setLoading(false);
        return;
      } catch (apiError) {
        if (!isSupabaseConfigured || !supabase) {
          if (!active) return;
          setError(apiError instanceof Error ? apiError : new Error(String(apiError)));
          setLoading(false);
          return;
        }
      }

      const { data, error: queryError } = await supabase
        .from('insights_posts')
        .select('id, slug, title, excerpt, body, tags, category, color, featured, read_time, published_at, status, source')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false });

      if (!active) return;

      if (queryError) {
        setError(queryError);
        setPosts([]);
        setLoading(false);
        return;
      }

      setPosts((data || []).map(mapInsightRow));
      setLoading(false);
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  return { posts, loading, error };
}

export function useInsightPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadPost() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/insights/${encodeURIComponent(slug)}`);
        if (!response.ok) {
          throw new Error(`Insights API failed with ${response.status}`);
        }

        const payload = await response.json();
        if (!active) return;
        setPost(mapInsightRow(payload.post));
        setLoading(false);
        return;
      } catch (apiError) {
        if (!isSupabaseConfigured || !supabase) {
          if (!active) return;
          setError(apiError instanceof Error ? apiError : new Error(String(apiError)));
          setLoading(false);
          return;
        }
      }

      const { data, error: queryError } = await supabase
        .from('insights_posts')
        .select('id, slug, title, excerpt, body, tags, category, color, featured, read_time, published_at, status, source')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        setError(queryError);
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(mapInsightRow(data));
      setLoading(false);
    }

    if (slug) {
      loadPost();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [slug]);

  return { post, loading, error };
}
