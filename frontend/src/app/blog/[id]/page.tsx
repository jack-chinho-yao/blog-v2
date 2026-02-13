import { notFound } from 'next/navigation';
import CommentSection from '@/components/comment/CommentSection';
import type { BlogResponse } from '@/types';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getBlog(id: string): Promise<BlogResponse | null> {
  const res = await fetch(`${API_BASE}/api/blogs/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        {blog.firstPicture && (
          <img
            src={blog.firstPicture}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{blog.user?.nickname}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>{blog.views} views</span>
          {blog.type && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              {blog.type.name}
            </span>
          )}
        </div>
        {blog.tags?.length > 0 && (
          <div className="flex gap-2 mt-3">
            {blog.tags.map((tag) => (
              <span key={tag.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Share statement */}
      {blog.shareStatement && (
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-gray-600">
          Please include the original link when sharing this article.
        </div>
      )}

      {/* Comments */}
      {blog.commentable && <CommentSection blogId={blog.id} />}
    </div>
  );
}
