import { fetchAPI } from '@/lib/strapi';
import { Tag, Article } from '@/types/strapi';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/homepage/ArticleCard';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { translateArticleCategories } from '@/lib/category';
import { translateArticleAuthors } from '@/lib/author';
import { absoluteUrl } from '@/lib/url';
import { getStrapiLocale } from '@/lib/strapi-locale';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;

  const res = await fetchAPI<{ data: Tag[] }>(
    `/tags?filters[slug][$eq]=${slug}`
  );

  const tag = res.data[0];

  if (!tag) {
    return { title: 'Tag not found' };
  }

  return {
    title: `${tag.name} | السويداء برس`,
    description: `مقالات تحت وسم ${tag.name}`,
    alternates: {
      canonical: absoluteUrl(`/${locale}/tags/${slug}`),
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug, locale } = await params;
  const dict = await getDictionary(locale);

  const tagRes = await fetchAPI<{ data: Tag[] }>(
    `/tags?filters[slug][$eq]=${slug}&locale=${getStrapiLocale(locale)}`
  );

  const tag = tagRes.data[0];

  if (!tag) {
    return <Container>{dict.tag.no_articles}</Container>;
  }

  const articlesRes = await fetchAPI<{ data: Article[] }>(
    `/articles?filters[tags][slug][$eq]=${slug}&populate=*&sort=publishedAt:desc`
  );

  const articles = articlesRes.data;
  const translatedCats = await translateArticleCategories(articles, locale);
  const translatedArticles = await translateArticleAuthors(translatedCats, locale);

  return (
    <Container>
      <main className="py-20">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-blackish">
            {tag.name}
          </h1>
          {tag.description && (
            <p className="text-blackish/80">{tag.description}</p>
          )}
          <div className="w-16 h-[3px] bg-primary mx-auto rounded-full mt-4" />
        </header>

        {translatedArticles.length === 0 ? (
          <p className="text-center text-blackish/80">{dict.tag.no_articles}</p>
        ) : (
          <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3">
            {translatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} dict={dict} />
            ))}
          </div>
        )}
      </main>
    </Container>
  );
}