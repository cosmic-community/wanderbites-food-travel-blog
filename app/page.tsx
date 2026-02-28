import { getAllPosts, getAllCategories, getAllAuthors } from '@/lib/cosmic';
import PostCard from '@/components/PostCard';
import FeaturedPost from '@/components/FeaturedPost';
import AuthorCard from '@/components/AuthorCard';
import Link from 'next/link';

export default async function HomePage() {
  const [posts, categories, authors] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllAuthors(),
  ]);

  // Separate featured and regular posts
  const featuredPost = posts.find(
    (p) => p.metadata.post_status?.key === 'featured'
  );
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero: Featured Post */}
      {featuredPost && <FeaturedPost post={featuredPost} />}

      {/* All Posts Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-charcoal-900">
            Latest Stories
          </h2>
          <span className="text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🍽️</span>
            <h3 className="text-xl font-semibold text-charcoal-800 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-500">
              Check back soon — we&apos;re out eating somewhere.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredPost ? regularPosts : posts).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {/* Show featured post in grid too if it's the only post */}
            {featuredPost && regularPosts.length === 0 && (
              <PostCard post={featuredPost} />
            )}
          </div>
        )}
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section id="categories" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-8">
            Explore Cuisines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="relative group rounded-xl overflow-hidden aspect-[16/9] shadow-md post-card-hover"
              >
                {category.metadata.image ? (
                  <img
                    src={`${category.metadata.image.imgix_url}?w=600&h=340&fit=crop&auto=format,compress`}
                    alt={category.metadata.name}
                    width={300}
                    height={170}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-terracotta-400 to-terracotta-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">
                    {category.metadata.name}
                  </h3>
                  {category.metadata.description && (
                    <p className="text-xs text-gray-200 line-clamp-1 mt-1">
                      {category.metadata.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Authors Section */}
      {authors.length > 0 && (
        <section id="authors" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-8">
            Our Writers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}