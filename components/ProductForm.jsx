'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import categories from '../data/categories';

const ICONS = ['helmet', 'boot', 'gumboot', 'worksuit', 'jacket', 'glove', 'vest', 'goggles', 'earmuffs', 'respirator', 'firstaid'];

export default function ProductForm({ initialProduct }) {
  const isEdit = !!initialProduct;
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    slug: initialProduct?.slug || '',
    name: initialProduct?.name || '',
    brand: initialProduct?.brand || '',
    category: initialProduct?.category || categories[0].slug,
    price: initialProduct?.price ?? '',
    stock: initialProduct?.stock ?? 0,
    image: initialProduct?.image || '',
    icon: initialProduct?.icon || ICONS[0],
    short_description: initialProduct?.short_description || '',
    features: (initialProduct?.features || []).join('\n'),
    sabs_approved: !!initialProduct?.sabs_approved,
    active: initialProduct ? !!initialProduct.active : true,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function autoSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      image: form.image.trim() || null,
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialProduct.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save product.');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid max-w-3xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Product Name</label>
          <input
            className="input-field mt-1"
            value={form.name}
            onChange={(e) => {
              update('name', e.target.value);
              if (!isEdit) update('slug', autoSlug(e.target.value));
            }}
            required
          />
        </div>
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Slug (URL)</label>
          <input
            className="input-field mt-1"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Brand</label>
          <input className="input-field mt-1" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Category</label>
          <select className="input-field mt-1" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Price (R)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-field mt-1"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Stock Quantity</label>
          <input
            type="number"
            min="0"
            className="input-field mt-1"
            value={form.stock}
            onChange={(e) => update('stock', e.target.value)}
          />
        </div>
        <div className="flex items-end gap-6 pb-2">
          <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-charcoal">
            <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
            Active (visible in store)
          </label>
          <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-charcoal">
            <input type="checkbox" checked={form.sabs_approved} onChange={(e) => update('sabs_approved', e.target.checked)} />
            SABS Approved
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm font-bold uppercase tracking-wide text-charcoal">
          Image Path <span className="font-normal normal-case text-steel/60">(optional — leave blank to use an icon)</span>
        </label>
        <input
          className="input-field mt-1"
          placeholder="/images/products/example.jpg"
          value={form.image}
          onChange={(e) => update('image', e.target.value)}
        />
        <p className="mt-1 text-xs text-steel/60">
          Drop new photos into <code>/public/images/products/</code> in the project, then reference the path here.
        </p>
      </div>

      {!form.image && (
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Fallback Icon</label>
          <select className="input-field mt-1" value={form.icon} onChange={(e) => update('icon', e.target.value)}>
            {ICONS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Short Description</label>
        <textarea
          className="input-field mt-1"
          rows={2}
          value={form.short_description}
          onChange={(e) => update('short_description', e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-bold uppercase tracking-wide text-charcoal">
          Features <span className="font-normal normal-case text-steel/60">(one per line)</span>
        </label>
        <textarea
          className="input-field mt-1"
          rows={5}
          value={form.features}
          onChange={(e) => update('features', e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-hazard">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/dashboard')} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
