'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { CommentResponse } from '@/types';

interface CommentSectionProps {
  blogId: number;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [blogId]);

  async function loadComments() {
    const data = await api.getComments(blogId);
    setComments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await api.createComment({
        nickname,
        email,
        content,
        blogId,
        parentCommentId: replyTo ?? undefined,
      });
      setContent('');
      setReplyTo(null);
      await loadComments();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-8">
        {replyTo && (
          <div className="mb-3 text-sm text-blue-600">
            Replying to comment...
            <button onClick={() => setReplyTo(null)} className="ml-2 text-red-500">Cancel</button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nickname *"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {/* Comment list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(id) => setReplyTo(id)}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, onReply }: { comment: CommentResponse; onReply: (id: number) => void }) {
  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-center gap-3 mb-2">
        <span className={`font-semibold ${comment.adminComment ? 'text-blue-600' : 'text-gray-800'}`}>
          {comment.nickname}
          {comment.adminComment && <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Admin</span>}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-700 mb-2">{comment.content}</p>
      <button
        onClick={() => onReply(comment.id)}
        className="text-sm text-blue-500 hover:text-blue-700"
      >
        Reply
      </button>

      {comment.replies?.length > 0 && (
        <div className="mt-4 ml-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}
