import Container from '@/components/layout/Container';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import { getDictionary } from '@/lib/dictionary';
import Link from 'next/link';

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <Container>
      <main className="py-20">
        <h1 className="text-3xl font-bold mb-8 text-blackish">{dict.search.title}</h1>
        <SearchForm locale={locale} dict={dict} />
        <div className="text-center mb-6">
          <Link
            href={`/${locale}/advanced-search`}
            className="text-primary hover:underline"
          >
            {dict.search.advanced} →
          </Link>
        </div>
        <SearchResults locale={locale} dict={dict} />
      </main>
    </Container>
  );
}