import { NextRequest, NextResponse } from 'next/server';
import { searchPosts, getAllCategories } from '@/lib/cosmic';
import type { BlogPost, Category } from '@/types';

// Changed: Created search API route for real-time search results
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || '';
  const region = searchParams.get('region') || '';

  try {
    let posts: BlogPost[] = await searchPosts(query);

    // Filter by category if provided
    if (categorySlug) {
      posts = posts.filter((post) => {
        const categories = post.metadata.categories || [];
        return categories.some((cat) => cat.slug === categorySlug);
      });
    }

    // Filter by region if provided
    if (region) {
      posts = posts.filter((post) => {
        const postRegion = post.metadata.region?.value || '';
        return postRegion.toLowerCase() === region.toLowerCase();
      });
    }

    // Fetch all categories for filter options
    const categories: Category[] = await getAllCategories();

    // Extract unique regions from all posts for filter options
    const allPosts = await searchPosts('');
    const regions: string[] = Array.from(
      new Set(
        allPosts
          .map((p) => p.metadata.region?.value)
          .filter((r): r is string => Boolean(r))
      )
    ).sort();

    return NextResponse.json({
      posts,
      totalResults: posts.length,
      filters: {
        categories: categories.map((c) => ({
          slug: c.slug,
          name: c.metadata.name,
        })),
        regions,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { posts: [], totalResults: 0, filters: { categories: [], regions: [] } },
      { status: 500 }
    );
  }
}