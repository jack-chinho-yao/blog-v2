'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogSummaryResponse, Page } from '@/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Page<BlogSummaryResponse> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await api.searchBlogs(query);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-fg mb-8">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 bg-surface-0 border border-surface-1 text-fg placeholder:text-overlay-0 rounded-lg px-4 py-3 focus:outline-none focus:border-mauve"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-mauve text-base font-semibold px-6 py-3 rounded-lg hover:bg-lavender transition disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results && (
        <>
          <p className="text-overlay-1 mb-6">
            Found {results.totalElements} result(s) for &quot;{query}&quot;
          </p>
          <div className="space-y-6">
            {results.content.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
