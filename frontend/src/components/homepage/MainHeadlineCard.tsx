import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/strapi';

interface Props {
  article: Article;
  locale: string;
  dict?: any;
  showVideoBadge?: boolean;
}

export default function MainHeadlineCard({ article, locale, dict, showVideoBadge }: Props) {
  const imageUrl = article.featured_image?.url;
  const fullUrl = imageUrl ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}` : null;
  const isRTL = locale === 'ar';
  const badgePosition = isRTL ? 'right-2' : 'left-2';

  return (
    <Link
      href={`/${locale}/articles/${article.slug}`}
      className="group block relative rounded-sm overflow-hidden shadow-md hover:translate-x-1 rtl:hover:-translate-x-1 transition-transform duration-300"
    >
      <div className="relative w-full aspect-[16/9] bg-gray-200">
        {fullUrl ? (
          <>
            {/* Blurred background */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={fullUrl}
                alt=""
                fill
                unoptimized
                className="object-cover scale-110 blur-2xl opacity-80"
                aria-hidden="true"
              />
            </div>
            {/* Main image – uncropped, centered */}
            <div className="absolute inset-0 flex items-center justify-center p-1">
              <Image
                src={fullUrl}
                alt={article.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </>
        ) : null}

        {showVideoBadge && dict?.article?.video_badge && (
          <div
            className={`absolute top-2 ${badgePosition} bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 z-10`}
          >
            <span>▶</span> {dict.article.video_badge}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 sm:p-4 pt-12 sm:pt-16 z-10">
        <div className="bg-black/40 inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-sm mb-1 sm:mb-2">
          <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl">{article.title}</h2>
        </div>
        {article.author && dict && (
          <p className="text-white/90 text-xs mt-0.5 sm:mt-1">
            {dict.article.by} {article.author.name}
          </p>
        )}
      </div>
    </Link>
  );
}