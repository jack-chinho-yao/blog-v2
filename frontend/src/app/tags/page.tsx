'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import BlogCard from '@/components/blog/BlogCard';
import type { TagResponse, BlogSummaryResponse, Page } from '@/types';

function TagsContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  const [tags, setTags] = useState<TagResponse[]>([]);
  const [blogs, setBlogs] = useState<Page<BlogSummaryResponse> | null>(null);
  const [activeTag, setActiveTag] = useState<number | null>(selectedId ? Number(selectedId) : null);

  useEffect(() => {
    api.getTags().then(setTags);
  }, []);

  useEffect(() => {
    if (activeTag) {
      api.getBlogsByTag(activeTag).then(setBlogs);
    }
  }, [activeTag]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tags</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setActiveTag(tag.id)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              activeTag === tag.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
          >
            {tag.name} ({tag.blogCount})
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {blogs?.content.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
        {activeTag && blogs?.content.length === 0 && (
          <p className="text-gray-500 text-center py-12">No posts with this tag.</p>
        )}
        {!activeTag && (
          <p className="text-gray-500 text-center py-12">Select a tag to view posts.</p>
        )}
      </div>
    </div>
  );
}

export default function TagsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8">Loading...</div>}>
      <TagsContent />
    </Suspense>
  );
}