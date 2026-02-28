import Link from 'next/link';
import type { Author } from '@/types';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const { metadata } = author;

  return (
    <Link
      href={`/authors/${author.slug}`}
      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-md post-card-hover group"
    >
      {metadata.avatar && (
        <img
          src={`${metadata.avatar.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
          alt={metadata.name}
          width={80}
          height={80}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div className="min-w-0">
        <h3 className="font-bold text-charcoal-900 group-hover:text-terracotta-500 transition-colors truncate">
          {metadata.name}
        </h3>
        {metadata.home_base && (
          <p className="text-xs text-gray-500 mb-1">📍 {metadata.home_base}</p>
        )}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {metadata.short_bio}
        </p>
      </div>
    </Link>
  );
}