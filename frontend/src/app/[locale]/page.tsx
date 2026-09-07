import { fetchAPI } from '@/lib/strapi';
import { Homepage, Article, Category } from '@/types/strapi';
import Container from '@/components/layout/Container';
import { getDictionary } from '@/lib/dictionary';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/homepage/ArticleCard';
import MainHeadlineCard from '@/components/homepage/MainHeadlineCard';
import BreakingBanner from '@/components/homepage/BreakingBanner';
import SectionTitleBar from '@/components/homepage/SectionTitleBar';
import { translateArticleCategories } from '@/lib/category';
import { translateArticleAuthors } from '@/lib/author';
import React from 'react';
import { getStrapiLocale } from '@/lib/strapi-locale';

/* ---------- helpers ---------- */
async function fetchCategoryArticles(slug: string, limit: number, locale: string): Promise<Article[]> {
  let childSlugs: string[] = [];
  try {
    const childrenRes = await fetchAPI<{ data: Category[] }>(
      `/categories?filters[parent][slug][$eq]=${slug}&locale=${getStrapiLocale(locale)}&fields=slug`
    );
    childSlugs = childrenRes.data.map((c) => c.slug);
  } catch {}
  const allSlugs = [slug, ...childSlugs];
  const filter = allSlugs.map((s) => `filters[category][slug][$in][]=${s}`).join('&');
  const res = await fetchAPI<{ data: Article[] }>(
    `/articles?${filter}&populate=*&sort=publishedAt:desc&pagination[limit]=${limit}`
  );
  return res.data || [];
}

function getGridCols(count: number) {
  if (count === 3) return 'md:grid-cols-3';
  if (count === 4) return 'md:grid-cols-4';
  return 'md:grid-cols-1';
}

function isGreyStyle(group: any): boolean {
  if (!group) return false;
  if (group.type === 'two-column') return true;
  if (group.type === 'single') return group.section.style === 'grey-background';
  return false;
}

const MEDIA_SLUGS = ['filmani', 'nasaq-podcast', 'articles', 'political-notice'];

/* ---------- page component ---------- */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const isRTL = locale === 'ar';

  let homepageData: Homepage | null = null;
  try {
    homepageData = (await fetchAPI<{ data: Homepage }>(
      `/homepage?populate[main_headline][populate]=*&populate[secondary_headlines][populate]=*&populate[sections][populate]=*&locale=${getStrapiLocale(locale)}`
    )).data;
  } catch (e) {}
  if (!homepageData && locale !== 'ar') {
    try {
      homepageData = (await fetchAPI<{ data: Homepage }>(
        `/homepage?populate[main_headline][populate]=*&populate[secondary_headlines][populate]=*&populate[sections][populate]=*&locale=ar`
      )).data;
    } catch {}
  }
  if (!homepageData) return notFound();

  let main = homepageData.main_headline;
  let secondary = homepageData.secondary_headlines || [];
  if (main) {
    const [t] = await translateArticleCategories([main], locale);
    main = t;
    const [t2] = await translateArticleAuthors([main], locale);
    main = t2;
  }
  secondary = await translateArticleCategories(secondary, locale);
  secondary = await translateArticleAuthors(secondary, locale);

  async function processSections(sections: Homepage['sections']) {
    if (!sections) return [];
    const processed = [];
    for (const section of sections) {
      const { section_title, linked_category, manual_articles, section_style } = section;
      let articles: Article[] = [];
      if (manual_articles?.length) {
        articles = manual_articles;
      } else if (linked_category?.slug) {
        let limit = 4;
        if (linked_category.slug === 'reports') limit = 3;
        else if (['articles', 'political-notice', 'filmani', 'nasaq-podcast', 'control'].includes(linked_category.slug)) limit = 1;
        articles = await fetchCategoryArticles(linked_category.slug, limit, locale);
      }
      if (articles.length === 0) continue;
      articles = await translateArticleCategories(articles, locale);
      articles = await translateArticleAuthors(articles, locale);
      processed.push({ ...section, articles, style: section_style || 'default' });
    }
    return processed;
  }
  const sections = await processSections(homepageData.sections);

  const groupedSections: any[] = [];
  let i = 0;
  while (i < sections.length) {
    const curr = sections[i];
    if (curr.style === 'two-column-left' && i + 1 < sections.length && sections[i + 1].style === 'two-column-right') {
      const next = sections[i + 1];
      groupedSections.push({ type: 'two-column', left: curr, right: next });
      i += 2;
    } else if (curr.style === 'two-column-right') {
      groupedSections.push({ type: 'single', section: curr });
      i++;
    } else {
      groupedSections.push({ type: 'single', section: curr });
      i++;
    }
  }

  return (
    <>
      {/* ========== HERO ========== */}
      <Container>
        <BreakingBanner locale={locale} dict={dict} />
        {main && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 mb-0 max-md:gap-4 max-md:mt-4">
            <div className="lg:col-span-2">
              <MainHeadlineCard article={main} locale={locale} dict={dict} />
            </div>
            <div className="bg-gray-200 p-4 rounded-sm flex flex-col max-md:p-3">
              {secondary.slice(0, 4).map((article, idx) => (
                <React.Fragment key={article.id}>
                  <div className="flex-1">
                    <ArticleCard article={article} locale={locale} variant="side-stack" />
                  </div>
                  {idx < 3 && <div className="h-px bg-amber-50 my-2 max-md:my-1" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* ========== SECTIONS ========== */}
      {groupedSections.map((group, idx) => {
        const previousGroup = idx > 0 ? groupedSections[idx - 1] : null;
        const nextGroup = idx < groupedSections.length - 1 ? groupedSections[idx + 1] : null;
        const previousIsGrey = isGreyStyle(previousGroup);
        const nextIsGrey = isGreyStyle(nextGroup);

        const showTopSeparator =
          (idx === 0 && !isGreyStyle(group)) ||
          (!isGreyStyle(group) && previousGroup && !previousIsGrey);

        // ---------- TWO-COLUMN ----------
        if (group.type === 'two-column') {
          const { left, right } = group;
          const isMedia =
            MEDIA_SLUGS.includes(left.linked_category?.slug ?? '') ||
            MEDIA_SLUGS.includes(right.linked_category?.slug ?? '');
          return (
            <div key={`two-${idx}`} className="bg-gray-200 my-8 max-md:my-4">
              <Container>
                <div className="relative flex flex-col md:flex-row pt-0 pb-10 max-md:pb-6">
                  <div className="absolute top-16 bottom-8 left-1/2 w-px bg-primary transform -translate-x-1/2 hidden md:block" />
                  
                  <div className="flex-1 px-4 max-md:px-2">
                    <SectionTitleBar title={left.section_title} locale={locale} variant="grey" className="mt-6 mb-6 max-md:mt-3 max-md:mb-3" />
                    <div className="pb-4 max-md:pb-2">
                      {left.articles.map((article: Article) => (
                        <div key={article.id} className="mb-6 last:mb-0 max-md:mb-4">
                          <MainHeadlineCard article={article} locale={locale} dict={dict} showVideoBadge={isMedia} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 px-4 max-md:px-2">
                    <SectionTitleBar title={right.section_title} locale={locale} variant="grey" className="mt-6 mb-6 max-md:mt-3 max-md:mb-3" />
                    <div className="pb-4 max-md:pb-2">
                      {right.articles.map((article: Article) => (
                        <div key={article.id} className="mb-6 last:mb-0 max-md:mb-4">
                          <MainHeadlineCard article={article} locale={locale} dict={dict} showVideoBadge={isMedia} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          );
        }

        // ---------- SINGLE GREY ----------
        if (group.section.style === 'grey-background') {
          const { section } = group;
          const isMap = section.linked_category?.slug === 'control';
          return (
            <div key={section.id} className="bg-gray-200 my-8 max-md:my-4">
              <Container>
                <div className="pt-0.5 pb-14 max-md:pb-8">
                  <SectionTitleBar title={section.section_title} locale={locale} variant="grey" className="mt-6 mb-6 max-md:mt-3 max-md:mb-3" />
                  {isMap ? (
                    <div className="max-w-3xl mx-auto">
                      {section.articles.map((article: Article) => (
                        <MainHeadlineCard key={article.id} article={article} locale={locale} dict={dict} />
                      ))}
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 ${getGridCols(section.articles.length)} gap-6 max-md:gap-3 max-md:grid-cols-2`}>
                      {section.articles.map((article: Article, index: number) => (
                        <div key={article.id} className={section.articles.length === 3 && index === 2 ? 'max-md:col-span-2' : ''}>
                          <ArticleCard article={article} locale={locale} variant="default" dict={dict} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Container>
            </div>
          );
        }

        // ---------- SINGLE WHITE ----------
        const { section } = group;
        return (
          <div key={section.id}>
            <Container>
              <div className="relative">
                {showTopSeparator && (
                  <div className="absolute top-4 start-0 end-0 h-px bg-gray-300 z-10" />
                )}
                <SectionTitleBar
                  title={section.section_title}
                  locale={locale}
                  variant="white"
                  className="absolute top-4 start-0 z-20"
                />
                <div className="pt-18 pb-0.5 max-md:pt-16">
                  <div className={`grid grid-cols-1 ${getGridCols(section.articles.length)} gap-6 max-md:gap-3 max-md:grid-cols-2`}>
                    {section.articles.map((article: Article, index: number) => (
                      <div key={article.id} className={section.articles.length === 3 && index === 2 ? 'max-md:col-span-2' : ''}>
                        <ArticleCard article={article} locale={locale} variant="default" dict={dict} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        );
      })}
    </>
  );
}