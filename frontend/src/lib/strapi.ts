const STRAPI_URL = process.env.STRAPI_URL!;
const API_TOKEN = process.env.STRAPI_API_TOKEN!;

export async function fetchAPI<T = any>(
  path: string,
  options: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: options.revalidate ?? 60 },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Strapi fetch error: ${res.status} ${res.statusText}: ${text}`
    );
  }

  return res.json();
}