'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return null;

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const linkClass = (href) =>
    `px-3 py-2 font-display text-sm uppercase tracking-wide ${
      pathname === href || pathname.startsWith(href + '/')
        ? 'bg-safety text-charcoal'
        : 'text-bone hover:bg-steel'
    }`;

  return (
    <div className="bg-charcoal">
      <div className="hazard-stripe h-1.5 w-full" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-1">
          <span className="mr-4 font-display text-sm uppercase tracking-widest text-safety">Admin</span>
          <Link href="/admin/dashboard" className={linkClass('/admin/dashboard')}>Products</Link>
          <Link href="/admin/orders" className={linkClass('/admin/orders')}>Orders</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-bone/70 hover:text-safety">View Store →</Link>
          <button onClick={handleLogout} className="text-sm font-bold uppercase text-hazard hover:underline">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
