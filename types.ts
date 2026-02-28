// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at?: string;
  modified_at?: string;
}

// File metafield
export interface CosmicImage {
  url: string;
  imgix_url: string;
}

// Select dropdown value
export interface SelectDropdown {
  key: string;
  value: string;
}

// Author type
export interface Author extends CosmicObject {
  type: 'authors';
  metadata: {
    name: string;
    avatar?: CosmicImage;
    short_bio: string;
    extended_bio?: string;
    home_base?: string;
    instagram_url?: string;
    twitter_url?: string;
    youtube_url?: string;
    website_url?: string;
  };
}

// Category type
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
    image?: CosmicImage;
    parent_category?: Category | string;
    display_order?: number;
  };
}

// Blog Post type
export interface BlogPost extends CosmicObject {
  type: 'blog-posts';
  metadata: {
    excerpt: string;
    featured_image: CosmicImage;
    gallery?: CosmicImage[];
    content: string;
    publication_date: string;
    reading_time?: number;
    city?: string;
    country: string;
    region?: SelectDropdown;
    rating: SelectDropdown;
    post_status?: SelectDropdown;
    tags?: string[];
    author: Author;
    categories: Category[];
    meta_title?: string;
    meta_description?: string;
  };
}

// Region type literals matching content model
export type RegionKey = 'asia' | 'europe' | 'north-america' | 'south-america' | 'africa' | 'middle-east' | 'oceania';

// Rating type literals matching content model
export type RatingKey = '1' | '2' | '3' | '4' | '5';

// Post status type literals matching content model
export type PostStatusKey = 'draft' | 'published' | 'featured';

// Tag type literals matching content model
export type TagOption =
  | 'Street Food'
  | 'Fine Dining'
  | 'Budget Eats'
  | 'Hidden Gems'
  | 'Michelin Star'
  | 'Vegetarian Friendly'
  | 'Local Favorite'
  | 'Night Market'
  | 'Cooking Class'
  | 'Food Tour';