'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import categories from '../data/categories';

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 bg-charcoal text-bone shadow-lg">
      <div className="hazard-stripe h-1.5 w-full" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/brand/logo.png"
            alt="Jay's PPE & Safety"
            width={220}
            height={87}
            className="h-12 w-auto md:h-14"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 font-display uppercase tracking-wide text-sm md:flex">
          <Link href="/shop" className="hover:text-safety transition-colors">
            Shop All
          </Link>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="hover:text-safety transition-colors">
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="tel:0824778280"
            className="hidden lg:block text-sm text-bone/80 hover:text-safety"
          >
            📞 082 477 8280
          </a>
          <Link href="/cart" className="relative flex items-center gap-2 btn-primary !px-4 !py-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1.4" />
              <circle cx="18" cy="21" r="1.4" />
              <path d="M2.5 3h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-hazard text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-line bg-charcoal px-4 py-3 font-display uppercase tracking-wide text-sm md:hidden">
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="py-2">
            Shop All
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} onClick={() => setMenuOpen(false)} className="py-2">
              {c.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
