'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import RatingStars from '@/components/RatingStars';
import TagBadge from '@/components/TagBadge';

// Changed: Define region options matching the CMS content model
const REGION_OPTIONS = [
  { key: 'asia', label: 'Asia' },
  { key: 'europe', label: 'Europe' },
  { key: 'north-america', label: 'North America' },
  { key: 'south-america', label: 'South America' },
  { key: 'africa', label: 'Africa' },
  { key: 'middle-east', label: 'Middle East' },
  { key: 'oceania', label: 'Oceania' },
];

const RATING_OPTIONS = [
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

interface SearchState {
  posts: BlogPost[];
  total: number;
  loading: boolean;
  error: string | null;
}

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [rating, setRating] = useState('');
  const [tag, setTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [state, setState] = useState<SearchState>({
    posts: [],
    total: 0,
    loading: false,
    error: null,
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasSearched = useRef(false);

  // Changed: Debounced search function
  const performSearch = useCallback(
    async (searchQuery: string, searchRegion: string, searchRating: string, searchTag: string) => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const hasAnyFilter =
        searchQuery.trim().length > 0 ||
        searchRegion.length > 0 ||
        searchRating.length > 0 ||
        searchTag.length > 0;

      if (!hasAnyFilter) {
        setState({ posts: [], total: 0, loading: false, error: null });
        hasSearched.current = false;
        return;
      }

      hasSearched.current = true;
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (searchRegion) params.set('region', searchRegion);
        if (searchRating) params.set('rating', searchRating);
        if (searchTag) params.set('tag', searchTag);

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data = await response.json();

        setState({
          posts: data.posts ?? [],
          total: data.total ?? 0,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return; // Ignore aborted requests
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Something went wrong. Please try again.',
        }));
      }
    },
    []
  );

  // Changed: Debounce text input, immediate for filter changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query, region, rating, tag);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, region, rating, tag, performSearch]);

  // Changed: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearAllFilters = () => {
    setQuery('');
    setRegion('');
    setRating('');
    setTag('');
  };

  const activeFilterCount = [region, rating, tag].filter(Boolean).length;

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by title, city, country, or keyword..."
          className="w-full pl-12 pr-12 py-4 bg-white border border-cream-200 rounded-xl text-charcoal-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent shadow-sm text-base"
          aria-label="Search blog posts"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-charcoal-700 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-charcoal-700 hover:text-terracotta-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-terracotta-500 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {(query || activeFilterCount > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-terracotta-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-cream-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Region Filter */}
            <div>
              <label htmlFor="filter-region" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-2">
                Region
              </label>
              <select
                id="filter-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              >
                <option value="">All Regions</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label htmlFor="filter-rating" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-2">
                Rating
              </label>
              <select
                id="filter-rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              >
                <option value="">Any Rating</option>
                {RATING_OPTIONS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label htmlFor="filter-tag" className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-2">
                Tag
              </label>
              <select
                id="filter-tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              >
                <option value="">All Tags</option>
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-cream-100">
              {region && (
                <button
                  onClick={() => setRegion('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-terracotta-50 text-terracotta-700 text-xs font-medium rounded-full hover:bg-terracotta-100 transition-colors"
                >
                  {REGION_OPTIONS.find((r) => r.key === region)?.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {rating && (
                <button
                  onClick={() => setRating('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full hover:bg-amber-100 transition-colors"
                >
                  {RATING_OPTIONS.find((r) => r.key === rating)?.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {tag && (
                <button
                  onClick={() => setTag('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors"
                >
                  {tag}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <div>
        {/* Loading State */}
        {state.loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <svg className="animate-spin w-5 h-5 text-terracotta-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">Searching...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {state.error && !state.loading && (
          <div className="text-center py-12">
            <span className="text-4xl mb-3 block">⚠️</span>
            <p className="text-sm text-gray-500">{state.error}</p>
          </div>
        )}

        {/* Empty prompt (no search yet) */}
        {!state.loading && !state.error && !hasSearched.current && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-lg font-semibold text-charcoal-800 mb-2">
              Discover your next food adventure
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Search by dish, city, country, or keyword — or use the filters to browse by region, rating, and tags.
            </p>
          </div>
        )}

        {/* No results */}
        {!state.loading && !state.error && hasSearched.current && state.total === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🍽️</span>
            <h3 className="text-lg font-semibold text-charcoal-800 mb-2">
              No stories found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Results count */}
        {!state.loading && hasSearched.current && state.total > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {state.total} {state.total === 1 ? 'story' : 'stories'} found
          </p>
        )}

        {/* Results Grid */}
        {!state.loading && state.posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.posts.map((post) => (
              <SearchResultCard key={post.id} post={post} query={query} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Changed: Separate result card component with query highlighting
interface SearchResultCardProps {
  post: BlogPost;
  query: string;
}

function SearchResultCard({ post, query }: SearchResultCardProps) {
  const { metadata } = post;
  const ratingNum = parseInt(metadata.rating?.key || '0', 10);
  const author = metadata.author;
  const publicationDate = metadata.publication_date
    ? new Date(metadata.publication_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Changed: Simple text highlighting
  function highlightText(text: string): React.ReactNode {
    if (!query || query.trim().length === 0) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-charcoal-900 rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

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
        {metadata.categories && metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {metadata.categories.map((cat) => (
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
            {highlightText(post.title)}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
          {highlightText(metadata.excerpt)}
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
            {metadata.tags.slice(0, 3).map((tagName) => (
              <TagBadge key={tagName} tag={tagName} />
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