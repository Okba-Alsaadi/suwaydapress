// src/app/[locale]/articles/[slug]/page.tsx
import { fetchAPI } from '@/lib/strapi';
import BlocksRenderer from '@/components/BlocksRenderer';
import ArticleImageSlider from '@/components/ArticleImageSlider';
import ExternalMediaCard from '@/components/ExternalMediaCard';
import { Article, Author } from '@/types/strapi';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import ReadingProgress from '@/components/ReadingProgress';
import Script from 'next/script';
import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleCard from '@/components/homepage/ArticleCard';
import { getDictionary } from '@/lib/dictionary';
import { translateArticleCategories } from '@/lib/category';
import { absoluteUrl } from '@/lib/url';
import { getStrapiLocale } from '@/lib/strapi-locale';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const strapiLocale = getStrapiLocale(locale);
  const res = await fetchAPI<{ data: Article[] }>(
    `/articles?filters[slug][$eq]=${slug}&populate=*&locale=${strapiLocale}`
  );
  const article = res.data[0];
  if (!article) return { title: 'Article not found' };
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || 'تابع آخر الأخبار والتقارير من السويداء برس.',
    alternates: { canonical: absoluteUrl(`/${locale}/articles/${slug}`) },
    openGraph: {
      title: article.title,
      description: article.meta_description || 'تابع آخر الأخبار والتقارير من السويداء برس.',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: article.og_image?.url
        ? [`${process.env.NEXT_PUBLIC_STRAPI_URL}${article.og_image.url}`]
        : article.featured_image?.url
        ? [`${process.env.NEXT_PUBLIC_STRAPI_URL}${article.featured_image.url}`]
        : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  const dict = await getDictionary(locale);
  const isRTL = locale === 'ar';
  const strapiLocale = getStrapiLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '');

  // ---- Main article fetch with correct locale ----
  const res = await fetchAPI<{ data: Article[] }>(
    `/articles?filters[slug][$eq]=${slug}&populate=*&locale=${strapiLocale}`
  );
  const article = res.data[0];
  if (!article) return <Container>Article not found</Container>;

  // ---- Gallery fetch with correct locale ----
  let gallery: any[] = [];
  try {
    const galleryRes = await fetchAPI<{ data: Article[] }>(
      `/articles?filters[slug][$eq]=${slug}&populate[gallery][populate]=*&locale=${strapiLocale}`
    );
    gallery = galleryRes.data[0]?.gallery || [];
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
  }

  const relatedManual = (article as any).related_articles as Article[] | undefined;
  const highlight = (article as any).highlight as string | undefined;

  const [translatedArticle] = await translateArticleCategories([article], locale);
  const category = translatedArticle.category;

  let translatedAuthor = article.author;
  if (translatedAuthor && locale !== 'ar') {
    try {
      const authorRes = await fetchAPI<{ data: Author[] }>(
        `/authors?filters[slug][$eq]=${translatedAuthor.slug}&locale=${strapiLocale}`
      );
      if (authorRes.data[0]) translatedAuthor = authorRes.data[0];
    } catch (e) {
      console.error('Failed to fetch translated author:', e);
    }
  }

  // ---- Build slider images ----
  const sliderImages: { src: string; alt: string }[] = [];
  const featuredUrl = article.featured_image?.url;
  if (featuredUrl) sliderImages.push({ src: `${baseUrl}${featuredUrl}`, alt: article.title });
  for (const block of gallery) {
    if (block.image) {
      const img = Array.isArray(block.image) ? block.image[0] : block.image;
      if (img?.url) sliderImages.push({ src: `${baseUrl}${img.url}`, alt: block.caption || '' });
    }
  }

  // ---- Related articles with correct locale ----
  let related: Article[] = [];
  if (relatedManual?.length) {
    related = relatedManual.slice(0, 3);
  } else if (category) {
    const relatedRes = await fetchAPI<{ data: Article[] }>(
      `/articles?filters[category][slug][$eq]=${category.slug}&filters[slug][$ne]=${article.slug}&sort=publishedAt:desc&pagination[limit]=3&populate=*&locale=${strapiLocale}`
    );
    related = relatedRes.data ?? [];
  }
  related = await translateArticleCategories(related, locale);

  const isOpinion = article.content_type_editorial === 'opinion';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: featuredUrl ? `${baseUrl}${featuredUrl}` : undefined,
    author: translatedAuthor
      ? { '@type': 'Person', name: translatedAuthor.name }
      : { '@type': 'Organization', name: 'السويداء برس' },
    publisher: {
      '@type': 'Organization',
      name: 'السويداء برس',
      logo: { '@type': 'ImageObject', url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/${locale}/articles/${article.slug}`) },
  };

  const textBlockClass = `max-w-4xl ms-0 me-8`;

  return (
    <>
      <ReadingProgress />
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container>
        <main className="pt-6 md:pt-8 pb-12">
          {!article.external_url && sliderImages.length > 0 && (
            <div className={`${textBlockClass} mb-8`}>
              {sliderImages.length > 1 ? (
                <ArticleImageSlider images={sliderImages} blurred />
              ) : (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.07)] bg-gray-200">
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={sliderImages[0].src}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover scale-110 blur-2xl opacity-40"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-1">
                    <Image
                      src={sliderImages[0].src}
                      alt={sliderImages[0].alt}
                      fill
                      unoptimized
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {article.external_url && (
            <div className={`${textBlockClass} mb-8`}>
              <ExternalMediaCard
                url={article.external_url}
                title={article.title}
                thumbnailUrl={featuredUrl ? `${baseUrl}${featuredUrl}` : undefined}
                categorySlug={category?.slug}
                dict={dict}
              />
            </div>
          )}

          <div className={`${textBlockClass} mb-4`}>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-black">
              {article.title}
            </h1>
          </div>

          <div className={`${textBlockClass} mb-2 text-sm text-black/80`}>
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}{' '}
                {new Date(article.publishedAt).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            )}
          </div>

          {translatedAuthor && (
            <div className={`${textBlockClass} mb-8 text-sm text-black/80`}>
              <Link href={`/${locale}/authors/${translatedAuthor.slug}`} className="hover:text-primary transition-colors">
                {translatedAuthor.name}
              </Link>
            </div>
          )}

          {isOpinion && highlight && (
            <div className={`${textBlockClass} mb-8`}>
              <div className="bg-gray-200 px-6 py-5 rounded-md text-xl md:text-2xl font-semibold text-black/90 leading-relaxed">
                {highlight}
              </div>
            </div>
          )}

          <div
            className={`${textBlockClass} text-[21px] leading-[2.2] text-black space-y-6
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-black/90
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black/80
              [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-black/70
              [&_h4]:text-lg [&_h4]:font-medium [&_h4]:text-black/60
            `}
          >
            <BlocksRenderer content={article.content} />
          </div>
        </main>

        {related.length > 0 && (
          <section className="border-t border-gray-300 pt-8 mt-0 mb-8">
            <div className="mb-8">
              <span className="inline-block bg-gray-200 text-black font-bold text-xl px-5 py-2 rounded-md">
                {dict.article.related || 'Related Articles'}
              </span>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((rel) => (
                <ArticleCard key={rel.id} article={rel} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}