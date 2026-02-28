'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  variant?: 'default' | 'compact';
}

export default function SearchBar({
  initialQuery = '',
  placeholder = 'Search posts, cities, cuisines…',
  onSearch,
  autoFocus = false,
  variant = 'default',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Changed: Debounced search callback
  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (onSearch) {
          onSearch(value);
        }
      }, 300);
    },
    [onSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (onSearch) {
        onSearch(query);
      } else {
        // Navigate to search page
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    },
    [query, onSearch, router]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  }, [onSearch]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const isCompact = variant === 'compact';

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        {/* Search icon */}
        <div className={`absolute left-0 top-0 bottom-0 flex items-center ${isCompact ? 'pl-3' : 'pl-4'}`}>
          <svg
            className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`}
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
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white border border-cream-300 rounded-full text-charcoal-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all ${
            isCompact
              ? 'pl-9 pr-8 py-2 text-sm'
              : 'pl-12 pr-12 py-3 text-base'
          }`}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-0 top-0 bottom-0 flex items-center ${isCompact ? 'pr-3' : 'pr-4'} text-gray-400 hover:text-gray-600 transition-colors`}
            aria-label="Clear search"
          >
            <svg
              className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}