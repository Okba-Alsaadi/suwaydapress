import '@/app/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDictionary } from '@/lib/dictionary';
import { fetchAPI } from '@/lib/strapi';
import { Category } from '@/types/strapi';
import { getStrapiLocale } from '@/lib/strapi-locale';

// استيراد الخطوط المطلوبة من Google Fonts
import { Noto_Naskh_Arabic, Amiri, Playfair_Display, Source_Sans_3 } from 'next/font/google';

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-naskh-arabic',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair-display',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-sans-3',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const dict = await getDictionary(locale);



  let headerCategories: Category[] = [];
  try {
    const res = await fetchAPI<{ data: Category[] }>(
      `/categories?filters[active][$eq]=true&filters[show_in_navbar][$eq]=true&populate=parent&sort=order:asc&pagination[pageSize]=100&locale=${getStrapiLocale(locale)}`
    );
    headerCategories = res.data ?? [];
  } catch (e) {
    if (locale !== 'ar') {
      try {
        const fallback = await fetchAPI<{ data: Category[] }>(
          `/categories?filters[active][$eq]=true&filters[show_in_navbar][$eq]=true&populate=parent&sort=order:asc&pagination[pageSize]=100&locale=ar`
        );
        headerCategories = fallback.data ?? [];
      } catch {}
    }
  }

  let footerCategories: Category[] = [];
  try {
    const res = await fetchAPI<{ data: Category[] }>(
      `/categories?filters[active][$eq]=true&filters[parent][$null]=true&sort=order:asc&pagination[pageSize]=100&locale=${getStrapiLocale(locale)}`
    );
    footerCategories = res.data ?? [];
  } catch (e) {
    if (locale !== 'ar') {
      try {
        const fallback = await fetchAPI<{ data: Category[] }>(
          `/categories?filters[active][$eq]=true&filters[parent][$null]=true&sort=order:asc&pagination[pageSize]=100&locale=ar`
        );
        footerCategories = fallback.data ?? [];
      } catch {}
    }
  }


  return (
    <div
      className={`${notoNaskhArabic.variable} ${amiri.variable} ${playfairDisplay.variable} ${sourceSans3.variable}`}
      lang={locale}
      dir={isArabic ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <Header locale={locale} dict={dict} categories={headerCategories} />
      {children}
      <Footer locale={locale} dict={dict} categories={footerCategories} />
    </div>
  );
}