# Jay's PPE & Safety — Online Store

A full online store for Jay's PPE & Safety, built with Next.js. Includes a product catalog,
shopping cart, real Stripe checkout, and a password-protected admin dashboard for managing
products and viewing orders.

## What's included

- **Storefront** — homepage, category browsing, product pages, cart, all styled to match your
  brand (black / safety yellow / hazard orange), using your real product photos.
- **Checkout** — Stripe Checkout (hosted payment page). Card details never touch this server.
- **Admin dashboard** (`/admin`) — add/edit/delete products, change prices and stock, hide items
  from the store, and view paid orders.
- **Database** — a local SQLite file (`data/store.db`), created automatically the first time you
  run the app, pre-loaded with the 21 products from your flyers (placeholder prices).

## 1. Install

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
cd jays-ppe-safety
npm install
```

## 2. Configure your environment

Copy the example env file and fill in your real values:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

| Variable | What it is |
|---|---|
| `STRIPE_SECRET_KEY` | From your [Stripe Dashboard → API keys](https://dashboard.stripe.com/apikeys). Start with a **test** key (`sk_test_...`) while you're setting up. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page, the `pk_test_...` key. |
| `STRIPE_WEBHOOK_SECRET` | See step 4 below. |
| `CURRENCY` / `NEXT_PUBLIC_CURRENCY` | Defaults to South African Rand (`zar` / `ZAR`). Change if needed. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Your login for `/admin`. **Change these from the defaults.** |
| `JWT_SECRET` | Any long random string — used to sign admin login sessions. Change it to something unique. |
| `NEXT_PUBLIC_SITE_URL` | Your site's URL. `http://localhost:3000` while developing; your real domain once deployed. |

## 3. Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the store, and `http://localhost:3000/admin` for the dashboard.

**First things to do in the admin dashboard:**
- Go to **Products** and update the placeholder prices to your real prices.
- Toggle any products you don't want live yet to "Hidden".

## 4. Set up real payments (Stripe)

1. Create a free account at [stripe.com](https://stripe.com) if you don't have one.
2. Get your API keys from the Dashboard and put them in `.env.local` (step 2).
3. **Webhook** (so paid orders always get recorded, even if a customer closes the browser
   right after paying):
   - While developing locally, install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhook
     ```
     It will print a `whsec_...` value — put that in `STRIPE_WEBHOOK_SECRET`.
   - Once deployed, go to Stripe Dashboard → Developers → Webhooks → **Add endpoint**, set the
     URL to `https://yourdomain.com/api/webhook`, select the `checkout.session.completed` event,
     and copy the signing secret into your production environment variables.
4. Test a purchase using [Stripe's test card numbers](https://docs.stripe.com/testing) (e.g.
   `4242 4242 4242 4242`, any future expiry, any CVC).
5. When you're ready to accept real payments, switch `STRIPE_SECRET_KEY` and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to your **live** keys (Stripe Dashboard toggle in the
   top-left), and set up the live-mode webhook the same way.

## 5. Deploy it

The easiest option is [Vercel](https://vercel.com) (made by the creators of Next.js):

1. Push this project to a GitHub repository.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add all the variables from `.env.local` in the Vercel project's Environment Variables settings.
4. Deploy. Update `NEXT_PUBLIC_SITE_URL` to your live URL and redeploy.
5. Add the production webhook endpoint in Stripe (step 4 above) pointing at your live URL.

Other hosts that work well with Next.js: Render, Railway, or your own server (`npm run build`
then `npm run start`).

> **Note on the database:** this project uses a local SQLite file for simplicity. That works
> great on a traditional server (Render, Railway, your own VPS) but **not** on Vercel's
> serverless functions, since the filesystem resets on every deploy. If you deploy to Vercel,
> ask to have the database swapped for a hosted option (e.g. Vercel Postgres, Turso, or
> PlanetScale) — the product/order logic in `lib/products.js` and `lib/orders.js` is written so
> that swap only touches those two files.

## Managing products & orders

Everything in the catalog can be managed from `/admin` — no code changes needed for day-to-day
use:

- **Add a product**: Products → *Add Product*. Fill in name, category, price, description and
  features. To use a real photo, drop the image file into `public/images/products/` first, then
  type its path (e.g. `/images/products/my-new-item.jpg`) into the Image field.
- **Edit or hide a product**: click *Edit* on any row, or use the Active toggle to hide it from
  the store without deleting it.
- **View orders**: Orders tab shows every completed payment, with items, totals and shipping
  address.

## Project structure

```
app/                    Pages & API routes (Next.js App Router)
  admin/                Admin dashboard pages
  api/                  API routes (checkout, webhook, admin CRUD)
  product/[slug]/       Product detail pages
  shop/[category]/      Category listing pages
components/             Reusable React components
lib/                    Database, auth, Stripe, formatting helpers
data/                   Seed product data, categories, and the SQLite database file
public/images/          Product photos and logo
```

## Support

For questions about the code, ask Claude. For Stripe account issues, see
[support.stripe.com](https://support.stripe.com).
