import { NextResponse } from 'next/server';
import { getStripe } from '../../../lib/stripe';
import { createOrder, getOrderBySessionId, updateOrderStatusBySessionId } from '../../../lib/orders';

// Stripe needs the raw request body to verify the webhook signature.
export const runtime = 'nodejs';

export async function POST(request) {
  const stripe = getStripe();
  const sig = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const existing = getOrderBySessionId(session.id);

    if (!existing) {
      let lineItems = [];
      try {
        const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
        lineItems = items.data.map((li) => ({
          name: li.description,
          quantity: li.quantity,
          amount: li.amount_total / 100,
        }));
      } catch (e) {
        console.error('Could not fetch line items:', e.message);
      }

      createOrder({
        stripe_session_id: session.id,
        customer_name: session.customer_details?.name || '',
        customer_email: session.customer_details?.email || '',
        shipping_address: session.shipping_details?.address || session.customer_details?.address || {},
        items: lineItems,
        amount_total: (session.amount_total || 0) / 100,
        currency: session.currency,
        status: 'paid',
      });
    } else {
      updateOrderStatusBySessionId(session.id, 'paid');
    }
  }

  return NextResponse.json({ received: true });
}
