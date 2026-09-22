import Link from 'next/link';
import { getStripe } from '../../../lib/stripe';
import { createOrder, getOrderBySessionId } from '../../../lib/orders';
import { formatPrice } from '../../../lib/format';

export const dynamic = 'force-dynamic';

async function getSessionDetails(sessionId) {
  if (!sessionId) return null;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    // Fallback: record the order here too, in case the webhook hasn't reached this server yet
    // (e.g. running locally without the Stripe CLI forwarding events).
    if (session.payment_status === 'paid' && !(await getOrderBySessionId(session.id))) {
      await createOrder({
        stripe_session_id: session.id,
        customer_name: session.customer_details?.name || '',
        customer_email: session.customer_details?.email || '',
        shipping_address: session.shipping_details?.address || session.customer_details?.address || {},
        items: (session.line_items?.data || []).map((li) => ({
          name: li.description,
          quantity: li.quantity,
          amount: li.amount_total / 100,
        })),
        amount_total: (session.amount_total || 0) / 100,
        currency: session.currency,
        status: 'paid',
      });
    }

    return session;
  } catch (e) {
    console.error('Could not retrieve session:', e.message);
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const session = await getSessionDetails(searchParams?.session_id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-safety text-3xl">
        ✓
      </div>
      <h1 className="mt-6 font-display text-3xl uppercase tracking-wide text-charcoal">
        Thank you for your order!
      </h1>

      {session ? (
        <div className="mt-6 border-2 border-line bg-white p-6 text-left">
          <p className="text-sm text-steel/70">Order reference</p>
          <p className="font-display text-lg text-charcoal">{session.id}</p>
          {session.customer_details?.email && (
            <p className="mt-2 text-sm text-steel/80">
              A confirmation has been sent to {session.customer_details.email}.
            </p>
          )}
          {session.amount_total != null && (
            <p className="mt-4 font-display text-2xl text-charcoal">
              Total paid: {formatPrice(session.amount_total / 100)}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 text-steel/70">
          We couldn't find that order — if you were charged, please contact us and we'll sort it out.
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        <a href="tel:0824778280" className="btn-outline">Call Us: 082 477 8280</a>
      </div>
    </div>
  );
}
