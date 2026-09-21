import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug } from '../../../lib/products';
import { formatPrice } from '../../../lib/format';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductGallery from '../../../components/ProductGallery';
import ProductCard from '../../../components/ProductCard';
import categories from '../../../data/categories';

// Always read products fresh from the database, so price/stock/size changes made
// in /admin show up immediately instead of waiting for the next deploy.
export const dynamic = 'force-dynamic';

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
        <ProductGallery product={product} />

        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-hazard">{product.brand}</span>
          <h1 className="mt-1 font-display text-3xl uppercase text-charcoal md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-steel/80">{product.short_description}</p>
          <p className="mt-4 font-display text-3xl text-charcoal">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-steel/60">
            {product.stock > 0 ? `${product.stock} in stock` : 'Contact us for availability'}
          </p>

          <AddToCartButton product={product} />

          {product.options?.length > 0 && (
            <div className="mt-8 border-t-2 border-line pt-6">
              <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
                Available Options
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                {product.options.map((opt) => (
                  <div key={opt.name} className="flex flex-wrap gap-x-2">
                    <dt className="font-bold uppercase tracking-wide text-charcoal">{opt.label}:</dt>
                    <dd className="text-steel/90">{opt.values.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/size-guide"
                className="mt-3 inline-block text-sm font-bold uppercase tracking-wide text-hazard hover:underline"
              >
                View SA Size Guide →
              </Link>
            </div>
          )}

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
