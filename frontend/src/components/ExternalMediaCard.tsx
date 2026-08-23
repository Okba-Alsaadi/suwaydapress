import { Play } from 'lucide-react';
import Image from 'next/image';

interface Props {
  url: string;
  title: string;
  thumbnailUrl?: string | null;
  categorySlug?: string | null;
  dict: any;
}

export default function ExternalMediaCard({ url, title, thumbnailUrl, categorySlug, dict }: Props) {
  let label = dict.article.watch_video;
  if (categorySlug === 'film-document' || categorySlug?.includes('film')) {
    label = dict.article.watch_documentary;
  } else if (categorySlug === 'podcast' || categorySlug?.includes('podcast')) {
    label = dict.article.listen_podcast;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 to-black/90 aspect-video"
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          unoptimized={true}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-black/80" />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-whiteish">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-3 group-hover:bg-secondary transition-colors">
          <Play className="w-8 h-8 fill-current" />
        </div>
        <span className="text-lg font-bold bg-black/30 px-4 py-1 rounded-full backdrop-blur">
          {label}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h4 className="text-whiteish font-semibold line-clamp-2">{title}</h4>
      </div>
    </a>
  );
}