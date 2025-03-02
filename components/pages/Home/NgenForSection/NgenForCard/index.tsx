import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { NgenForCardType } from '../types';

function NgenForCard({
  image,
  title,
  description,
  href,
  alt,
}: NgenForCardType) {
  return (
    <>
      {href && (
        <Link href={href} className="relative [&_p]:hidden [&_p]:hover:block">
          {image && alt && (
            <Image
              src={image}
              width={700}
              height={450}
              className="w-full h-full"
              alt={alt}
            />
          )}
          <div className="absolute bottom-0 bg-gradient-to-t from-black to-black/20 text-white w-full rounded-b-3xl px-9 py-8">
            <h3 className="text-4xl font-protestRiot">{title}</h3>
            <p className="text-xl">{description}</p>
          </div>
        </Link>
      )}
    </>
  );
}

export default NgenForCard;
