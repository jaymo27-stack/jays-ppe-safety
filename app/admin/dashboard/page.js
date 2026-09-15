'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPrice } from '../../../lib/format';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    });
    load();
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl uppercase tracking-wide text-charcoal">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      {error && <p className="mt-4 text-hazard">{error}</p>}
      {loading ? (
        <p className="mt-6 text-steel/70">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto border-2 border-line bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-charcoal text-bone">
              <tr>
                <th className="px-4 py-3 text-left font-display uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-left font-display uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-left font-display uppercase tracking-wide">Price</th>
                <th className="px-4 py-3 text-left font-display uppercase tracking-wide">Stock</th>
                <th className="px-4 py-3 text-left font-display uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right font-display uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-charcoal">{p.name}</td>
                  <td className="px-4 py-3 text-steel/80">{p.category}</td>
                  <td className="px-4 py-3 text-steel/80">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-steel/80">{p.stock}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`px-2 py-1 text-xs font-bold uppercase ${
                        p.active ? 'bg-safety text-charcoal' : 'bg-line text-bone'
                      }`}
                    >
                      {p.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="mr-4 font-bold text-hazard hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p)} className="font-bold text-steel/60 hover:text-hazard">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="p-6 text-center text-steel/60">No products yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
