'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '../../../lib/format';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-charcoal">Orders</h1>

      {loading ? (
        <p className="mt-6 text-steel/70">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-steel/70">
          No orders yet. Orders appear here automatically once a customer completes checkout.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="border-2 border-line bg-white">
              <button
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-left"
              >
                <div>
                  <p className="font-display text-charcoal">{o.customer_name || 'Guest'} — {o.customer_email}</p>
                  <p className="text-xs text-steel/60">{new Date(o.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase ${o.status === 'paid' ? 'bg-safety text-charcoal' : 'bg-line text-bone'}`}>
                    {o.status}
                  </span>
                  <span className="font-display text-lg text-charcoal">{formatPrice(o.amount_total)}</span>
                </div>
              </button>
              {expanded === o.id && (
                <div className="border-t-2 border-line p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">Items</h3>
                  <ul className="mt-2 space-y-1 text-sm text-steel/80">
                    {o.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity} × {item.name} — {formatPrice(item.amount)}
                      </li>
                    ))}
                  </ul>
                  {o.shipping_address && Object.keys(o.shipping_address).length > 0 && (
                    <>
                      <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-charcoal">Shipping Address</h3>
                      <p className="mt-1 text-sm text-steel/80">
                        {[o.shipping_address.line1, o.shipping_address.line2, o.shipping_address.city, o.shipping_address.postal_code, o.shipping_address.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </>
                  )}
                  <p className="mt-3 text-xs text-steel/50">Stripe session: {o.stripe_session_id}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
