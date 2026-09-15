import { notFound } from 'next/navigation';
import ProductForm from '../../../../components/ProductForm';
import { getProductById } from '../../../../lib/products';

export const dynamic = 'force-dynamic';

export default function EditProductPage({ params }) {
  const product = getProductById(params.id);
  if (!product) return notFound();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-charcoal">Edit Product</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}
