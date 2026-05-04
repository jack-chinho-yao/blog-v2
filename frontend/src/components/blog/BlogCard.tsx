import Link from 'next/link';
import type { BlogSummaryResponse } from '@/types';

interface BlogCardProps {
  blog: BlogSummaryResponse;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="bg-mantle border border-surface-1 rounded-lg overflow-hidden hover:border-mauve transition shadow-[0_0_20px_rgba(203,166,247,0)] hover:shadow-[0_0_20px_rgba(203,166,247,0.15)]">
      {blog.firstPicture && (
        <Link href={`/blog/${blog.id}`}>
          <img
            src={blog.firstPicture}
            alt={blog.title}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {blog.tags?.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags?id=${tag.id}`}
              className="text-xs bg-surface-0 text-lavender px-2 py-1 rounded hover:bg-surface-1 transition"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        <Link href={`/blog/${blog.id}`}>
          <h2 className="text-xl font-semibold text-fg hover:text-mauve transition mb-2">
            {blog.title}
          </h2>
        </Link>

        <p className="text-subtext-0 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>

        <div className="flex items-center justify-between text-sm text-overlay-1">
          <div className="flex items-center gap-4">
            <span>{blog.user?.nickname}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <span>{blog.views} views</span>
        </div>
      </div>
    </article>
  );
}
