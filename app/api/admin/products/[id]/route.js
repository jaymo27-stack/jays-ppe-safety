import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '../../../../../lib/products';

export async function GET(request, { params }) {
  const product = await getProductById(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const product = await updateProduct(params.id, data);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    const message = err.code === '23505' || err.message?.includes('UNIQUE')
      ? 'A product with that slug already exists.'
      : err.message || 'Could not update product.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
