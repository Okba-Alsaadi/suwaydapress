import Container from '@/components/layout/Container';

export default function ArticleLoading() {
  return (
    <div className="animate-pulse">
      <Container>
        <main className="pt-6 md:pt-8 pb-12">
          {/* Image placeholder */}
          <div className="max-w-4xl ms-0 me-8 mb-8">
            <div className="aspect-[16/9] bg-gray-200 rounded-xl" />
          </div>

          {/* Title placeholder */}
          <div className="max-w-4xl ms-0 me-8 mb-4 space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Date & author placeholder */}
          <div className="max-w-4xl ms-0 me-8 mb-8 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>

          {/* Body skeleton */}
          <div className="max-w-4xl ms-0 me-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                {i % 2 === 0 && <div className="h-4 bg-gray-200 rounded w-2/3" />}
              </div>
            ))}
          </div>
        </main>

        {/* Related articles skeleton */}
        <section className="border-t border-gray-300 pt-8 mt-0 mb-8">
          <div className="mb-8 h-8 bg-gray-200 rounded w-48" />
          <div className="grid gap-8 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[16/9] bg-gray-200 rounded-sm" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}