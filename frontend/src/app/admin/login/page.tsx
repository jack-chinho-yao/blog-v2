'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login({ username, password });
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-surface-0 border border-surface-1 rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-fg mb-6 text-center">Admin Login</h1>

        {error && (
          <div className="bg-surface-0 text-ctp-red px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-subtext-1 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-0 border border-surface-1 text-fg placeholder:text-overlay-0 rounded-lg px-4 py-2 focus:outline-none focus:border-mauve"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-subtext-1 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-0 border border-surface-1 text-fg placeholder:text-overlay-0 rounded-lg px-4 py-2 focus:outline-none focus:border-mauve"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mauve text-crust font-semibold py-2 rounded-lg hover:bg-lavender transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
