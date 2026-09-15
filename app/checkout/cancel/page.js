import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-hazard text-3xl text-white">
        ✕
      </div>
      <h1 className="mt-6 font-display text-3xl uppercase tracking-wide text-charcoal">
        Checkout Cancelled
      </h1>
      <p className="mt-3 text-steel/70">
        No payment was taken. Your cart is still saved if you'd like to try again.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/cart" className="btn-primary">Return to Cart</Link>
        <Link href="/shop" className="btn-outline">Keep Shopping</Link>
      </div>
    </div>
  );
}
