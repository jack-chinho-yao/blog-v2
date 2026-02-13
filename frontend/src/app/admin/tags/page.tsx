'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { api } from '@/lib/api';
import type { TagResponse } from '@/types';

export default function AdminTagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/admin/login'); return; }
    loadTags();
  }, [router]);

  async function loadTags() {
    const data = await api.getTags();
    setTags(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.adminCreateTag(name);
    setName('');
    loadTags();
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return;
    await api.adminUpdateTag(id, editName);
    setEditId(null);
    loadTags();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this tag?')) return;
    await api.adminDeleteTag(id);
    loadTags();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Tags</h1>

      <form onSubmit={handleCreate} className="flex gap-4 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Add
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md divide-y">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between px-6 py-4">
            {editId === tag.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border rounded px-3 py-1"
                  autoFocus
                />
                <button onClick={() => handleUpdate(tag.id)} className="text-green-600 hover:text-green-800">Save</button>
                <button onClick={() => setEditId(null)} className="text-gray-500">Cancel</button>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-gray-800 font-medium">{tag.name}</span>
                  <span className="text-gray-400 text-sm ml-2">({tag.blogCount} posts)</span>
                </div>
                <div className="space-x-3">
                  <button onClick={() => { setEditId(tag.id); setEditName(tag.name); }}
                    className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button onClick={() => handleDelete(tag.id)}
                    className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
