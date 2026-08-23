import Container from '@/components/layout/Container';

export default function SearchLoading() {
  return (
    <Container>
      <main className="py-20 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48 mb-8" />
        {/* Search form placeholder */}
        <div className="h-12 bg-gray-200 rounded w-full mb-4" />
        <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-6" />
        {/* Results */}
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </main>
    </Container>
  );
}