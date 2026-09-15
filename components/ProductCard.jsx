import Link from 'next/link';
import Image from 'next/image';
import CategoryIcon from './CategoryIcon';
import { formatPrice } from '../lib/format';

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden border-2 border-line bg-white tag-corner transition-shadow hover:shadow-xl"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-bone">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-charcoal text-safety">
            <CategoryIcon icon={product.icon} className="h-12 w-12" />
          </div>
        )}
        {product.sabs_approved && (
          <span className="absolute top-2 left-2 bg-hazard px-2 py-1 text-[10px] font-bold uppercase text-white tag-corner-sm">
            SABS Approved
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-bold uppercase tracking-wide text-hazard">{product.brand}</span>
        <h3 className="font-display text-lg leading-tight text-charcoal">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-steel/80">{product.short_description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-xl text-charcoal">{formatPrice(product.price)}</span>
          <span className="text-xs font-bold uppercase text-hazard group-hover:underline">View →</span>
        </div>
      </div>
    </Link>
  );
}
