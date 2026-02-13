import Link from 'next/link';
import type { BlogSummaryResponse } from '@/types';

interface BlogCardProps {
  blog: BlogSummaryResponse;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
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
          {blog.type && (
            <Link
              href={`/types?id=${blog.type.id}`}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
            >
              {blog.type.name}
            </Link>
          )}
          {blog.tags?.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags?id=${tag.id}`}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        <Link href={`/blog/${blog.id}`}>
          <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition mb-2">
            {blog.title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
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
