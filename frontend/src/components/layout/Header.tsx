'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import LanguageSwitcher from './LanguageSwitcher';
import { Category } from '@/types/strapi';
import { Search } from 'lucide-react';
import { FaFacebookF } from 'react-icons/fa6';

interface Props {
  locale: string;
  dict: any;
  categories: Category[];
}

function formatArabicDateTime(date: Date): string {
  const day = date.toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const time = date.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  return `${day} الساعة ${time}`;
}

export default function Header({ locale, dict, categories }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const parentCategories = categories.filter(cat => !cat.parent);
  const childCategories = categories.filter(cat => cat.parent);
  const isArabic = locale === 'ar';
  const logoHorizontal = isArabic ? '/hArLogo.png' : '/hEnLogo.png';
  const logoVertical = '/vLogo.png'; // vertical logo for mobile

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateDisplay = locale === 'ar'
    ? formatArabicDateTime(now)
    : now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        {/* ---- Mobile layout ---- */}
        <div className="md:hidden">
          {/* Tiny top strip with date and language */}
          <div className="bg-[#2d2d2de6] text-white text-xs py-1 px-4 flex items-center justify-between">
            <LanguageSwitcher locale={locale} />
            <span suppressHydrationWarning>{dateDisplay}</span>
          </div>
          {/* Main mobile bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <Link href={`/${locale}`} className="flex-shrink-0">
              {/* Vertical logo on mobile, horizontal on desktop */}
              <Image
                src={logoVertical}
                alt={dict.footer.brand}
                width={100}
                height={40}
                priority
                className="block md:hidden"
              />
              <Image
                src={logoHorizontal}
                alt={dict.footer.brand}
                width={210}
                height={60}
                priority
                className="hidden md:block"
              />
            </Link>
            <div className="flex items-center gap-2">
              {/* Facebook button – exactly like footer but smaller */}
              <a
                href={dict.static.facebook_group_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-sm transition-colors"
              >
                <FaFacebookF className="text-[#1877F2] text-sm" />
                <span className={`text-primary text-xs font-bold ${isArabic ? 'font-bold' : 'font-normal'}`}>
                  منتدى التفكير
                </span>
              </a>
              <Link href={`/${locale}/search`} className="p-2 text-gray-700">
                <Search size={20} />
              </Link>
              <button ref={buttonRef} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-2xl p-2 text-gray-900">
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* ---- Desktop layout (completely unchanged) ---- */}
        <div className="hidden md:block">
          <div className={`bg-[#2d2d2de6] text-white overflow-hidden transition-all duration-300 ${scrolled ? 'max-h-0 opacity-0' : 'max-h-[100px] opacity-100'}`}>
            <Container>
              <div className="flex items-center justify-between text-xs py-1 font-bold">
                <LanguageSwitcher locale={locale} />
                <span suppressHydrationWarning>{dateDisplay}</span>
              </div>
            </Container>
          </div>
          <div className={`bg-white overflow-hidden transition-all duration-500 ${scrolled ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'}`}>
            <Container>
              <div className="flex items-center justify-between py-1">
                <Link href={`/${locale}`} className="flex-shrink-0 mt-2">
                  <Image src={logoHorizontal} alt={dict.footer.brand} width={210} height={60} priority />
                </Link>
                <div className="flex items-center gap-4">
                  <a
                    href={dict.static.facebook_group_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-sm transition-colors"
                  >
                    <FaFacebookF className="text-[#1877F2] text-lg" />
                    <span className="text-primary text-sm font-semibold">منتدى التفكير</span>
                  </a>
                  <Link href={`/${locale}/search`} className="text-gray-800 hover:text-primary p-2 rounded-full transition-colors" aria-label={dict.header.search}>
                    <Search size={22} />
                  </Link>
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* Desktop category navbar (unchanged) */}
        <div className="hidden md:block border-b-2 border-primary">
          <Container>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                {scrolled && (
                  <Link href={`/${locale}`} className="me-2">
                    <Image src="/sLogo.png" alt={dict.footer.brand} width={30} height={30} />
                  </Link>
                )}
                <nav className="flex items-center gap-3 text-sm font-normal">
                  {parentCategories.map(parent => {
                    const children = childCategories.filter(c => c.parent?.id === parent.id);
                    return (
                      <div key={parent.id} className="relative group">
                        {children.length === 0 ? (
                          <Link href={`/${locale}/category/${parent.slug}`} className="text-black hover:text-primary px-2 py-1 rounded transition-colors whitespace-nowrap">
                            {parent.name}
                          </Link>
                        ) : (
                          <>
                            <Link href={`/${locale}/category/${parent.slug}`} className="flex items-center gap-1 text-black hover:text-primary px-2 py-1 rounded transition-colors whitespace-nowrap">
                              {parent.name}<span className="text-xs">▾</span>
                            </Link>
                            <div className="absolute right-0 top-full pt-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                              <div className="bg-white border border-gray-200 shadow-xl min-w-[180px] rounded-lg overflow-hidden">
                                {children.map(child => (
                                  <Link key={child.id} href={`/${locale}/category/${child.slug}`} className="block px-4 py-2 text-sm text-gray-800 hover:bg-primary hover:text-white transition-colors">
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <Link href={`/${locale}/search`} className="text-gray-800 hover:text-primary" aria-label={dict.header.search}>
                    <Search size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* Mobile slide-out menu (unchanged) */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div ref={menuRef} className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 overflow-y-auto rounded-l-2xl"
            style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
            <div className="p-6 pt-16 space-y-4">
              {parentCategories.map(parent => {
                const children = childCategories.filter(c => c.parent?.id === parent.id);
                return (
                  <div key={parent.id}>
                    <Link href={`/${locale}/category/${parent.slug}`} onClick={() => setMobileMenuOpen(false)}
                      className="font-semibold text-gray-900 py-3 block">
                      {parent.name}
                    </Link>
                    {children.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {children.map(child => (
                          <Link key={child.id} href={`/${locale}/category/${child.slug}`} onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-gray-700 hover:bg-primary hover:text-white px-3 py-2 rounded">
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
                <Link href={`/${locale}/search`} onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-900 hover:bg-primary hover:text-white px-3 py-3 rounded text-lg">
                  {dict.header.search}
                </Link>
                <Link href={`/${locale === 'ar' ? 'en' : 'ar'}`} onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-900 hover:bg-primary hover:text-white px-3 py-3 rounded text-lg">
                  {locale === 'ar' ? 'English' : 'العربية'}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}