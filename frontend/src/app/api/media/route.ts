import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL!;
const API_TOKEN = process.env.STRAPI_API_TOKEN!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ids = searchParams.get('ids');

  if (!ids) {
    return NextResponse.json({ data: [] });
  }

  const idArray = ids.split(',').map(id => id.trim());
  const url = `${STRAPI_URL}/api/upload/files?filters[id][$in]=${idArray.join(',')}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch media');
    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Media API error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}