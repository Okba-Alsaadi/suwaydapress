'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[60px] h-[44px]" />;
  }

  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '') || '/';
  const otherLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <Link
      href={`/${otherLocale}${pathWithoutLocale}`}
      className="text-xs font-medium px-2 py-1 rounded bg-white text-black hover:text-primary transition-colors"
      aria-label={locale === 'ar' ? 'English' : 'العربية'}
    >
      {locale === 'ar' ? 'EN' : 'AR'}
    </Link>
  );
}