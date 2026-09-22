import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '../components/ProductCard';
import CategoryIcon from '../components/CategoryIcon';
import categories from '../data/categories';
import { getAllProducts } from '../lib/products';

// Always read products fresh from the database, so price/stock changes made in
// /admin show up immediately instead of waiting for the next deploy.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = products.slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-charcoal text-bone">
        <div className="hazard-stripe absolute inset-x-0 bottom-0 h-2" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <span className="section-label">Your Complete Industrial Safety Supplier</span>
            <h1 className="mt-5 font-display text-4xl uppercase leading-tight md:text-6xl">
              Protect. <span className="text-safety">Equip.</span> Work Safely.
            </h1>
            <p className="mt-5 max-w-md text-bone/80">
              Helmets, boots, worksuits, hi-vis jackets and more — trusted PPE for construction,
              industrial, mining, warehouse and general work sites.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">Shop All Products</Link>
              <a href="tel:0824778280" className="btn-outline border-bone text-bone hover:bg-bone hover:text-charcoal">
                Call for a Quote
              </a>
            </div>
          </div>
          <div className="relative mx-auto h-64 w-full max-w-md md:h-80">
            <Image
              src="/images/products/d59-acid-proof-worksuit.jpg"
              alt="Industrial safety workwear"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <h2 className="font-display text-2xl uppercase tracking-wide text-charcoal">Our Products</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="group flex flex-col items-center gap-3 border-2 border-line bg-white p-5 text-center tag-corner-sm transition-colors hover:border-safety"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-safety transition-colors group-hover:bg-safety group-hover:text-charcoal">
                <CategoryIcon icon={c.icon} className="h-8 w-8" />
              </div>
              <span className="font-display text-sm uppercase tracking-wide text-charcoal">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* WE SUPPLY STRIP */}
      <section className="bg-steel py-10 text-bone">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 text-center font-display uppercase tracking-wide md:px-8">
          <span className="text-safety">We Supply:</span>
          {['Construction', 'Industrial', 'Mining', 'Warehouse', 'General Work', 'And More'].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl uppercase tracking-wide text-charcoal">Featured Gear</h2>
          <Link href="/shop" className="text-sm font-bold uppercase text-hazard hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="hazard-stripe">
        <div className="bg-charcoal/90 py-12 text-center text-bone">
          <h2 className="font-display text-2xl uppercase tracking-wide md:text-3xl">
            Need a bulk or custom quote?
          </h2>
          <p className="mt-2 text-bone/80">Call or WhatsApp us — we'll sort you out.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="tel:0824778280" className="btn-primary">📞 082 477 8280</a>
            <a href="mailto:jayppesafety@gmail.com" className="btn-secondary">✉️ Email Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
