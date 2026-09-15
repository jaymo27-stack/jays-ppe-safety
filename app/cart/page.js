'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../../components/CartContext';
import CategoryIcon from '../../components/CategoryIcon';
import { formatPrice } from '../../lib/format';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, loaded } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    setError('');
    setCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong starting checkout.');
      window.location.href = data.url;
    } catch (e) {
      setError(e.message);
      setCheckingOut(false);
    }
  }

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <h1 className="font-display text-3xl uppercase tracking-wide text-charcoal">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-steel/70">Your cart is empty.</p>
          <Link href="/shop" className="btn-primary mt-6 inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 divide-y-2 divide-line border-2 border-line bg-white">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center gap-4 p-4">
                <div className="relative h-20 w-20 flex-shrink-0 border border-line bg-bone">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-charcoal text-safety">
                      <CategoryIcon icon={item.icon} className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/product/${item.slug}`} className="font-display text-charcoal hover:text-hazard">
                    {item.name}
                  </Link>
                  <p className="text-sm text-steel/70">{formatPrice(item.price)} each</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="border-2 border-line px-2 font-bold hover:bg-bone"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="border-2 border-line px-2 font-bold hover:bg-bone"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="ml-4 text-sm font-bold uppercase text-hazard hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-display text-lg text-charcoal">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit border-2 border-line bg-white p-6">
            <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">Order Summary</h2>
            <div className="mt-4 flex justify-between text-steel/80">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-steel/50">Shipping & any applicable tax calculated at checkout.</p>
            {error && <p className="mt-3 text-sm text-hazard">{error}</p>}
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-primary mt-6 w-full"
            >
              {checkingOut ? 'Redirecting…' : 'Checkout Securely'}
            </button>
            <Link href="/shop" className="mt-3 block text-center text-sm text-steel/70 hover:text-hazard">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
