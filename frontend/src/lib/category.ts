import { fetchAPI } from './strapi';
import { Article, Category } from '@/types/strapi';

export async function translateArticleCategories(
  articles: Article[],
  targetLocale: string
): Promise<Article[]> {
  if (!articles.length) return articles;

  // unique slugs
  const categorySlugs = Array.from(
    new Set(articles.map(a => a.category?.slug).filter(Boolean) as string[])
  );

  if (categorySlugs.length === 0) return articles;

  const slugsQuery = categorySlugs.map(s => `filters[slug][$in][]=${s}`).join('&');
  const categoriesRes = await fetchAPI<{ data: Category[] }>(
    `/categories?${slugsQuery}&locale=${targetLocale}`
  );
  const translatedCategories = categoriesRes.data || [];

  const categoryMap = new Map(translatedCategories.map(c => [c.slug, c]));

  return articles.map(article => {
    if (!article.category) return article;
    const translated = categoryMap.get(article.category.slug);
    if (translated) {
      return { ...article, category: translated };
    }
    return article;
  });
}

