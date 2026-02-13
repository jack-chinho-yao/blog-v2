'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn, getUser } from '@/lib/auth';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    api.getBlogCount().then(setBlogCount);
  }, [router]);

  const user = getUser();

  async function handleLogout() {
    await api.logout();
    router.push('/admin/login');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome, {user?.nickname}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Total Posts</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{blogCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Role</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{user?.role}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Quick Actions</h3>
          <Link
            href="/admin/blogs/new"
            className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            New Post
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/blogs" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800">Manage Blogs</h3>
          <p className="text-gray-500 text-sm mt-1">Create, edit, and delete blog posts</p>
        </Link>
        <Link href="/admin/types" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800">Manage Categories</h3>
          <p className="text-gray-500 text-sm mt-1">Organize posts by category</p>
        </Link>
        <Link href="/admin/tags" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800">Manage Tags</h3>
          <p className="text-gray-500 text-sm mt-1">Add and manage blog tags</p>
        </Link>
      </div>
    </div>
  );
}
