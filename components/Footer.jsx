'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import categories from '../data/categories';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="mt-20 bg-charcoal text-bone">
      <div className="hazard-stripe h-1.5 w-full" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div>
          <h3 className="font-display text-xl uppercase tracking-wide text-safety">Jay's PPE & Safety</h3>
          <p className="mt-3 text-sm text-bone/70">
            Your complete industrial safety supplier — protect, equip, work safely.
          </p>
          <p className="mt-4 text-sm">
            📞 <a href="tel:0824778280" className="hover:text-safety">082 477 8280</a>
          </p>
          <p className="text-sm">
            ✉️ <a href="mailto:jayppesafety@gmail.com" className="hover:text-safety">jayppesafety@gmail.com</a>
          </p>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wide text-safety">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-bone/80">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="hover:text-safety">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wide text-safety">We Supply</h4>
          <ul className="mt-3 space-y-2 text-sm text-bone/80">
            <li>Construction</li>
            <li>Industrial</li>
            <li>Mining</li>
            <li>Warehouse</li>
            <li>General Work &amp; More</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wide text-safety">Info</h4>
          <ul className="mt-3 space-y-2 text-sm text-bone/80">
            <li><Link href="/shop" className="hover:text-safety">Shop All Products</Link></li>
            <li><Link href="/size-guide" className="hover:text-safety">SA Size Guide</Link></li>
            <li><Link href="/cart" className="hover:text-safety">Your Cart</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-bone/50">
        © {new Date().getFullYear()} Jay's PPE & Safety. All rights reserved.
      </div>
    </footer>
  );
}
