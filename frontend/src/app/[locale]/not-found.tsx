import Container from '@/components/layout/Container';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import { headers } from 'next/headers';

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('next-url') || '';
  const locale = pathname.split('/')[1] || 'ar';

  const dict = await getDictionary(locale);

  return (
    <Container>
      <div className="py-32 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">{dict.errors['404_title']}</h1>
        <h2 className="text-2xl mb-8 text-blackish/80">{dict.errors['404_message']}</h2>
        <Link
          href={`/${locale}`}
          className="bg-primary text-whiteish px-6 py-3 rounded-lg hover:bg-secondary transition-colors inline-block"
        >
          {dict.common.back_to_home}
        </Link>
      </div>
    </Container>
  );
}