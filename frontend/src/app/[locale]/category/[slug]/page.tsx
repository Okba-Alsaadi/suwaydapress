// src/app/[locale]/category/[slug]/page.tsx

import { fetchAPI } from '@/lib/strapi';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/homepage/ArticleCard';
import MainHeadlineCard from '@/components/homepage/MainHeadlineCard';
import SectionTitleBar from '@/components/homepage/SectionTitleBar';
import { Category, Article } from '@/types/strapi';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import { translateArticleCategories } from '@/lib/category';
import { translateArticleAuthors } from '@/lib/author';
import { absoluteUrl } from '@/lib/url';
import Image from 'next/image';
import arCategoryCover from '@/../public/arCategoryCover.png';
import enCategoryCover from '@/../public/enCategoryCover.png';
import { getStrapiLocale } from '@/lib/strapi-locale';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Updated slugs – your list: qantara-podcast, filmani, articles, political-notice, breaches, control
const MEDIA_CATEGORY_SLUGS = [
  'qantara-podcast',
  'filmani',
  'articles',
  'political-notice',
  'breaches',
  'control',
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    let categoryRes = await fetchAPI<{ data: Category[] }>(
      `/categories?filters[slug][$eq]=${slug}&locale=${getStrapiLocale(locale)}`
    );
    let category = categoryRes.data?.[0];

    if (!category && locale !== 'ar') {
      const fallbackRes = await fetchAPI<{ data: Category[] }>(
        `/categories?filters[slug][$eq]=${slug}&locale=ar`
      );
      category = fallbackRes.data?.[0];
    }

    if (!category) return { title: 'Section not found' };

    return {
      title: `${category.name} | السويداء برس`,
      description: `آخر الأخبار في قسم ${category.name}`,
      alternates: {
        canonical: absoluteUrl(`/${locale}/category/${slug}`),
      },
    };
  } catch {
    return { title: 'Section not found' };
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;
  const pageSize = 15;
  const dict = await getDictionary(locale);
  const isRTL = locale === 'ar';
  const categoryCover = locale === 'ar' ? arCategoryCover : enCategoryCover;

  const coverTitleFontClass = isRTL
    ? 'font-[family-name:var(--font-noto-naskh-arabic)]'
    : 'font-[family-name:var(--font-playfair-display)]';

  let categoryRes = await fetchAPI<{ data: Category[] }>(
    `/categories?filters[slug][$eq]=${slug}&locale=${getStrapiLocale(locale)}&populate=parent`
  );
  let category = categoryRes.data?.[0];

  if (!category && locale !== 'ar') {
    const fallbackRes = await fetchAPI<{ data: Category[] }>(
      `/categories?filters[slug][$eq]=${slug}&locale=ar&populate=parent`
    );
    category = fallbackRes.data?.[0];
  }

  if (!category) notFound();

  let childrenRes = await fetchAPI<{ data: Category[] }>(
    `/categories?filters[parent][slug][$eq]=${slug}&locale=${getStrapiLocale(locale)}&sort=order:asc`
  );
  let children = childrenRes.data ?? [];

  if (children.length === 0 && locale !== 'ar') {
    const fallbackChildrenRes = await fetchAPI<{ data: Category[] }>(
      `/categories?filters[parent][slug][$eq]=${slug}&locale=ar&sort=order:asc`
    );
    children = fallbackChildrenRes.data ?? [];
  }

  // ---------- PARENT CATEGORY ----------
  if (children.length > 0) {
    const childSectionsPromises = children.map(async (child) => {
      const res = await fetchAPI<{ data: Article[] }>(
        `/articles?filters[category][slug][$eq]=${child.slug}&populate=*&sort=publishedAt:desc&pagination[limit]=3`
      );
      const translatedCats = await translateArticleCategories(res.data ?? [], locale);
      const translated = await translateArticleAuthors(translatedCats, locale);
      return { child, articles: translated };
    });
    const childSections = await Promise.all(childSectionsPromises);

    return (
      <main>
        {/* COVER */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden bg-white">
          <div
            className="absolute inset-0"
            style={{
              maskImage: isRTL
                ? 'linear-gradient(to bottom right, white 5%, transparent 75%)'
                : 'linear-gradient(to bottom left, white 5%, transparent 75%)',
              WebkitMaskImage: isRTL
                ? 'linear-gradient(to bottom right, white 5%, transparent 75%)'
                : 'linear-gradient(to bottom left, white 5%, transparent 75%)',
            }}
          >
            <Image src={categoryCover} alt="" fill className="object-fill" priority unoptimized />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background: isRTL
                ? 'linear-gradient(to bottom right, rgba(0,0,0,0.25), transparent 50%)'
                : 'linear-gradient(to bottom left, rgba(0,0,0,0.25), transparent 50%)',
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <h1
                className={`${coverTitleFontClass} text-2xl sm:text-4xl md:text-5xl font-bold px-4 sm:px-12 mb-28 sm:mb-32 text-black ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {category.name}
              </h1>
            </div>
          </div>
        </div>

        <Container>
          <div className="mt-6 sm:mt-12 space-y-6 sm:space-y-12 pb-4">
            {childSections
              .filter(({ articles }) => articles.length > 0)
              .map(({ child, articles }, index) => {
                const isMedia = MEDIA_CATEGORY_SLUGS.includes(child.slug);
                const isFirst = index === 0;

                return (
                  <section key={child.id} className="relative">
                    {!isFirst && (
                      <div className="absolute top-0 start-0 end-0 h-px bg-gray-300 z-10" />
                    )}
                    <Link
                      href={`/${locale}/category/${child.slug}`}
                      className="block absolute top-0 start-0 z-20"
                    >
                      <SectionTitleBar title={child.name} locale={locale} variant="white" />
                    </Link>
                    <div className="pt-14 sm:pt-12">
                      {/* 2 columns on mobile for media cards, 3 for normal */}
                      <div className={`grid gap-3 sm:gap-8 ${isMedia ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'}`}>
                        {articles.map((article) =>
                          isMedia ? (
                            <div
                              key={article.id}
                              className="[&_h2]:!text-xs [&_h2]:!leading-tight sm:[&_h2]:!text-sm md:[&_h2]:!text-base lg:[&_h2]:!text-xl xl:[&_h2]:!text-2xl"
                            >
                              <MainHeadlineCard article={article} locale={locale} dict={dict} showVideoBadge />
                            </div>
                          ) : (
                            <div
                              key={article.id}
                              className="[&_h3]:!text-xs [&_h3]:!leading-snug sm:[&_h3]:!text-sm md:[&_h3]:!text-base lg:[&_h3]:!text-lg"
                            >
                              <ArticleCard article={article} locale={locale} variant="default" dict={dict} />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
          </div>
        </Container>
      </main>
    );
  }

  // ---------- CHILD CATEGORY ----------
  const articlesRes = await fetchAPI<{
    data: Article[];
    meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
  }>(
    `/articles?filters[category][slug][$eq]=${slug}&populate=*&sort=publishedAt:desc&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
  );
  const articles = articlesRes.data ?? [];
  const pagination = articlesRes.meta?.pagination;
  const totalPages = pagination?.pageCount ?? 0;

  const translatedCats = await translateArticleCategories(articles, locale);
  const translatedArticles = await translateArticleAuthors(translatedCats, locale);

  const parentName = category.parent?.name ?? '';
  const isMediaCategory = MEDIA_CATEGORY_SLUGS.includes(slug);

  const combinedTitles = isRTL
    ? `${parentName} ${category.name}`
    : `${category.name} ${parentName}`;

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
    <main>
      {/* COVER – child category */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-white">
        <div
          className="absolute inset-0"
          style={{
            maskImage: isRTL
                ? 'linear-gradient(to bottom right, white 5%, transparent 75%)'
                : 'linear-gradient(to bottom left, white 5%, transparent 75%)',
            WebkitMaskImage: isRTL
                ? 'linear-gradient(to bottom right, white 5%, transparent 75%)'
                : 'linear-gradient(to bottom left, white 5%, transparent 75%)',
          }}
        >
          <Image src={categoryCover} alt="" fill className="object-fill" priority unoptimized />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: isRTL
              ? 'linear-gradient(to bottom right, rgba(0,0,0,0.25), transparent 50%)'
              : 'linear-gradient(to bottom left, rgba(0,0,0,0.25), transparent 50%)',
          }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h2 className={`${coverTitleFontClass} text-2xl sm:text-4xl md:text-5xl font-bold px-4 sm:px-12 mb-28 sm:mb-32 text-black`}>
                {combinedTitles}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <Container>
        {translatedArticles.length === 0 ? (
          <p className="text-center text-blackish/80 py-20">{dict.category.no_articles}</p>
        ) : (
          <>
            {/* 2 columns on mobile for media, 3 for normal */}
            <div className={`grid gap-3 sm:gap-8 mt-6 sm:mt-12 ${isMediaCategory ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'}`}>
              {translatedArticles.map((article) =>
                isMediaCategory ? (
                  <div
                    key={article.id}
                    className="[&_h2]:!text-xs [&_h2]:!leading-tight sm:[&_h2]:!text-sm md:[&_h2]:!text-base lg:[&_h2]:!text-xl xl:[&_h2]:!text-2xl"
                  >
                    <MainHeadlineCard article={article} locale={locale} dict={dict} showVideoBadge />
                  </div>
                ) : (
                  <div
                    key={article.id}
                    className="[&_h3]:!text-xs [&_h3]:!leading-snug sm:[&_h3]:!text-sm md:[&_h3]:!text-base lg:[&_h3]:!text-lg"
                  >
                    <ArticleCard article={article} locale={locale} variant="default" dict={dict} />
                  </div>
                )
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 sm:mt-12 pb-4">
                {currentPage > 1 && (
                  <Link
                    href={`/${locale}/category/${slug}?page=${currentPage - 1}`}
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
                      href={`/${locale}/category/${slug}?page=${item}`}
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
                    href={`/${locale}/category/${slug}?page=${currentPage + 1}`}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-black hover:underline"
                  >
                    {dict.pagination.next || 'Next'}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
}