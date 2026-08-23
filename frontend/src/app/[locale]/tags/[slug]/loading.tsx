import Container from '@/components/layout/Container';

export default function TagLoading() {
  return (
    <Container>
      <main className="py-20 animate-pulse">
        <div className="mb-20 text-center space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto" />
          <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto" />
        </div>
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[16/9] bg-gray-200 rounded-sm" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </main>
    </Container>
  );
}