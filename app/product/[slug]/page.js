import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug } from '../../../lib/products';
import { formatPrice } from '../../../lib/format';
import CategoryIcon from '../../../components/CategoryIcon';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductCard from '../../../components/ProductCard';
import categories from '../../../data/categories';

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  return { title: product ? `${product.name} | Jay's PPE & Safety` : "Product | Jay's PPE & Safety" };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product || !product.active) return notFound();

  const cat = categories.find((c) => c.slug === product.category);
  const related = getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <nav className="text-sm text-steel/70">
        <Link href="/shop" className="hover:text-hazard">Shop All</Link> /{' '}
        <Link href={`/shop/${product.category}`} className="hover:text-hazard">{cat?.name || product.category}</Link> /{' '}
        {product.name}
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative flex h-80 items-center justify-center border-2 border-line bg-white md:h-[28rem]">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-contain p-6" priority />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-charcoal text-safety">
              <CategoryIcon icon={product.icon} className="h-20 w-20" />
            </div>
          )}
          {product.sabs_approved && (
            <span className="absolute top-4 left-4 bg-hazard px-3 py-1 text-xs font-bold uppercase text-white tag-corner-sm">
              SABS Approved
            </span>
          )}
        </div>

        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-hazard">{product.brand}</span>
          <h1 className="mt-1 font-display text-3xl uppercase text-charcoal md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-steel/80">{product.short_description}</p>
          <p className="mt-4 font-display text-3xl text-charcoal">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-steel/60">
            {product.stock > 0 ? `${product.stock} in stock` : 'Contact us for availability'}
          </p>

          <AddToCartButton product={product} />

          {product.features?.length > 0 && (
            <div className="mt-8 border-t-2 border-line pt-6">
              <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">Key Features</h2>
              <ul className="mt-3 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-steel/90">
                    <span className="mt-0.5 text-safety">■</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl uppercase tracking-wide text-charcoal">You May Also Need</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
