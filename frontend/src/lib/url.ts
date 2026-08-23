export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}