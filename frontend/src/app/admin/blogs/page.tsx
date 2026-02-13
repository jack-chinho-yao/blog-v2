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
        <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs?.content.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{blog.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{blog.type?.name}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${blog.recommend ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {blog.recommend ? 'Yes' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{blog.views}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(blog.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <Link href={`/admin/blogs/${blog.id}/edit`} className="text-blue-600 hover:text-blue-800">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-800">
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
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {page + 1} of {blogs.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={blogs.last}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
