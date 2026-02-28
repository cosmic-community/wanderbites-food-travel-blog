import Link from 'next/link';
import type { BlogPost } from '@/types';
import RatingStars from '@/components/RatingStars';

interface FeaturedPostProps {
  post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const { metadata } = post;
  const ratingNum = parseInt(metadata.rating?.key || '0', 10);
  const author = metadata.author;

  return (
    <section className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="relative aspect-[21/9] sm:aspect-[16/7]">
          <img
            src={`${metadata.featured_image.imgix_url}?w=1600&h=700&fit=crop&auto=format,compress`}
            alt={post.title}
            width={1600}
            height={700}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            {metadata.post_status?.key === 'featured' && (
              <span className="inline-block bg-terracotta-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                ⭐ Featured Story
              </span>
            )}

            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-3 max-w-3xl">
              {post.title}
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl mb-4 line-clamp-2">
              {metadata.excerpt}
            </p>

            <div className="flex items-center flex-wrap gap-4">
              <RatingStars rating={ratingNum} size="md" />

              <span className="text-sm text-gray-300">
                📍 {metadata.city ? `${metadata.city}, ` : ''}{metadata.country}
              </span>

              {metadata.region && (
                <span className="text-sm text-gray-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  {metadata.region.value}
                </span>
              )}

              {author && (
                <span className="text-sm text-gray-300">
                  by {author.metadata?.name || author.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}