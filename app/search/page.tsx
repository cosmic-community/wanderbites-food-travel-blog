import type { Metadata } from 'next';
import SearchResults from '@/components/SearchResults';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search — Wanderbites',
  description: 'Search food travel stories by city, country, cuisine, author, and more.',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    region?: string;
    rating?: string;
    tag?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Changed: In Next.js 16, searchParams is a Promise and must be awaited
  const params = await searchParams;
  const query = params.q || '';
  const region = params.region || '';
  const rating = params.rating || '';
  const tag = params.tag || '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-terracotta-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-charcoal-800 font-medium">Search</span>
      </nav>

      <h1 className="text-3xl font-bold text-charcoal-900 mb-6">
        Search Stories
      </h1>

      <SearchResults
        initialQuery={query}
        initialRegion={region}
        initialRating={rating}
        initialTag={tag}
      />
    </div>
  );
}