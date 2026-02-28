// app/authors/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAuthorBySlug, getPostsByAuthor } from '@/lib/cosmic';
import PostCard from '@/components/PostCard';
import MarkdownContent from '@/components/MarkdownContent';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: 'Author Not Found — Wanderbites' };
  }

  return {
    title: `${author.metadata.name} — Wanderbites`,
    description: author.metadata.short_bio,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = await getPostsByAuthor(author.id);
  const { metadata } = author;

  const socialLinks = [
    { label: 'Instagram', url: metadata.instagram_url, icon: '📷' },
    { label: 'Twitter', url: metadata.twitter_url, icon: '🐦' },
    { label: 'YouTube', url: metadata.youtube_url, icon: '🎬' },
    { label: 'Website', url: metadata.website_url, icon: '🌐' },
  ].filter((link) => link.url);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-terracotta-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-charcoal-700">{metadata.name}</span>
      </nav>

      {/* Author Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 mb-12">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {metadata.avatar && (
            <img
              src={`${metadata.avatar.imgix_url}?w=320&h=320&fit=crop&auto=format,compress`}
              alt={metadata.name}
              width={160}
              height={160}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover flex-shrink-0 shadow-md"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mb-2">
              {metadata.name}
            </h1>
            {metadata.home_base && (
              <p className="text-sm text-gray-500 mb-3">
                📍 {metadata.home_base}
              </p>
            )}
            <p className="text-gray-700 leading-relaxed mb-4">
              {metadata.short_bio}
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-terracotta-500 transition-colors bg-gray-50 px-3 py-1.5 rounded-full"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Extended Bio */}
        {metadata.extended_bio && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <MarkdownContent content={metadata.extended_bio} />
          </div>
        )}
      </div>

      {/* Author's Posts */}
      <section>
        <h2 className="text-2xl font-bold text-charcoal-900 mb-6">
          Stories by {metadata.name}
          <span className="text-base font-normal text-gray-500 ml-2">
            ({posts.length})
          </span>
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <span className="text-4xl block mb-3">✍️</span>
            <p className="text-gray-500">No stories published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}