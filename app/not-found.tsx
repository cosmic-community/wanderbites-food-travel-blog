import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <span className="text-6xl mb-6 block">🗺️</span>
      <h1 className="text-4xl font-extrabold text-charcoal-900 mb-4">
        Lost in Translation
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        We couldn&apos;t find what you&apos;re looking for. Maybe the page
        wandered off to try street food somewhere.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        ← Back to Stories
      </Link>
    </div>
  );
}