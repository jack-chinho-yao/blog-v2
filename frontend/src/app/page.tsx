import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogSummaryResponse, TypeResponse, TagResponse, Page } from '@/types';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getBlogs(): Promise<Page<BlogSummaryResponse>> {
  const res = await fetch(`${API_BASE}/api/blogs?size=8&sort=updatedAt,desc`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { content: [], totalPages: 0, totalElements: 0, size: 8, number: 0, first: true, last: true };
  return res.json();
}

async function getTopTypes(): Promise<TypeResponse[]> {
  const res = await fetch(`${API_BASE}/api/types/top?size=6`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

async function getTopTags(): Promise<TagResponse[]> {
  const res = await fetch(`${API_BASE}/api/tags/top?size=10`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

async function getRecommendBlogs(): Promise<BlogSummaryResponse[]> {
  const res = await fetch(`${API_BASE}/api/blogs/recommend?size=4`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const [blogPage, types, tags, recommendBlogs] = await Promise.all([
    getBlogs(),
    getTopTypes(),
    getTopTags(),
    getRecommendBlogs(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest Posts</h1>
          <div className="space-y-6">
            {blogPage.content.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
            {blogPage.content.length === 0 && (
              <p className="text-gray-500 text-center py-12">No posts yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {types.map((type) => (
                <Link
                  key={type.id}
                  href={`/types?id=${type.id}`}
                  className="flex justify-between items-center text-gray-600 hover:text-blue-600 transition"
                >
                  <span>{type.name}</span>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">{type.blogCount}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags?id=${tag.id}`}
                  className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended</h3>
            <div className="space-y-3">
              {recommendBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="block text-gray-600 hover:text-blue-600 transition text-sm"
                >
                  {blog.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
