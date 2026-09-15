'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    router.push('/cart');
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-bold uppercase tracking-wide text-charcoal">
          Qty
        </label>
        <div className="flex items-center border-2 border-line">
          <button
            type="button"
            className="px-3 py-2 text-lg font-bold text-charcoal hover:bg-bone"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="qty"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-14 border-x-2 border-line py-2 text-center focus:outline-none"
          />
          <button
            type="button"
            className="px-3 py-2 text-lg font-bold text-charcoal hover:bg-bone"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleAdd} className="btn-secondary">
          {added ? 'Added ✓' : 'Add to Cart'}
        </button>
        <button type="button" onClick={handleBuyNow} className="btn-primary">
          Buy Now
        </button>
      </div>
    </div>
  );
}
