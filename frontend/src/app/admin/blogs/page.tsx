'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn } from '@/lib/auth';
import { api } from '@/lib/api';
import type { BlogSummaryResponse, Page } from '@/types';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Page<BlogSummaryResponse> | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/admin/login'); return; }
    loadBlogs();
  }, [page, router]);

  async function loadBlogs() {
    const data = await api.adminGetBlogs(page);
    setBlogs(data);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    await api.adminDeleteBlog(id);
    loadBlogs();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-fg">Manage Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-mauve text-crust font-semibold px-4 py-2 rounded-lg hover:bg-lavender transition"
        >
          New Post
        </Link>
      </div>

      <div className="bg-surface-0 border border-surface-1 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-mantle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-overlay-1 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-overlay-1 uppercase">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-overlay-1 uppercase">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-overlay-1 uppercase">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-overlay-1 uppercase">Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-overlay-1 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-1">
            {blogs?.content.map((blog) => (
              <tr key={blog.id} className="hover:bg-mantle">
                <td className="px-6 py-4 text-sm text-fg">{blog.title}</td>
                <td className="px-6 py-4 text-sm text-overlay-1">{blog.tags?.map(t => t.name).join(', ')}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${blog.recommend ? 'bg-surface-1 text-ctp-green' : 'bg-surface-1 text-overlay-1'}`}>
                    {blog.recommend ? 'Yes' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-overlay-1">{blog.views}</td>
                <td className="px-6 py-4 text-sm text-overlay-1">
                  {new Date(blog.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <Link href={`/admin/blogs/${blog.id}/edit`} className="text-mauve hover:text-lavender">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(blog.id)} className="text-ctp-red hover:text-ctp-peach">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {blogs && blogs.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={blogs.first}
            className="px-4 py-2 border border-surface-1 text-fg rounded-lg hover:bg-surface-0 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-subtext-0">
            Page {page + 1} of {blogs.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={blogs.last}
            className="px-4 py-2 border border-surface-1 text-fg rounded-lg hover:bg-surface-0 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
