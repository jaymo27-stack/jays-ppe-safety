'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
// v2: cart lines now carry size / colour selections, so the storage key changed.
const STORAGE_KEY = 'jays-ppe-cart-v2';

// A cart line is identified by the product PLUS its chosen options, so a
// size 9 black boot and a size 10 brown boot are two separate lines.
function lineKey(slug, options) {
  const parts = Object.keys(options || {})
    .sort()
    .map((k) => `${k}=${options[k]}`);
  return parts.length ? `${slug}::${parts.join('|')}` : slug;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // storage unavailable — cart still works for this session
    }
  }, [items, loaded]);

  function addItem(product, quantity = 1, options = {}) {
    const key = lineKey(product.slug, options);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          icon: product.icon,
          options,
          quantity,
        },
      ];
    });
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateQuantity(key, quantity) {
    if (quantity < 1) return removeItem(key);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    loaded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
