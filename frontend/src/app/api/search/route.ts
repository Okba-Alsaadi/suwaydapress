import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL!;
const API_TOKEN = process.env.STRAPI_API_TOKEN!;

// Helper to get child category slugs for a given parent slug
async function getChildCategorySlugs(parentSlug: string, locale: string): Promise<string[]> {
  const url = `${STRAPI_URL}/api/categories?filters[parent][slug][$eq]=${parentSlug}&fields=slug&locale=${locale}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.map((cat: any) => cat.slug) || [];
  } catch (e) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const author = searchParams.get('author');
  const tag = searchParams.get('tag');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');
  const locale = searchParams.get('locale') || 'ar';

  const url = new URL(`${STRAPI_URL}/api/articles`);
  url.searchParams.set('populate', '*');
  url.searchParams.set('sort', 'publishedAt:desc');
  url.searchParams.set('pagination[page]', page.toString());
  url.searchParams.set('pagination[pageSize]', pageSize.toString());

  if (query) {
    url.searchParams.set('filters[$or][0][title][$containsi]', query);
    url.searchParams.set('filters[$or][1][tags][name][$containsi]', query);
  }

  // Category filter – include parent and all children
  if (category) {
    const childSlugs = await getChildCategorySlugs(category, locale);
    const allSlugs = [category, ...childSlugs];
    allSlugs.forEach((slug, index) => {
      url.searchParams.set(`filters[category][slug][$in][${index}]`, slug);
    });
  }

  if (author) {
    url.searchParams.set('filters[author][slug][$eq]', author);
  }
  if (tag) {
    url.searchParams.set('filters[tags][slug][$eq]', tag);
  }
  if (fromDate) {
    url.searchParams.set('filters[publishedAt][$gte]', fromDate);
  }
  if (toDate) {
    url.searchParams.set('filters[publishedAt][$lte]', toDate);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Strapi error response:', text);
      return NextResponse.json(
        { error: `Strapi error: ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}