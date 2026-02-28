import Link from 'next/link';
import type { BlogPost } from '@/types';
import RatingStars from '@/components/RatingStars';
import TagBadge from '@/components/TagBadge';

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const { metadata } = post;
  const ratingNum = parseInt(metadata.rating?.key || '0', 10);
  const author = metadata.author;
  const categories = metadata.categories;
  const publicationDate = metadata.publication_date
    ? new Date(metadata.publication_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md post-card-hover">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={`${metadata.featured_image.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {metadata.region && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-charcoal-800">
              {metadata.region.value}
            </span>
          )}
          {metadata.post_status?.key === 'featured' && (
            <span className="absolute top-3 right-3 bg-terracotta-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-xs font-semibold text-terracotta-500 hover:text-terracotta-700 transition-colors uppercase tracking-wider"
              >
                {cat.metadata?.name || cat.title}
              </Link>
            ))}
          </div>
        )}

        <Link href={`/posts/${post.slug}`} className="block group">
          <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-terracotta-500 transition-colors leading-snug mb-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
          {metadata.excerpt}
        </p>

        {/* Rating & Location */}
        <div className="flex items-center justify-between mb-3">
          <RatingStars rating={ratingNum} size="sm" />
          <span className="text-xs text-gray-500">
            📍 {metadata.city ? `${metadata.city}, ` : ''}{metadata.country}
          </span>
        </div>

        {/* Tags */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {metadata.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Author & Date */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {author && (
            <Link
              href={`/authors/${author.slug}`}
              className="flex items-center gap-2 group/author"
            >
              {author.metadata?.avatar && (
                <img
                  src={`${author.metadata.avatar.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={author.metadata?.name || author.title}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-xs font-medium text-gray-600 group-hover/author:text-terracotta-500 transition-colors">
                {author.metadata?.name || author.title}
              </span>
            </Link>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {publicationDate && <span>{publicationDate}</span>}
            {metadata.reading_time && (
              <>
                <span>·</span>
                <span>{metadata.reading_time} min read</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}