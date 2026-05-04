import Link from 'next/link';
import type { ArchiveResponse } from '@/types';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getArchives(): Promise<ArchiveResponse[]> {
  const res = await fetch(`${API_BASE}/api/blogs/archive`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

async function getBlogCount(): Promise<number> {
  const res = await fetch(`${API_BASE}/api/blogs/count`, { next: { revalidate: 60 } });
  if (!res.ok) return 0;
  return res.json();
}

export default async function ArchivesPage() {
  const [archives, count] = await Promise.all([getArchives(), getBlogCount()]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-fg mb-2">Archives</h1>
      <p className="text-overlay-1 mb-8">Total {count} posts</p>

      <div className="space-y-8">
        {archives.map((archive) => (
          <div key={archive.year}>
            <h2 className="text-2xl font-bold text-mauve mb-4 border-b border-surface-1 pb-2">
              {archive.year}
            </h2>
            <ul className="space-y-3">
              {archive.blogs.map((blog) => (
                <li key={blog.id} className="flex items-center gap-4">
                  <span className="text-sm text-overlay-1 w-24 shrink-0">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/blog/${blog.id}`}
                    className="text-subtext-1 hover:text-mauve transition"
                  >
                    {blog.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
