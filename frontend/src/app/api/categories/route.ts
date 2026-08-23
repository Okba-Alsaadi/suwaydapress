import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL!;
const API_TOKEN = process.env.STRAPI_API_TOKEN!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') || 'ar';

  // Only parent categories (parent null), sorted by order then name
  let url = `${STRAPI_URL}/api/categories?filters[parent][$null]=true&fields=id,name,slug&locale=${locale}&sort=order:asc,name:asc&pagination[limit]=100`;
  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    // Fallback: no locale filter
    url = `${STRAPI_URL}/api/categories?filters[parent][$null]=true&fields=id,name,slug&sort=order:asc,name:asc&pagination[limit]=100`;
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    if (!res.ok) {
      const text = await res.text();
      console.error('Categories API error response:', text);
      return NextResponse.json(
        { error: `Strapi error: ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}