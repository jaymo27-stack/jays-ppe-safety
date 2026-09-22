import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '../../../../lib/products';

export async function GET() {
  const products = await getAllProducts({ activeOnly: false });
  return NextResponse.json({ products });
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.slug || !data.name || !data.category || data.price == null) {
      return NextResponse.json({ error: 'Slug, name, category and price are required.' }, { status: 400 });
    }
    const product = await createProduct(data);
    return NextResponse.json({ product });
  } catch (err) {
    const message = err.code === '23505' || err.message?.includes('UNIQUE')
      ? 'A product with that slug already exists.'
      : err.message || 'Could not create product.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
