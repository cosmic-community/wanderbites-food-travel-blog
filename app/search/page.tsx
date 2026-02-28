import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

// Changed: Created dedicated search page with filters

export const metadata: Metadata = {
  title: 'Search — Wanderbites',
  description: 'Search food travel stories, cities, cuisines, and more on Wanderbites.',
};

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-terracotta-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-charcoal-700">Search</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mb-2">
          Search Stories
        </h1>
        <p className="text-gray-500">
          Find food travel stories by title, city, country, cuisine, tags, or author.
        </p>
      </div>

      {/* Search Results (client component with Suspense for useSearchParams) */}
      <Suspense
        fallback={
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block animate-pulse">🔍</span>
            <p className="text-gray-500">Loading search…</p>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}