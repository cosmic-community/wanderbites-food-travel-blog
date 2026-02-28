// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/cosmic';
import RatingStars from '@/components/RatingStars';
import TagBadge from '@/components/TagBadge';
import PhotoGallery from '@/components/PhotoGallery';
import MarkdownContent from '@/components/MarkdownContent';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found — Wanderbites' };
  }

  return {
    title: post.metadata.meta_title || `${post.title} — Wanderbites`,
    description:
      post.metadata.meta_description || post.metadata.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { metadata } = post;
  const ratingNum = parseInt(metadata.rating?.key || '0', 10);
  const author = metadata.author;
  const categories = metadata.categories;
  const publicationDate = metadata.publication_date
    ? new Date(metadata.publication_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Fetch related posts (all posts except current)
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-terracotta-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-charcoal-700">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-terracotta-500 hover:text-terracotta-700 transition-colors"
              >
                {cat.metadata?.name || cat.title}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
          {metadata.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <RatingStars rating={ratingNum} size="md" showLabel />

          <span className="text-sm text-gray-500">
            📍 {metadata.city ? `${metadata.city}, ` : ''}
            {metadata.country}
          </span>

          {metadata.region && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {metadata.region.value}
            </span>
          )}
        </div>

        {/* Tags */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {metadata.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Author & Date */}
        <div className="flex items-center justify-between py-4 border-y border-gray-200">
          {author && (
            <Link
              href={`/authors/${author.slug}`}
              className="flex items-center gap-3 group"
            >
              {author.metadata?.avatar && (
                <img
                  src={`${author.metadata.avatar.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                  alt={author.metadata?.name || author.title}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-charcoal-800 group-hover:text-terracotta-500 transition-colors">
                  {author.metadata?.name || author.title}
                </p>
                {author.metadata?.home_base && (
                  <p className="text-xs text-gray-500">
                    {author.metadata.home_base}
                  </p>
                )}
              </div>
            </Link>
          )}
          <div className="text-right text-sm text-gray-500">
            {publicationDate && <p>{publicationDate}</p>}
            {metadata.reading_time && (
              <p className="text-xs">{metadata.reading_time} min read</p>
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="rounded-xl overflow-hidden mb-10">
        <img
          src={`${metadata.featured_image.imgix_url}?w=1600&h=800&fit=crop&auto=format,compress`}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-auto"
        />
      </div>

      {/* Content */}
      <div className="mb-12">
        <MarkdownContent content={metadata.content} />
      </div>

      {/* Photo Gallery */}
      {metadata.gallery && metadata.gallery.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4">
            📸 Photo Gallery
          </h2>
          <PhotoGallery images={metadata.gallery} title={post.title} />
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6">
            More Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/posts/${relatedPost.slug}`}
                className="flex gap-4 group"
              >
                <img
                  src={`${relatedPost.metadata.featured_image.imgix_url}?w=300&h=200&fit=crop&auto=format,compress`}
                  alt={relatedPost.title}
                  width={120}
                  height={80}
                  className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-charcoal-800 group-hover:text-terracotta-500 transition-colors line-clamp-2 leading-snug">
                    {relatedPost.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {relatedPost.metadata.city ? `${relatedPost.metadata.city}, ` : ''}
                    {relatedPost.metadata.country}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}