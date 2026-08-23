'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

interface Props {
  images: { src: string; alt: string }[];
  /** If true, shows a blurred background layer behind the main image */
  blurred?: boolean;
}

export default function ArticleImageSlider({ images, blurred = false }: Props) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prev = useCallback(() => {
    setCurrent((cur) => (cur === 0 ? images.length - 1 : cur - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((cur) => (cur === images.length - 1 ? 0 : cur + 1));
  }, [images.length]);

  // Auto‑advance every 5 seconds (pauses on hover)
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [images.length, isHovered, next]);

  if (!images.length) return null;

  return (
    <div
      className="relative w-full aspect-[16/9] mb-8 group overflow-hidden rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.07)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Blurred background layer (only if enabled) */}
      {blurred && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={images[current].src}
            alt=""
            fill
            unoptimized
            className="object-cover scale-110 blur-2xl opacity-40"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Main foreground image */}
      <div className="absolute inset-0 flex items-center justify-center p-1">
        <Image
          src={images[current].src}
          alt={images[current].alt}
          fill
          unoptimized
          className={`${blurred ? 'object-contain' : 'object-cover'}`}
          priority={current === 0}
        />
      </div>

      {/* Navigation arrows (only if more than 1 image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow hover:bg-white transition"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow hover:bg-white transition"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}