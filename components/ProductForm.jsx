'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import categories from '../data/categories';
import OptionsEditor from './OptionsEditor';
import ImagesEditor from './ImagesEditor';
import { defaultOptionsForCategory } from '../lib/sa-sizes';

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
    images: initialProduct?.images?.length
      ? initialProduct.images
      : initialProduct?.image
        ? [initialProduct.image]
        : [],
    icon: initialProduct?.icon || ICONS[0],
    short_description: initialProduct?.short_description || '',
    features: (initialProduct?.features || []).join('\n'),
    options: initialProduct
      ? initialProduct.options || []
      : defaultOptionsForCategory(categories[0].slug),
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
      options: (form.options || [])
        .map((o) => ({
          name: String(o.name || '').trim().toLowerCase(),
          label: String(o.label || '').trim() || String(o.name || '').trim(),
          values: (o.values || []).map((v) => String(v).trim()).filter(Boolean),
          guide: o.guide || null,
        }))
        .filter((o) => o.name && o.values.length > 0),
      images: (form.images || []).map((i) => String(i).trim()).filter(Boolean),
      image: (form.images || []).map((i) => String(i).trim()).filter(Boolean)[0] || null,
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
          <select
            className="input-field mt-1"
            value={form.category}
            onChange={(e) => {
              const next = e.target.value;
              update('category', next);
              // New products pick up the standard SA options for their category.
              if (!isEdit) update('options', defaultOptionsForCategory(next));
            }}
          >
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

      <ImagesEditor images={form.images} onChange={(images) => update('images', images)} />

      {form.images.filter(Boolean).length === 0 && (
        <div>
          <label className="text-sm font-bold uppercase tracking-wide text-charcoal">Fallback Icon</label>
          <select className="input-field mt-1" value={form.icon} onChange={(e) => update('icon', e.target.value)}>
            {ICONS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      )}

      <OptionsEditor
        options={form.options}
        category={form.category}
        onChange={(options) => update('options', options)}
      />

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
