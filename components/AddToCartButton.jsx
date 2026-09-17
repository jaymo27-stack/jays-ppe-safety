'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';

// Swatch colours so Black / Brown show as actual colour chips, not just words.
const COLOUR_SWATCHES = {
  black: '#1A1A18',
  brown: '#6B4423',
  white: '#F5F5F0',
  navy: '#1F2A44',
  orange: '#F26419',
  yellow: '#F5B700',
  'royal blue': '#1E40AF',
  red: '#B91C1C',
  green: '#166534',
  grey: '#6B7280',
  gray: '#6B7280',
};

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const options = Array.isArray(product.options) ? product.options : [];

  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState({});
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const missing = options.filter((o) => !selected[o.name]);

  function choose(name, value) {
    setSelected((s) => ({ ...s, [name]: value }));
    setError('');
  }

  function validate() {
    if (missing.length > 0) {
      const labels = missing.map((o) => o.name).join(' and ');
      setError(`Please choose a ${labels} before continuing.`);
      return false;
    }
    return true;
  }

  function handleAdd() {
    if (!validate()) return;
    addItem(product, quantity, selected);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (!validate()) return;
    addItem(product, quantity, selected);
    router.push('/cart');
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {options.map((opt) => {
        const isColour = opt.name === 'colour';
        return (
          <div key={opt.name}>
            <div className="flex items-baseline justify-between gap-4">
              <label className="text-sm font-bold uppercase tracking-wide text-charcoal">
                {opt.label}
                {selected[opt.name] && (
                  <span className="ml-2 font-normal normal-case text-steel/70">
                    {selected[opt.name]}
                  </span>
                )}
              </label>
              {opt.guide && (
                <Link
                  href={`/size-guide#${opt.guide}`}
                  className="text-xs font-bold uppercase tracking-wide text-hazard hover:underline"
                >
                  Size Guide
                </Link>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {opt.values.map((value) => {
                const active = selected[opt.name] === value;
                const swatch = COLOUR_SWATCHES[String(value).toLowerCase()];
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => choose(opt.name, value)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 border-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                      active
                        ? 'border-charcoal bg-charcoal text-safety'
                        : 'border-line bg-white text-charcoal hover:border-charcoal'
                    }`}
                  >
                    {isColour && swatch && (
                      <span
                        className="inline-block h-4 w-4 rounded-full border border-line"
                        style={{ backgroundColor: swatch }}
                        aria-hidden="true"
                      />
                    )}
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

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

      {error && <p className="text-sm font-bold text-hazard">{error}</p>}

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
