import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden="true">🍜</span>
              <span className="text-xl font-bold text-white">Wanderbites</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Stories from kitchens, markets, and tables around the world.
              Because the best way to know a place is to eat there.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-terracotta-400 transition-colors">
                  Latest Stories
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-gray-300 hover:text-terracotta-400 transition-colors">
                  Cuisines
                </Link>
              </li>
              <li>
                <Link href="/#authors" className="text-gray-300 hover:text-terracotta-400 transition-colors">
                  Our Writers
                </Link>
              </li>
              {/* Changed: Added Contact link to footer */}
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-terracotta-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Regions
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">🌏 Asia</li>
              <li className="text-gray-300">🌍 Europe</li>
              <li className="text-gray-300">🌎 Americas</li>
              <li className="text-gray-300">🌍 Middle East & Africa</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Wanderbites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}