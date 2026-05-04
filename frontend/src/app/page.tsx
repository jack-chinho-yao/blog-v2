import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogSummaryResponse, TagResponse, Page } from '@/types';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getBlogs(): Promise<Page<BlogSummaryResponse>> {
  const res = await fetch(`${API_BASE}/api/blogs?size=8&sort=updatedAt,desc`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { content: [], totalPages: 0, totalElements: 0, size: 8, number: 0, first: true, last: true };
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
  const [blogPage, tags, recommendBlogs] = await Promise.all([
    getBlogs(),
    getTopTags(),
    getRecommendBlogs(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-fg mb-8">Latest Posts</h1>
          <div className="space-y-6">
            {blogPage.content.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
            {blogPage.content.length === 0 && (
              <p className="text-overlay-1 text-center py-12">No posts yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Tags */}
          <div className="bg-mantle border border-surface-1 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-fg mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags?id=${tag.id}`}
                  className="bg-surface-0 text-lavender text-sm px-3 py-1 rounded-full hover:bg-surface-1 hover:text-mauve transition"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="bg-mantle border border-surface-1 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-fg mb-4">Recommended</h3>
            <div className="space-y-3">
              {recommendBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="block text-subtext-0 hover:text-mauve transition text-sm"
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
