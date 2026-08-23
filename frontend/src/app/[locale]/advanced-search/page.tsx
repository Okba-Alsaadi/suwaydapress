import dynamic from 'next/dynamic';
import Container from '@/components/layout/Container';
import AdvancedSearchResults from '@/components/AdvancedSearchResults';
import { getDictionary } from '@/lib/dictionary';

const AdvancedSearchForm = dynamic(() => import('@/components/AdvancedSearchForm'), {
  loading: () => <p className="text-center">جاري التحميل...</p>,
});

export default async function AdvancedSearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <Container>
      <main className="py-20">
        <h1 className="text-3xl font-bold mb-8 text-blackish">{dict.search.advanced}</h1>
        <AdvancedSearchForm locale={locale} dict={dict} />
        <AdvancedSearchResults locale={locale} dict={dict} />
      </main>
    </Container>
  );
}