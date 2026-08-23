import { fetchAPI } from '@/lib/strapi';
import { Article, Category, Author, Tag } from '@/types/strapi';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const [articlesRes, categoriesRes, authorsRes, tagsRes] = await Promise.all([
    fetchAPI<{ data: Article[] }>('/articles?fields=slug,publishedAt&sort=publishedAt:desc'),
    fetchAPI<{ data: Category[] }>('/categories?fields=slug'),
    fetchAPI<{ data: Author[] }>('/authors?fields=slug'),
    fetchAPI<{ data: Tag[] }>('/tags?fields=slug'),
  ]);

  const articles = articlesRes.data;
  const categories = categoriesRes.data;
  const authors = authorsRes.data;
  const tags = tagsRes.data;

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

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/ar/articles/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/ar/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const authorUrls = authors.map((author) => ({
    url: `${baseUrl}/ar/author/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tagUrls = tags.map((tag) => ({
    url: `${baseUrl}/ar/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticUrls, ...articleUrls, ...categoryUrls, ...authorUrls, ...tagUrls];
}