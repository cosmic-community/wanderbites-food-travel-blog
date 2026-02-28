import { createBucketClient } from '@cosmicjs/sdk';
import type { BlogPost, Author, Category } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging',
});

// Helper for 404 handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    const posts = response.objects as BlogPost[];

    // Sort by publication date descending
    return posts.sort((a, b) => {
      const dateA = new Date(a.metadata.publication_date || '').getTime();
      const dateB = new Date(b.metadata.publication_date || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blog posts');
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'blog-posts', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    return response.object as BlogPost;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch blog post');
  }
}

// Fetch all authors
export async function getAllAuthors(): Promise<Author[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    return response.objects as Author[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch authors');
  }
}

// Fetch a single author by slug
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'authors', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    return response.object as Author;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch author');
  }
}

// Fetch posts by author id
export async function getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-posts', 'metadata.author': authorId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    const posts = response.objects as BlogPost[];
    return posts.sort((a, b) => {
      const dateA = new Date(a.metadata.publication_date || '').getTime();
      const dateB = new Date(b.metadata.publication_date || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch posts by author');
  }
}

// Fetch all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    return response.objects as Category[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Fetch a single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    return response.object as Category;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch category');
  }
}

// Fetch posts by category id
export async function getPostsByCategory(categoryId: string): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-posts', 'metadata.categories': categoryId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    const posts = response.objects as BlogPost[];
    return posts.sort((a, b) => {
      const dateA = new Date(a.metadata.publication_date || '').getTime();
      const dateB = new Date(b.metadata.publication_date || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch posts by category');
  }
}

// Changed: Added searchPosts function for search feature
export async function searchPosts(query?: string): Promise<BlogPost[]> {
  try {
    const findQuery: Record<string, unknown> = { type: 'blog-posts' };

    // Changed: Use Cosmic search_text for text-based search
    if (query && query.trim().length > 0) {
      findQuery['$or'] = [
        { title: { $regex: query, $options: 'i' } },
        { 'metadata.excerpt': { $regex: query, $options: 'i' } },
        { 'metadata.city': { $regex: query, $options: 'i' } },
        { 'metadata.country': { $regex: query, $options: 'i' } },
      ];
    }

    const response = await cosmic.objects
      .find(findQuery)
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);

    const posts = response.objects as BlogPost[];

    return posts.sort((a, b) => {
      const dateA = new Date(a.metadata.publication_date || '').getTime();
      const dateB = new Date(b.metadata.publication_date || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to search posts');
  }
}