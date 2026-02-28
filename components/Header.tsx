import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

// Changed: Added SearchBar component to header navigation

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl" aria-hidden="true">🍜</span>
            <span className="text-xl font-bold text-charcoal-900 group-hover:text-terracotta-500 transition-colors">
              Wanderbites
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-charcoal-700 hover:text-terracotta-500 transition-colors"
              >
                Stories
              </Link>
              <Link
                href="/#categories"
                className="text-charcoal-700 hover:text-terracotta-500 transition-colors"
              >
                Cuisines
              </Link>
              <Link
                href="/#authors"
                className="text-charcoal-700 hover:text-terracotta-500 transition-colors"
              >
                Writers
              </Link>
            </nav>
            {/* Changed: Added real-time search bar to header */}
            <SearchBar variant="header" />
          </div>
        </div>
      </div>
    </header>
  );
}