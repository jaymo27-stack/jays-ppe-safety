import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import categories from '../../../data/categories';
import { getProductsByCategory } from '../../../lib/products';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  return { title: cat ? `${cat.name} | Jay's PPE & Safety` : "Shop | Jay's PPE & Safety" };
}

export default function CategoryPage({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) return notFound();

  const products = getProductsByCategory(cat.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <nav className="text-sm text-steel/70">
        <Link href="/shop" className="hover:text-hazard">Shop All</Link> / {cat.name}
      </nav>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-charcoal">{cat.name}</h1>
      <p className="mt-2 text-steel/80">{products.length} products in this category.</p>

      {products.length === 0 ? (
        <p className="mt-10 text-steel/70">
          No products in this category yet — check back soon, or{' '}
          <a href="tel:0824778280" className="text-hazard underline">give us a call</a> for a quote.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
