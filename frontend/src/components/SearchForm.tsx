'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  locale: string;
  dict: any;
  initialQuery?: string;
}

export default function SearchForm({ locale, dict, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.search.placeholder}
          className="flex-1 border border-greyish rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
        />
        <button
          type="submit"
          className="bg-primary text-whiteish px-4 py-3 rounded-lg hover:bg-secondary transition shrink-0"
        >
          {dict.search.button}
        </button>
      </div>
    </form>
  );
}