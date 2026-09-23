import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/strapi';

interface Props {
  article: Article;
  locale: string;
  isFeatured?: boolean;
  isListItem?: boolean;
  variant?: 'compact' | 'default' | 'side-stack';
  dict?: any;
}

export default function ArticleCard({
  article,
  locale,
  isFeatured,
  isListItem,
  variant = 'default',
  dict,
}: Props) {
  // Use medium format for main image, thumbnail for blurred background
  const imageUrl = article.featured_image?.formats?.medium?.url || article.featured_image?.url;
  const blurredImageUrl = article.featured_image?.formats?.thumbnail?.url || article.featured_image?.url;

  const fullUrl = imageUrl ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}` : null;
  const blurredUrl = blurredImageUrl ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${blurredImageUrl}` : null;

  // Shared blurred-background component
  const BlurredBackground = blurredUrl ? (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={blurredUrl}
        alt=""
        fill
        sizes="(max-width: 768px) 50vw, 300px"
        className="object-cover scale-110 blur-2xl opacity-80"
        aria-hidden="true"
      />
    </div>
  ) : null;

  if (variant === 'compact') {
    return (
      <Link href={`/${locale}/articles/${article.slug}`} className="group block hover:translate-x-1 rtl:hover:-translate-x-1 transition-transform duration-300">
        <div className="relative aspect-[16/9] rounded-sm overflow-hidden mb-2 bg-gray-200">
          {BlurredBackground}
          {fullUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image src={fullUrl} alt={article.title} fill sizes="(max-width: 768px) 50vw, 300px" className="object-contain p-1" />
            </div>
          )}
        </div>
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </Link>
    );
  }

  if (variant === 'side-stack') {
    return (
      <Link href={`/${locale}/articles/${article.slug}`} className="group flex items-center gap-3 h-full hover:translate-x-1 rtl:hover:-translate-x-1 transition-transform duration-300">
        <div className="w-16 h-12 flex-shrink-0 rounded-sm overflow-hidden bg-gray-200 relative">
          {fullUrl && (
            <Image src={fullUrl} alt={article.title} fill sizes="64px" className="object-cover" />
          )}
        </div>
        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </Link>
    );
  }

  const cardClasses = isListItem
    ? 'flex gap-4 items-start border-b border-gray-200 pb-4 group hover:translate-x-1 rtl:hover:-translate-x-1 transition-transform duration-300 rounded-sm p-2'
    : 'group block rounded-sm overflow-hidden border border-gray-200 hover:shadow-lg hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300';

  const imageContainerClasses = isListItem
    ? 'w-24 h-24 flex-shrink-0'
    : `w-full ${isFeatured ? 'aspect-[21/9]' : 'aspect-[16/9]'}`;

  return (
    <Link href={`/${locale}/articles/${article.slug}`} className={cardClasses}>
      <div className={`relative rounded-sm overflow-hidden bg-gray-200 ${imageContainerClasses}`}>
        {BlurredBackground}
        {fullUrl && (
          <div className="absolute inset-0 flex items-center justify-center p-1">
            <Image src={fullUrl} alt={article.title} fill sizes={isListItem ? '96px' : '(max-width: 768px) 50vw, 400px'} className="object-contain" />
          </div>
        )}
      </div>

      <div className={isListItem ? 'flex-1' : 'p-5'}>
        <h3 className={`font-bold group-hover:text-primary transition-colors ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
          {article.title}
        </h3>

        {article.excerpt && !isListItem && (
          <p className="text-sm text-gray-600 line-clamp-3 mt-2">{article.excerpt}</p>
        )}

        {article.author && dict && (
          <p className="text-xs text-gray-500 mt-3">
            {dict.article.by} {article.author.name}
          </p>
        )}
      </div>
    </Link>
  );
}