import type { Metadata } from 'next';
import SearchClient from '@/components/SearchClient';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search — Wanderbites',
  description: 'Search food travel stories by dish, city, country, region, rating, and more.',
};

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-terracotta-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-charcoal-800 font-medium">Search</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 mb-2">
          Search Stories
        </h1>
        <p className="text-gray-500">
          Find your next culinary adventure — search by dish, city, country, or browse with filters.
        </p>
      </div>

      {/* Search Interface */}
      <SearchClient />
    </div>
  );
}