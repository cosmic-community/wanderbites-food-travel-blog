interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ratingLabels: Record<number, string> = {
  1: 'Skip It',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Must Visit',
};

export default function RatingStars({ rating, size = 'md', showLabel = false }: RatingStarsProps) {
  const sizeClass = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <svg
            key={index}
            className={`${sizeClass} ${
              index < rating ? 'text-amber-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
      {showLabel && ratingLabels[rating] && (
        <span className="text-sm font-medium text-charcoal-700">
          {ratingLabels[rating]}
        </span>
      )}
    </div>
  );
}