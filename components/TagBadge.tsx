interface TagBadgeProps {
  tag: string;
  variant?: 'default' | 'outline';
}

const tagColors: Record<string, string> = {
  'Street Food': 'bg-orange-100 text-orange-800',
  'Fine Dining': 'bg-purple-100 text-purple-800',
  'Budget Eats': 'bg-green-100 text-green-800',
  'Hidden Gems': 'bg-indigo-100 text-indigo-800',
  'Michelin Star': 'bg-yellow-100 text-yellow-800',
  'Vegetarian Friendly': 'bg-emerald-100 text-emerald-800',
  'Local Favorite': 'bg-rose-100 text-rose-800',
  'Night Market': 'bg-blue-100 text-blue-800',
  'Cooking Class': 'bg-teal-100 text-teal-800',
  'Food Tour': 'bg-cyan-100 text-cyan-800',
};

export default function TagBadge({ tag, variant = 'default' }: TagBadgeProps) {
  if (variant === 'outline') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-charcoal-700">
        {tag}
      </span>
    );
  }

  const colorClass = tagColors[tag] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {tag}
    </span>
  );
}