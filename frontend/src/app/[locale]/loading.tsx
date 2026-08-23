import Container from '@/components/layout/Container';

export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Breaking banner placeholder (optional, just a small bar) */}
      <Container>
        <div className="h-8 bg-gray-200 rounded-sm w-full mb-4 mt-2" />
      </Container>

      {/* Hero skeleton */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mt-4 sm:mt-8">
          {/* Main headline card skeleton */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-sm" />
            <div className="mt-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>

          {/* Secondary stories skeleton */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-sm space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-16 h-12 bg-gray-200 rounded-sm flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Section skeletons (simple cards) */}
      <Container>
        <div className="mt-12 space-y-12">
          {[...Array(3)].map((_, sectionIdx) => (
            <div key={sectionIdx} className="space-y-6">
              <div className="h-6 bg-gray-200 rounded w-40" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, cardIdx) => (
                  <div key={cardIdx} className="space-y-3">
                    <div className="aspect-[16/9] bg-gray-200 rounded-sm" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}