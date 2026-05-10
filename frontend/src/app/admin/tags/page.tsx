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
      <h1 className="text-3xl font-bold text-fg mb-8">Manage Tags</h1>

      <form onSubmit={handleCreate} className="flex gap-4 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 bg-surface-0 border border-surface-1 text-fg placeholder:text-overlay-0 rounded-lg px-4 py-2 focus:outline-none focus:border-mauve"
        />
        <button type="submit" className="bg-mauve text-crust font-semibold px-6 py-2 rounded-lg hover:bg-lavender transition">
          Add
        </button>
      </form>

      <div className="bg-surface-0 border border-surface-1 rounded-lg divide-y divide-surface-1">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between px-6 py-4">
            {editId === tag.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 bg-mantle border border-surface-1 text-fg rounded px-3 py-1 focus:outline-none focus:border-mauve"
                  autoFocus
                />
                <button onClick={() => handleUpdate(tag.id)} className="text-ctp-green hover:text-ctp-teal">Save</button>
                <button onClick={() => setEditId(null)} className="text-overlay-1 hover:text-fg">Cancel</button>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-fg font-medium">{tag.name}</span>
                  <span className="text-overlay-0 text-sm ml-2">({tag.blogCount} posts)</span>
                </div>
                <div className="space-x-3">
                  <button onClick={() => { setEditId(tag.id); setEditName(tag.name); }}
                    className="text-mauve hover:text-lavender text-sm">Edit</button>
                  <button onClick={() => handleDelete(tag.id)}
                    className="text-ctp-red hover:text-ctp-peach text-sm">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
