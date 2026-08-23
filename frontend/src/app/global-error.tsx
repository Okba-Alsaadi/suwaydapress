'use client';

import Container from '@/components/layout/Container';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  params: { locale: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const locale = params?.locale || 'ar';
  const isAr = locale === 'ar';

  return (
    <html>
      <body>
        <Container>
          <div className="py-32 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">500</h1>
            <h2 className="text-2xl mb-8">
              {isAr ? 'حدث خطأ في الخادم' : 'Server error'}
            </h2>
            <button
              onClick={reset}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary"
            >
              {isAr ? 'حاول مرة أخرى' : 'Try again'}
            </button>
          </div>
        </Container>
      </body>
    </html>
  );
}