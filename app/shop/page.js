import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import CategoryIcon from '../../components/CategoryIcon';
import categories from '../../data/categories';
import { getAllProducts } from '../../lib/products';

export const metadata = { title: "Shop All | Jay's PPE & Safety" };

export default function ShopPage() {
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="font-display text-3xl uppercase tracking-wide text-charcoal">Shop All Products</h1>
      <p className="mt-2 text-steel/80">{products.length} products across our full safety range.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="flex items-center gap-2 border-2 border-line bg-white px-3 py-2 text-sm font-bold uppercase tracking-wide text-charcoal hover:border-safety"
          >
            <CategoryIcon icon={c.icon} className="h-4 w-4" />
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
