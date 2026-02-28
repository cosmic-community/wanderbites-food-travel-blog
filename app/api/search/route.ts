import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/cosmic';
import type { BlogPost } from '@/types';

interface SearchFilters {
  region?: string;
  rating?: string;
  tag?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const region = searchParams.get('region') || '';
  const rating = searchParams.get('rating') || '';
  const tag = searchParams.get('tag') || '';

  try {
    let posts = await searchPosts(query);

    // Apply filters
    if (region) {
      posts = posts.filter(
        (post) => post.metadata.region?.key === region
      );
    }

    if (rating) {
      posts = posts.filter(
        (post) => post.metadata.rating?.key === rating
      );
    }

    if (tag) {
      posts = posts.filter(
        (post) =>
          post.metadata.tags &&
          post.metadata.tags.some(
            (t) => t.toLowerCase() === tag.toLowerCase()
          )
      );
    }

    return NextResponse.json({ posts, total: posts.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ posts: [], total: 0 }, { status: 500 });
  }
}