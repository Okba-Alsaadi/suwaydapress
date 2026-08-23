import Container from '@/components/layout/Container';
import { getDictionary } from '@/lib/dictionary';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <Container>
      <div className="py-20 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{dict.static.about_title}</h1>
        <div className="prose prose-lg">
          <p>{dict.static.about_content}</p>
        </div>
      </div>
    </Container>
  );
}