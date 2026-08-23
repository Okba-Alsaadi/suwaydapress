// src/components/layout/Footer.tsx
import Container from './Container';
import Link from 'next/link';
import { Category } from '@/types/strapi';
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

interface Props {
  locale: string;
  dict: any;
  categories: Category[];
}

export default function Footer({ locale, dict, categories }: Props) {
  const isArabic = locale === 'ar';
  const textWeight = isArabic ? 'font-bold' : 'font-normal';
  const forumButtonText = 'منتدى التفكير';

  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://www.facebook.com/share/1E4pBPhgkc/', color: 'text-[#1877F2]' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/presssuwayda?igsh=ZDA1bXVqNngwMWoy', color: 'text-[#E4405F]' },
    { icon: <FaYoutube />, url: 'https://youtube.com/channel/UCYIV1elQq_hL0GRi5mBzHHA?si=mclMZzjwAX0qUhbp', color: 'text-[#FF0000]' },
    { icon: <FaXTwitter />, url: 'https://x.com/presssuwayda', color: 'text-black' },
    { icon: <FaLinkedinIn />, url: 'https://www.linkedin.com/in/%D8%A7%D9%84%D8%B3%D9%88%D9%8A%D8%AF%D8%A7%D8%A1-%D8%A8%D8%B1%D8%B3-18a4613a1', color: 'text-[#0A66C2]' },
    { icon: <FaWhatsapp />, url: 'https://whatsapp.com/channel/0029VbBXbkbDOQIVrMAjGP37', color: 'text-[#25D366]' },
  ];

  const mid = Math.ceil(categories.length / 2);
  const firstCol = categories.slice(0, mid);
  const secondCol = categories.slice(mid);

  return (
    <footer className="mt-8">
      <div className="bg-gray-300">
        <Container>
          {/* Original desktop layout exactly preserved, with mobile overrides */}
          <div className="py-15 max-md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-md:gap-4 items-start">
            {/* Who We Are */}
            <div className="text-sm leading-relaxed text-justify max-w-xs max-md:max-w-full max-md:text-center max-md:mx-auto">
              <p className={textWeight}>{dict.footer.who_we_are_text}</p>
            </div>

            {/* Categories – original flex on desktop, two-column grid on mobile */}
            <div className="flex justify-center">
              <div className="flex flex-row gap-4 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-1">
                <div className="flex flex-col gap-1">
                  {firstCol.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/category/${cat.slug}`}
                      className={`text-blackish hover:text-primary hover:underline transition px-1 py-0.5 text-sm ${textWeight}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {secondCol.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/category/${cat.slug}`}
                      className={`text-blackish hover:text-primary hover:underline transition px-1 py-0.5 text-sm ${textWeight}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Social – original alignment, mobile centered */}
            <div className={`text-sm space-y-2 ${isArabic ? 'text-right' : 'text-left'} max-md:text-center max-md:space-y-2`}>
              <p className={textWeight}>{dict.static.contact_intro}</p>
              <a
                href={`mailto:${dict.static.email}`}
                className="text-primary font-bold hover:underline break-all block"
              >
                {dict.static.email}
              </a>
              <p className={textWeight}>{dict.static.social_intro}</p>
              <div className="flex flex-wrap items-center gap-2 text-base max-md:justify-center max-md:gap-3 max-md:text-lg">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} hover:opacity-80 transition-opacity`}
                  >
                    {link.icon}
                  </a>
                ))}
                <a
                  href={dict.static.facebook_group_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-sm transition-colors"
                >
                  <FaFacebookF className="text-[#1877F2] text-sm" />
                  <span className={`text-primary text-xs font-bold ${textWeight}`}>
                    {forumButtonText}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-[#2d2d2de6] text-white text-sm py-3 text-center font-bold">
        <Container>
          {dict.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
        </Container>
      </div>
    </footer>
  );
}