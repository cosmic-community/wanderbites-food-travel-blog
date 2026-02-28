'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import SearchBar from '@/components/SearchBar';
import RatingStars from '@/components/RatingStars';
import TagBadge from '@/components/TagBadge';

// Changed: Filter options based on Cosmic content model
const REGION_OPTIONS = [
  { key: '', label: 'All Regions' },
  { key: 'asia', label: 'Asia' },
  { key: 'europe', label: 'Europe' },
  { key: 'north-america', label: 'North America' },
  { key: 'south-america', label: 'South America' },
  { key: 'africa', label: 'Africa' },
  { key: 'middle-east', label: 'Middle East' },
  { key: 'oceania', label: 'Oceania' },
];

const RATING_OPTIONS = [
  { key: '', label: 'All Ratings' },
  { key: '5', label: '5 — Must Visit' },
  { key: '4', label: '4 — Great' },
  { key: '3', label: '3 — Good' },
  { key: '2', label: '2 — Fair' },
  { key: '1', label: '1 — Skip It' },
];

const TAG_OPTIONS = [
  'Street Food',
  'Fine Dining',
  'Budget Eats',
  'Hidden Gems',
  'Michelin Star',
  'Vegetarian Friendly',
  'Local Favorite',
  'Night Market',
  'Cooking Class',
  'Food Tour',
];

interface SearchResultsProps {
  initialQuery?: string;
  initialRegion?: string;
  initialRating?: string;
  initialTag?: string;
}

export default function SearchResults({
  initialQuery = '',
  initialRegion = '',
  initialRating = '',
  initialTag = '',
}: SearchResultsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(initialQuery);
  const [region, setRegion] = useState<string>(initialRegion);
  const [rating, setRating] = useState<string>(initialRating);
  const [tag, setTag] = useState<string>(initialTag);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Changed: Fetch search results from API
  const fetchResults = useCallback(async (q: string, r: string, rt: string, t: string) => {
    setLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (r) params.set('region', r);
      if (rt) params.set('rating', rt);
      if (t) params.set('tag', t);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json() as { posts: BlogPost[]; total: number };

      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Search failed:', error);
      setPosts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search on initial load if there are params
  useEffect(() => {
    if (initialQuery || initialRegion || initialRating || initialTag) {
      fetchResults(initialQuery, initialRegion, initialRating, initialTag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      fetchResults(newQuery, region, rating, tag);
    },
    [region, rating, tag, fetchResults]
  );

  const handleRegionChange = useCallback(
    (newRegion: string) => {
      setRegion(newRegion);
      fetchResults(query, newRegion, rating, tag);
    },
    [query, rating, tag, fetchResults]
  );

  const handleRatingChange = useCallback(
    (newRating: string) => {
      setRating(newRating);
      fetchResults(query, region, newRating, tag);
    },
    [query, region, tag, fetchResults]
  );

  const handleTagChange = useCallback(
    (newTag: string) => {
      const updatedTag = tag === newTag ? '' : newTag;
      setTag(updatedTag);
      fetchResults(query, region, rating, updatedTag);
    },
    [query, region, rating, tag, fetchResults]
  );

  const handleClearFilters = useCallback(() => {
    setRegion('');
    setRating('');
    setTag('');
    fetchResults(query, '', '', '');
  }, [query, fetchResults]);

  const hasActiveFilters = region || rating || tag;

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6">
        <SearchBar
          initialQuery={initialQuery}
          onSearch={handleSearch}
          autoFocus
          placeholder="Search by title, city, country, cuisine, author…"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Region & Rating dropdowns */}
        <div className="flex flex-wrap gap-3">
          <select
            value={region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="bg-white border border-cream-300 rounded-lg px-3 py-2 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
          >
            {REGION_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(e) => handleRatingChange(e.target.value)}
            className="bg-white border border-cream-300 rounded-lg px-3 py-2 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
          >
            {RATING_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-terracotta-500 hover:text-terracotta-700 font-medium transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Tags filter */}
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => handleTagChange(t)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                tag === t
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-white border border-cream-300 text-charcoal-700 hover:border-terracotta-300 hover:text-terracotta-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-gray-500">
            <svg className="animate-spin w-5 h-5 text-terracotta-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">Searching…</span>
          </div>
        </div>
      ) : hasSearched ? (
        <div>
          {/* Result count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {total === 0
                ? 'No results found'
                : `${total} ${total === 1 ? 'result' : 'results'} found`}
              {query && (
                <span>
                  {' '}for &ldquo;<span className="font-medium text-charcoal-800">{query}</span>&rdquo;
                </span>
              )}
            </p>
          </div>

          {total === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">
                No stories found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search terms or clearing filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <SearchResultCard key={post.id} post={post} query={query} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">🌍</span>
          <h3 className="text-xl font-semibold text-charcoal-800 mb-2">
            Explore food stories
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Search by city, country, cuisine type, or any keyword to discover food travel stories.
          </p>
        </div>
      )}
    </div>
  );
}

// Changed: Search result card with horizontal layout
function SearchResultCard({ post, query }: { post: BlogPost; query: string }) {
  const { metadata } = post;
  const ratingNum = parseInt(metadata.rating?.key || '0', 10);
  const author = metadata.author;

  const publicationDate = metadata.publication_date
    ? new Date(metadata.publication_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="flex gap-4 sm:gap-5 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group p-3 sm:p-4"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden">
        <img
          src={`${metadata.featured_image.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
          alt={post.title}
          width={144}
          height={144}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Categories */}
          {metadata.categories && metadata.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {metadata.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-xs font-semibold text-terracotta-500 uppercase tracking-wider"
                >
                  {cat.metadata?.name || cat.title}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-base sm:text-lg font-bold text-charcoal-900 group-hover:text-terracotta-500 transition-colors leading-snug mb-1 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2 hidden sm:block">
            {metadata.excerpt}
          </p>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <RatingStars rating={ratingNum} size="sm" />

          <span className="text-xs text-gray-500">
            📍 {metadata.city ? `${metadata.city}, ` : ''}
            {metadata.country}
          </span>

          {metadata.tags && metadata.tags.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1">
              {metadata.tags.slice(0, 2).map((t) => (
                <TagBadge key={t} tag={t} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400 ml-auto">
            {author && (
              <span className="hidden sm:inline">
                {author.metadata?.name || author.title}
              </span>
            )}
            {publicationDate && (
              <>
                {author && <span className="hidden sm:inline">·</span>}
                <span>{publicationDate}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}