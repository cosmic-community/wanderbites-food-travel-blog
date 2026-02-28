'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Changed: Created SearchBar component with real-time dropdown results

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  metadata: {
    excerpt?: string;
    featured_image?: { imgix_url: string };
    city?: string;
    country?: string;
  };
}

interface SearchBarProps {
  variant?: 'header' | 'page';
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ variant = 'header', initialQuery = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Debounced fetch for dropdown preview
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json() as { posts: SearchResult[] };
      setResults(data.posts.slice(0, 5));
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (variant === 'header') {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        void fetchResults(query);
      }, 300);

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }
  }, [query, fetchResults, variant]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  if (variant === 'page') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) {
                onSearch(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search stories, cities, cuisines, tags…"
            className="w-full pl-12 pr-4 py-4 text-lg bg-white border border-cream-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500 transition-all text-charcoal-800 placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (onSearch) {
                  onSearch('');
                }
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </form>
    );
  }

  // Header variant with dropdown
  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search…"
            className="w-40 sm:w-52 pl-9 pr-3 py-1.5 text-sm bg-cream-100 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 focus:bg-white focus:w-64 transition-all text-charcoal-800 placeholder-gray-400"
          />
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-xl border border-cream-200 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              <span className="animate-pulse">Searching…</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <ul className="divide-y divide-cream-100">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link
                      href={`/posts/${result.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-cream-50 transition-colors"
                    >
                      {result.metadata.featured_image && (
                        <img
                          src={`${result.metadata.featured_image.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                          alt={result.title}
                          width={60}
                          height={40}
                          className="w-14 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-charcoal-800 truncate">
                          {result.title}
                        </p>
                        {(result.metadata.city || result.metadata.country) && (
                          <p className="text-xs text-gray-500 truncate">
                            📍 {result.metadata.city ? `${result.metadata.city}, ` : ''}
                            {result.metadata.country}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-medium text-terracotta-500 hover:text-terracotta-700 py-3 bg-cream-50 border-t border-cream-200 transition-colors"
              >
                View all results →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}