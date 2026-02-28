'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import type { BlogPost } from '@/types';

// Changed: Created SearchResults component with filters for the search page

interface FilterOption {
  slug: string;
  name: string;
}

interface SearchResponse {
  posts: BlogPost[];
  totalResults: number;
  filters: {
    categories: FilterOption[];
    regions: string[];
  };
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialRegion = searchParams.get('region') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);
  const [results, setResults] = useState<BlogPost[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSearchResults = useCallback(async (q: string, cat: string, reg: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (cat) params.set('category', cat);
      if (reg) params.set('region', reg);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = (await res.json()) as SearchResponse;

      setResults(data.posts);
      setTotalResults(data.totalResults);
      setCategories(data.filters.categories);
      setRegions(data.filters.regions);
    } catch {
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and when filters change
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      void fetchSearchResults(query, category, region);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, category, region, fetchSearchResults]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (region) params.set('region', region);
    const paramString = params.toString();
    const newUrl = paramString ? `/search?${paramString}` : '/search';
    router.replace(newUrl, { scroll: false });
  }, [query, category, region, router]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const clearFilters = () => {
    setCategory('');
    setRegion('');
  };

  const hasActiveFilters = category || region;

  return (
    <div>
      {/* Search Input */}
      <div className="mb-8">
        <SearchBar variant="page" initialQuery={query} onSearch={handleSearch} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-sm font-medium text-charcoal-700">Filter by:</span>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-sm bg-white border border-cream-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 text-charcoal-800 cursor-pointer"
        >
          <option value="">All Cuisines</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Region Filter */}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="text-sm bg-white border border-cream-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 text-charcoal-800 cursor-pointer"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-terracotta-500 hover:text-terracotta-700 font-medium transition-colors"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {isLoading ? (
            <span className="animate-pulse">Searching…</span>
          ) : (
            <>
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
              {query && (
                <span>
                  {' '}for &ldquo;<span className="font-medium text-charcoal-800">{query}</span>&rdquo;
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
            >
              <div className="aspect-[16/10] bg-cream-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-cream-200 rounded w-1/3" />
                <div className="h-5 bg-cream-200 rounded w-3/4" />
                <div className="h-3 bg-cream-200 rounded w-full" />
                <div className="h-3 bg-cream-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold text-charcoal-800 mb-2">
            {query ? 'No stories found' : 'Start exploring'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {query
              ? `We couldn't find any stories matching "${query}". Try a different search or adjust your filters.`
              : 'Type a search term above to discover food travel stories from around the world.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-terracotta-500 hover:text-terracotta-700 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}