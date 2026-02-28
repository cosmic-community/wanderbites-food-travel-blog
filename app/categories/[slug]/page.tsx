// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getPostsByCategory } from '@/lib/cosmic';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found — Wanderbites' };
  }

  return {
    title: `${category.metadata.name} — Wanderbites`,
    description:
      category.metadata.description ||
      `Explore ${category.metadata.name} food travel stories on Wanderbites.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(category.id);
  const { metadata } = category;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-terracotta-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/#categories"
          className="hover:text-terracotta-500 transition-colors"
        >
          Cuisines
        </Link>
        <span>/</span>
        <span className="text-charcoal-700">{metadata.name}</span>
      </nav>

      {/* Category Header */}
      <div className="relative rounded-2xl overflow-hidden mb-12">
        {metadata.image ? (
          <img
            src={`${metadata.image.imgix_url}?w=1400&h=400&fit=crop&auto=format,compress`}
            alt={metadata.name}
            width={1400}
            height={400}
            className="w-full h-48 sm:h-64 object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-terracotta-400 to-terracotta-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {metadata.name}
          </h1>
          {metadata.description && (
            <p className="text-gray-200 max-w-2xl leading-relaxed">
              {metadata.description}
            </p>
          )}
        </div>
      </div>

      {/* Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-charcoal-900">
            {metadata.name} Stories
          </h2>
          <span className="text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <span className="text-4xl block mb-3">🍽️</span>
            <p className="text-gray-500">
              No stories in this category yet. Check back soon!
            </p>
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