'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/homepage/ArticleCard';
import { Article } from '@/types/strapi';

interface Props {
  locale: string;
  dict: any;
}

export default function AdvancedSearchResults({ locale, dict }: Props) {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pageCount: 1, total: 0 });

  useEffect(() => {
    const fetchResults = async () => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.size === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.data || []);
        setPagination({
          page: data.meta?.pagination?.page || 1,
          pageCount: data.meta?.pagination?.pageCount || 1,
          total: data.meta?.pagination?.total || 0,
        });
      } catch (err) {
        console.error(err);
        setError(dict.search.error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, dict.search.error]);

  if (searchParams.size === 0) {
    return (
      <p className="text-center text-gray-500">
        {dict.search.no_results}
      </p>
    );
  }

  return (
    <>
      {loading && <p className="text-center">{dict.common.loading}</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className="text-center text-gray-500">{dict.search.no_results}</p>
      )}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} locale={locale} dict={dict} />
        ))}
      </div>
      {pagination.pageCount > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <span>Page {pagination.page} of {pagination.pageCount}</span>
        </div>
      )}
    </>
  );
}