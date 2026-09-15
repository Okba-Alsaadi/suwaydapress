import { fetchAPI } from '@/lib/strapi';
import { Article, Category, Author, Tag } from '@/types/strapi';

export default async function sitemap() {
  const baseUrl = 'https://www.suwaydapress.news';

  const [articlesRes, categoriesRes, authorsRes, tagsRes] = await Promise.all([
    fetchAPI<{ data: Article[] }>('/articles?fields=slug,publishedAt&sort=publishedAt:desc&locale=en'),
    fetchAPI<{ data: Category[] }>('/categories?fields=slug&locale=en'),
    fetchAPI<{ data: Author[] }>('/authors?fields=slug&locale=en'),
    fetchAPI<{ data: Tag[] }>('/tags?fields=slug&locale=en'),
  ]);

  const articles = articlesRes.data || [];
  const categories = categoriesRes.data || [];
  const authors = authorsRes.data || [];
  const tags = tagsRes.data || [];

  const locales = ['ar', 'en'];
  const staticPages = ['', 'about', 'contact', 'search'];

  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ''}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '' ? 1.0 : 0.5,
    }))
  );

  const articleUrls = locales.flatMap((locale) =>
    articles.map((article) => ({
      url: `${baseUrl}/${locale}/articles/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  );

  const categoryUrls = locales.flatMap((locale) =>
    categories.map((cat) => ({
      url: `${baseUrl}/${locale}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  );

  const authorUrls = locales.flatMap((locale) =>
    authors.map((author) => ({
      url: `${baseUrl}/${locale}/authors/${author.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  const tagUrls = locales.flatMap((locale) =>
    tags.map((tag) => ({
      url: `${baseUrl}/${locale}/tags/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  );

  return [...staticUrls, ...articleUrls, ...categoryUrls, ...authorUrls, ...tagUrls];
}