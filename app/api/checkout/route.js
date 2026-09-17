import { NextResponse } from 'next/server';
import { getStripe } from '../../../lib/stripe';
import { getProductBySlug } from '../../../lib/products';
import { describeSelection } from '../../../lib/sa-sizes';

export async function POST(request) {
  try {
    const body = await request.json();
    const cartItems = Array.isArray(body.items) ? body.items : [];

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    // Re-look-up every product server-side so prices can never be tampered with client-side.
    const line_items = [];
    for (const item of cartItems) {
      const product = getProductBySlug(item.slug);
      if (!product || !product.active) {
        return NextResponse.json({ error: `Product "${item.slug}" is no longer available.` }, { status: 400 });
      }
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      // Validate the size / colour choice against what this product actually offers,
      // so nothing invalid can be pushed through from the client.
      const productOptions = Array.isArray(product.options) ? product.options : [];
      const chosen = {};
      for (const opt of productOptions) {
        const value = item.options?.[opt.name];
        if (!value) {
          return NextResponse.json(
            { error: `Please choose a ${opt.name} for "${product.name}".` },
            { status: 400 }
          );
        }
        if (!opt.values.includes(String(value))) {
          return NextResponse.json(
            { error: `"${value}" is not an available ${opt.name} for "${product.name}".` },
            { status: 400 }
          );
        }
        chosen[opt.name] = String(value);
      }

      const selectionText = describeSelection(chosen);

      line_items.push({
        quantity,
        price_data: {
          currency: process.env.CURRENCY || 'zar',
          unit_amount: Math.round(product.price * 100),
          product_data: {
            // Selection goes in the name so it lands on the Stripe receipt,
            // the packing slip and the saved order record.
            name: selectionText ? `${product.name} (${selectionText})` : product.name,
            description: [selectionText, product.short_description].filter(Boolean).join(' — ') || undefined,
            images: product.image ? [`${siteUrl()}${product.image}`] : undefined,
          },
        },
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['ZA'] },
      phone_number_collection: { enabled: true },
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message || 'Could not start checkout. Please try again.' },
      { status: 500 }
    );
  }
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
