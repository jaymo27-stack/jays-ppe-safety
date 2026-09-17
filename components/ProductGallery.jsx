'use client';

import { useState } from 'react';
import Image from 'next/image';
import CategoryIcon from './CategoryIcon';

// Product photo gallery. With a single photo it renders exactly as before —
// thumbnails only appear once there are two or more images.
export default function ProductGallery({ product }) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const [active, setActive] = useState(0);
  const current = images[active];

  function step(delta) {
    setActive((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div>
      <div className="relative flex h-80 items-center justify-center border-2 border-line bg-white md:h-[28rem]">
        {current ? (
          <Image
            src={current}
            alt={`${product.name}${active > 0 ? ` — view ${active + 1}` : ''}`}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-charcoal text-safety">
            <CategoryIcon icon={product.icon} className="h-20 w-20" />
          </div>
        )}

        {product.sabs_approved && (
          <span className="absolute top-4 left-4 z-10 bg-hazard px-3 py-1 text-xs font-bold uppercase text-white tag-corner-sm">
            SABS Approved
          </span>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 border-2 border-line bg-white/90 px-3 py-2 text-lg font-bold text-charcoal hover:bg-safety"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 border-2 border-line bg-white/90 px-3 py-2 text-lg font-bold text-charcoal hover:bg-safety"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 z-10 bg-charcoal/80 px-2 py-1 text-xs font-bold text-bone">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative h-20 w-20 border-2 bg-white transition-colors ${
                i === active ? 'border-safety' : 'border-line hover:border-charcoal'
              }`}
            >
              <Image src={src} alt="" fill className="object-contain p-1" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
