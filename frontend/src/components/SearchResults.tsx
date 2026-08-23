'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/homepage/ArticleCard';
import { Article } from '@/types/strapi';

interface Props {
  locale: string;
  dict: any;
}

export default function SearchResults({ locale, dict }: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Search failed: ${res.status} ${text.substring(0, 100)}`);
        }
        return res.json();
      })
      .then(data => setResults(data.data || []))
      .catch(err => {
        console.error(err);
        setError(dict.search.error || 'An error occurred');
      })
      .finally(() => setLoading(false));
  }, [query, dict.search.error]);

  if (!query) return null;

  return (
    <>
      <p className="mb-6 text-blackish/70">
        {dict.search.filters?.results_for?.replace('{query}', query) || `Search results for: ${query}`}
      </p>
      {loading && <p className="text-center text-blackish/70">{dict.common.loading}</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className="text-center text-blackish/70">{dict.search.no_results}</p>
      )}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} locale={locale} dict={dict} />
        ))}
      </div>
    </>
  );
}