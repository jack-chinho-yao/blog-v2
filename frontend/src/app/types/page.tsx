'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import BlogCard from '@/components/blog/BlogCard';
import type { TypeResponse, BlogSummaryResponse, Page } from '@/types';

function TypesContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  const [types, setTypes] = useState<TypeResponse[]>([]);
  const [blogs, setBlogs] = useState<Page<BlogSummaryResponse> | null>(null);
  const [activeType, setActiveType] = useState<number | null>(selectedId ? Number(selectedId) : null);

  useEffect(() => {
    api.getTypes().then(setTypes);
  }, []);

  useEffect(() => {
    if (activeType) {
      api.getBlogsByType(activeType).then(setBlogs);
    }
  }, [activeType]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Categories</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`px-4 py-2 rounded-lg transition ${
              activeType === type.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {type.name} ({type.blogCount})
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {blogs?.content.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
        {activeType && blogs?.content.length === 0 && (
          <p className="text-gray-500 text-center py-12">No posts in this category.</p>
        )}
        {!activeType && (
          <p className="text-gray-500 text-center py-12">Select a category to view posts.</p>
        )}
      </div>
    </div>
  );
}

export default function TypesPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8">Loading...</div>}>
      <TypesContent />
    </Suspense>
  );
}