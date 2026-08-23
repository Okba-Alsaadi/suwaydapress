import Container from '@/components/layout/Container';

export default function AuthorLoading() {
  return (
    <Container>
      <main className="py-8 animate-pulse">
        {/* Author header */}
        <div className="flex flex-row h-48 md:h-56 mb-8">
          <div className="h-full w-40 md:w-48 bg-gray-200 rounded-md flex-shrink-0" />
          <div className="flex-1 h-full bg-gray-100 rounded-md p-6 space-y-3 ml-4">
            <div className="h-7 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>

        <div className="border-t border-gray-300 mb-8" />

        {/* Section title */}
        <div className="mb-8 h-8 bg-gray-200 rounded w-64" />

        {/* Articles grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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