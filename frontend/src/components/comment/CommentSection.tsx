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
      <h3 className="text-2xl font-bold text-fg mb-6">Comments</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="bg-mantle border border-surface-1 rounded-lg p-6 mb-8">
        {replyTo && (
          <div className="mb-3 text-sm text-mauve">
            Replying to comment...
            <button onClick={() => setReplyTo(null)} className="ml-2 text-ctp-red">Cancel</button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nickname *"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-surface-0 border border-surface-1 text-fg placeholder:text-overlay-0 rounded-lg px-4 py-2 focus:outline-none focus:border-mauve"
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface-0 border border-surface-1 text-fg placeholder:text-overlay-0 rounded-lg px-4 py-2 focus:outline-none focus:border-mauve"
          />
        </div>
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full bg-surface-0 border border-surface-1 text-fg placeholder:text-overlay-0 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-mauve"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-mauve text-base font-semibold px-6 py-2 rounded-lg hover:bg-lavender transition disabled:opacity-50"
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
          <p className="text-overlay-1 text-center py-8">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, onReply }: { comment: CommentResponse; onReply: (id: number) => void }) {
  return (
    <div className="border-l-2 border-surface-1 pl-4">
      <div className="flex items-center gap-3 mb-2">
        <span className={`font-semibold ${comment.adminComment ? 'text-mauve' : 'text-fg'}`}>
          {comment.nickname}
          {comment.adminComment && <span className="ml-1 text-xs bg-surface-0 text-mauve px-1.5 py-0.5 rounded">Admin</span>}
        </span>
        <span className="text-xs text-overlay-0">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-subtext-1 mb-2">{comment.content}</p>
      <button
        onClick={() => onReply(comment.id)}
        className="text-sm text-mauve hover:text-lavender"
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
