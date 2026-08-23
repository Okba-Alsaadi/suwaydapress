import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL!;
const API_TOKEN = process.env.STRAPI_API_TOKEN!;

export async function GET() {
  const now = new Date().toISOString();
  const url = `${STRAPI_URL}/api/articles?filters[breaking][$eq]=true&filters[breaking_until][$gte]=${now}&sort=breaking_until:desc&populate=*`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Strapi error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Breaking API error:', error);
    return NextResponse.json({ error: 'Failed to fetch breaking articles' }, { status: 500 });
  }
}