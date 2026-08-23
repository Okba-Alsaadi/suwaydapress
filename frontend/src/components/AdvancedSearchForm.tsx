'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from '@/components/ui/Select';
import CustomDatePicker from '@/components/ui/DatePicker';

interface Option {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  locale: string;
  dict: any;
}

export default function AdvancedSearchForm({ locale, dict }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Option[]>([]);
  const [authors, setAuthors] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [author, setAuthor] = useState(searchParams.get('author') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');
  const [fromDate, setFromDate] = useState<Date | null>(
    searchParams.get('fromDate') ? new Date(searchParams.get('fromDate')!) : null
  );
  const [toDate, setToDate] = useState<Date | null>(
    searchParams.get('toDate') ? new Date(searchParams.get('toDate')!) : null
  );

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoriesRes, authorsRes, tagsRes] = await Promise.all([
          fetch(`/api/categories?locale=${locale}`).then(res => res.json()),
          fetch(`/api/authors?locale=${locale}`).then(res => res.json()),
          fetch(`/api/tags?locale=${locale}`).then(res => res.json()),
        ]);
        setCategories(categoriesRes.data || []);
        setAuthors(authorsRes.data || []);
        setTags(tagsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch filter options', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [locale]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (category) params.set('category', category);
    if (author) params.set('author', author);
    if (tag) params.set('tag', tag);
    if (fromDate) params.set('fromDate', fromDate.toISOString().split('T')[0]);
    if (toDate) params.set('toDate', toDate.toISOString().split('T')[0]);
    router.push(`/${locale}/advanced-search?${params.toString()}`);
  };

  const handleClear = () => {
    setKeyword('');
    setCategory('');
    setAuthor('');
    setTag('');
    setFromDate(null);
    setToDate(null);
    router.push(`/${locale}/advanced-search`);
  };

  if (loading) return <p className="text-center text-blackish/70">{dict.common.loading}</p>;

  const categoryOptions = categories.map(cat => ({ value: cat.slug, label: cat.name }));
  const authorOptions = authors.map(a => ({ value: a.slug, label: a.name }));
  const tagOptions = tags.map(t => ({ value: t.slug, label: t.name }));

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-greyish/10 p-6 rounded-xl border border-greyish/30">
      <div>
        <label className="block text-sm font-medium mb-1 text-blackish/80">{dict.search.filters.keyword}</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border border-greyish rounded-lg px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-blackish/80">{dict.search.filters.category}</label>
          <Select
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            placeholder={dict.search.filters.any_category}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blackish/80">{dict.search.filters.author}</label>
          <Select
            value={author}
            onChange={setAuthor}
            options={authorOptions}
            placeholder={dict.search.filters.any_author}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blackish/80">{dict.search.filters.tag}</label>
          <Select
            value={tag}
            onChange={setTag}
            options={tagOptions}
            placeholder={dict.search.filters.any_tag}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-blackish/80">{dict.search.filters.date_from}</label>
          <CustomDatePicker
            selected={fromDate}
            onChange={setFromDate}
            placeholderText={dict.search.filters.date_from}
            locale={locale}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blackish/80">{dict.search.filters.date_to}</label>
          <CustomDatePicker
            selected={toDate}
            onChange={setToDate}
            placeholderText={dict.search.filters.date_to}
            locale={locale}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-primary text-whiteish px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
        >
          {dict.search.filters.apply}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-greyish text-blackish px-6 py-3 rounded-lg hover:bg-primary hover:text-whiteish transition-colors"
        >
          {dict.search.filters.clear}
        </button>
      </div>
    </form>
  );
}