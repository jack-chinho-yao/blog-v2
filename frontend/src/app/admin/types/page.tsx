'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { api } from '@/lib/api';
import type { TypeResponse } from '@/types';

export default function AdminTypesPage() {
  const router = useRouter();
  const [types, setTypes] = useState<TypeResponse[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/admin/login'); return; }
    loadTypes();
  }, [router]);

  async function loadTypes() {
    const data = await api.getTypes();
    setTypes(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.adminCreateType(name);
    setName('');
    loadTypes();
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return;
    await api.adminUpdateType(id, editName);
    setEditId(null);
    loadTypes();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this category?')) return;
    await api.adminDeleteType(id);
    loadTypes();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-4 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Add
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md divide-y">
        {types.map((type) => (
          <div key={type.id} className="flex items-center justify-between px-6 py-4">
            {editId === type.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border rounded px-3 py-1"
                  autoFocus
                />
                <button onClick={() => handleUpdate(type.id)} className="text-green-600 hover:text-green-800">Save</button>
                <button onClick={() => setEditId(null)} className="text-gray-500">Cancel</button>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-gray-800 font-medium">{type.name}</span>
                  <span className="text-gray-400 text-sm ml-2">({type.blogCount} posts)</span>
                </div>
                <div className="space-x-3">
                  <button onClick={() => { setEditId(type.id); setEditName(type.name); }}
                    className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button onClick={() => handleDelete(type.id)}
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
