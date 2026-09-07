// src/app/[locale]/authors/[slug]/page.tsx
import { fetchAPI } from '@/lib/strapi';
import { Author, Article } from '@/types/strapi';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/homepage/ArticleCard';
import Image from 'next/image';
import BlocksRenderer from '@/components/BlocksRenderer';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { translateArticleCategories } from '@/lib/category';
import { notFound } from 'next/navigation';
import { absoluteUrl } from '@/lib/url';
import Link from 'next/link';
import { getStrapiLocale } from '@/lib/strapi-locale';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  let author = null;
  try {
    const res = await fetchAPI<{ data: Author[] }>(
      `/authors?filters[slug][$eq]=${slug}&locale=${getStrapiLocale(locale)}`
    );
    author = res.data[0];
  } catch (e) {}
  if (!author && locale !== 'ar') {
    try {
      const res = await fetchAPI<{ data: Author[] }>(
        `/authors?filters[slug][$eq]=${slug}&locale=ar`
      );
      author = res.data[0];
    } catch (e) {}
  }
  if (!author) {
    return { title: 'Author not found' };
  }
  return {
    title: `${author.name} | السويداء برس`,
    description: `مقالات الكاتب ${author.name}`,
    alternates: {
      canonical: absoluteUrl(`/${locale}/authors/${slug}`),
    },
  };
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;
  const pageSize = 15;
  const dict = await getDictionary(locale);
  const isRTL = locale === 'ar';

  let author = null;
  try {
    const res = await fetchAPI<{ data: Author[] }>(
      `/authors?filters[slug][$eq]=${slug}&populate=*&locale=${getStrapiLocale(locale)}`
    );
    author = res.data[0];
  } catch (e) {
    console.error('Author fetch failed:', e);
  }
  if (!author && locale !== 'ar') {
    try {
      const res = await fetchAPI<{ data: Author[] }>(
        `/authors?filters[slug][$eq]=${slug}&populate=*&locale=ar`
      );
      author = res.data[0];
    } catch (e) {}
  }
  if (!author) {
    try {
      const res = await fetchAPI<{ data: Author[] }>(
        `/authors?filters[slug][$eq]=${slug}&populate=*`
      );
      author = res.data[0];
    } catch (e) {}
  }
  if (!author) return notFound();

  // ---------- Paginated articles fetch ----------
  const articlesRes = await fetchAPI<{
    data: Article[];
    meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
  }>(
    `/articles?filters[author][slug][$eq]=${slug}&populate=*&sort=publishedAt:desc&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
  );
  const articles = articlesRes.data ?? [];
  const pagination = articlesRes.meta?.pagination;
  const totalPages = pagination?.pageCount ?? 0;

  const translatedArticles = await translateArticleCategories(articles, locale);

  // Pagination counter logic (same as child category)
  const generatePagination = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [];
    pages.push(1);
    if (current > 3) pages.push('ellipsis');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('ellipsis');
    pages.push(total);
    return pages;
  };
  const paginationItems = generatePagination(currentPage, totalPages);

  return (
    <Container>
      <main className="py-8">
        {/* Author header: image + gray card with same height */}
        <div className="flex flex-row h-48 md:h-56 mb-8">
          {author.photo && (
            <div className="h-full w-40 md:w-48 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${author.photo.url}`}
                alt={author.name}
                width={192}
                height={224}
                className="object-cover w-full h-full"
                unoptimized={true}
              />
            </div>
          )}

          <div
            className={`flex-1 h-full bg-gray-200 rounded-md p-6 flex flex-col justify-start ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <h1 className="text-3xl font-bold text-blackish mb-3">{author.name}</h1>
            {author.bio && (
              <div className="text-blackish/80 text-sm leading-relaxed overflow-y-auto">
                <BlocksRenderer content={author.bio} />
              </div>
            )}
          </div>
        </div>

        {/* Separator above articles */}
        <div className="border-t border-gray-300 mb-8" />

        {/* Gray rectangle title for "Author's articles" */}
        <div className="mb-8">
          <span className="inline-block bg-gray-200 text-black font-bold text-xl px-5 py-2 rounded-md">
            {dict.author.articles.replace('{name}', author.name)}
          </span>
        </div>

        {/* Articles grid */}
        {translatedArticles.length === 0 ? (
          <p className="text-blackish/80">{dict.author.no_articles}</p>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {translatedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} dict={dict} />
              ))}
            </div>

            {/* Pagination counter */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pb-4">
                {currentPage > 1 && (
                  <Link
                    href={`/${locale}/authors/${slug}?page=${currentPage - 1}`}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-black hover:underline"
                  >
                    {dict.pagination.previous || 'Previous'}
                  </Link>
                )}

                {paginationItems.map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-sm text-gray-400">
                      …
                    </span>
                  ) : (
                    <Link
                      key={item}
                      href={`/${locale}/authors/${slug}?page=${item}`}
                      className={`px-2 py-1 text-sm ${
                        item === currentPage
                          ? 'font-bold text-black'
                          : 'text-gray-600 hover:text-black hover:underline'
                      }`}
                    >
                      {item}
                    </Link>
                  )
                )}

                {currentPage < totalPages && (
                  <Link
                    href={`/${locale}/authors/${slug}?page=${currentPage + 1}`}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-black hover:underline"
                  >
                    {dict.pagination.next || 'Next'}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </Container>
  );
}