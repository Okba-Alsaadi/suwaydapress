import Container from '@/components/layout/Container';

export default function CategoryLoading() {
  return (
    <div className="animate-pulse">
      {/* Cover skeleton */}
      <div className="relative w-full h-64 md:h-80 bg-gray-200">
        <div className="absolute bottom-8 left-4 sm:left-12 w-3/4 sm:w-1/2 h-10 sm:h-14 bg-gray-300 rounded" />
      </div>

      <Container>
        <div className="mt-6 sm:mt-12 space-y-6 sm:space-y-12">
          {/* Simulate child sections */}
          {[...Array(2)].map((_, sectionIdx) => (
            <div key={sectionIdx} className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="grid grid-cols-3 gap-3 sm:gap-8">
                {[...Array(3)].map((_, cardIdx) => (
                  <div key={cardIdx} className="space-y-3">
                    <div className="aspect-[16/9] bg-gray-200 rounded-sm" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
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