import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/cosmic';
import type { BlogPost } from '@/types';

// Changed: Define search result type for API response
interface SearchFilters {
  region?: string;
  rating?: string;
  tag?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const region = searchParams.get('region') ?? '';
  const rating = searchParams.get('rating') ?? '';
  const tag = searchParams.get('tag') ?? '';

  try {
    // Changed: Fetch posts from Cosmic with text search
    let posts = await searchPosts(query || undefined);

    // Changed: Apply client-side filters for region, rating, and tags
    if (region) {
      posts = posts.filter(
        (post: BlogPost) => post.metadata.region?.key === region
      );
    }

    if (rating) {
      posts = posts.filter(
        (post: BlogPost) => post.metadata.rating?.key === rating
      );
    }

    if (tag) {
      posts = posts.filter(
        (post: BlogPost) =>
          post.metadata.tags && post.metadata.tags.includes(tag)
      );
    }

    return NextResponse.json({
      posts,
      total: posts.length,
      filters: { region, rating, tag } as SearchFilters,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { posts: [], total: 0, error: 'Search failed' },
      { status: 500 }
    );
  }
}