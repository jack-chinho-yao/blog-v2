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
          <h1 className="text-3xl font-bold text-fg">Dashboard</h1>
          <p className="text-overlay-1 mt-1">Welcome, {user?.nickname}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-ctp-red hover:text-ctp-peach transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-0 border border-surface-1 rounded-lg p-6">
          <h3 className="text-overlay-1 text-sm">Total Posts</h3>
          <p className="text-3xl font-bold text-fg mt-2">{blogCount}</p>
        </div>
        <div className="bg-surface-0 border border-surface-1 rounded-lg p-6">
          <h3 className="text-overlay-1 text-sm">Role</h3>
          <p className="text-3xl font-bold text-mauve mt-2">{user?.role}</p>
        </div>
        <div className="bg-surface-0 border border-surface-1 rounded-lg p-6">
          <h3 className="text-overlay-1 text-sm">Quick Actions</h3>
          <Link
            href="/admin/blogs/new"
            className="inline-block mt-2 bg-mauve text-crust font-semibold px-4 py-2 rounded-lg hover:bg-lavender transition text-sm"
          >
            New Post
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/blogs" className="bg-surface-0 border border-surface-1 rounded-lg p-6 hover:border-mauve transition">
          <h3 className="text-lg font-semibold text-fg">Manage Blogs</h3>
          <p className="text-overlay-1 text-sm mt-1">Create, edit, and delete blog posts</p>
        </Link>
        <Link href="/admin/tags" className="bg-surface-0 border border-surface-1 rounded-lg p-6 hover:border-mauve transition">
          <h3 className="text-lg font-semibold text-fg">Manage Tags</h3>
          <p className="text-overlay-1 text-sm mt-1">Add and manage blog tags</p>
        </Link>
      </div>
    </div>
  );
}
