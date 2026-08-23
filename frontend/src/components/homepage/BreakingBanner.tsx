'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  locale: string;
  dict: any;
}

export default function BreakingBanner({ locale, dict }: Props) {
  const [articles, setArticles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const res = await fetch('/api/breaking');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setArticles(data.data || []);
      } catch (error) {
        console.error('Breaking banner error:', error);
      }
    };
    fetchBreaking();
  }, []);

  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [articles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div className={`mt-8 mb-4 rounded-lg shadow-sm transition-colors duration-500 ${flash ? 'bg-[#2d2d2de6]' : 'bg-primary'}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">⚡ {dict.breaking.label}</span>
            <Link
              href={`/${locale}/articles/${currentArticle.slug}`}
              className="hover:underline font-medium text-white"
            >
              {currentArticle.title}
            </Link>
          </div>
          {articles.length > 1 && (
            <span className="text-sm opacity-80 text-white">
              {currentIndex + 1} / {articles.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}