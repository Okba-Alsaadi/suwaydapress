import { fetchAPI } from './strapi';
import { Article, Author } from '@/types/strapi';

export async function translateArticleAuthors(
  articles: Article[],
  targetLocale: string
): Promise<Article[]> {
  if (!articles.length || targetLocale === 'ar') return articles;

  const authorSlugs = Array.from(
    new Set(articles.map(a => a.author?.slug).filter(Boolean) as string[])
  );

  if (authorSlugs.length === 0) return articles;

  const slugsQuery = authorSlugs.map(s => `filters[slug][$in][]=${s}`).join('&');
  const authorsRes = await fetchAPI<{ data: Author[] }>(
    `/authors?${slugsQuery}&locale=${targetLocale}`
  );
  const translatedAuthors = authorsRes.data || [];

  const authorMap = new Map(translatedAuthors.map(a => [a.slug, a]));

  return articles.map(article => {
    if (!article.author) return article;
    const translated = authorMap.get(article.author.slug);
    if (translated) {
      return { ...article, author: translated };
    }
    return article;
  });
}