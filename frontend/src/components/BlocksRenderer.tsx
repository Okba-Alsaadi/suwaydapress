'use client';

import React from 'react';
import Image from 'next/image';
import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer';

interface Props {
  content: BlocksContent;
}

export default function BlocksRendererClient({ content }: Props) {
  if (!content) return null;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          if (!image?.url) return null;
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '');
          return (
            <div className="my-8">
              <Image
                src={`${baseUrl}${image.url}`}
                width={image.width || 800}
                height={image.height || 600}
                alt={image.alternativeText || ''}
                className="rounded-lg mx-auto"
                unoptimized={true}
              />
              {image.caption && (
                <p className="text-sm text-gray-500 text-center mt-2">{image.caption}</p>
              )}
            </div>
          );
        },
        paragraph: ({ children }) => (
          <p className="text-[19px] md:text-[20px] leading-[2.1] text-gray-900 mb-6 tracking-[0.01em]">
            {children}
          </p>
        ),
        heading: ({ children, level }) => {
          const Tag = `h${level}` as React.ElementType;
          const sizeMap: Record<number, string> = {
            1: 'text-4xl md:text-5xl',
            2: 'text-3xl md:text-4xl',
            3: 'text-2xl md:text-3xl',
            4: 'text-xl md:text-2xl',
            5: 'text-lg',
            6: 'text-base',
          };
          return (
            <Tag className={`mt-14 mb-6 font-extrabold leading-snug ${sizeMap[level]}`}>
              {children}
            </Tag>
          );
        },
        list: ({ children, format }) => {
          const ListTag = format === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag className="mb-8 pr-8 space-y-3 text-[19px] md:text-[20px] leading-[2] marker:text-primary">
              {children}
            </ListTag>
          );
        },
        quote: ({ children }) => (
          <blockquote className="border-r-4 border-primary pr-6 my-10 text-xl leading-[2] font-medium text-gray-800 bg-gray-50 py-4 rounded-l-lg">
            {children}
          </blockquote>
        ),
        link: ({ children, url }) => (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {children}
          </a>
        ),
      }}
    />
  );
}