const { db, rowToProduct } = require('./db');
const { normaliseOptions } = require('./sa-sizes');

// Accepts either a single `image` or an `images` array and keeps the two in sync,
// so older code paths that only know about `image` keep working.
function normaliseImages(data) {
  const list = Array.isArray(data.images) ? data.images.map((i) => String(i).trim()).filter(Boolean) : [];
  const primary = data.image ? String(data.image).trim() : '';
  if (primary && !list.includes(primary)) list.unshift(primary);
  return [...new Set(list)];
}

function primaryImage(data) {
  return normaliseImages(data)[0] || null;
}

function getAllProducts({ activeOnly = true } = {}) {
  const rows = activeOnly
    ? db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY category, name').all()
    : db.prepare('SELECT * FROM products ORDER BY category, name').all();
  return rows.map(rowToProduct);
}

function getProductsByCategory(category) {
  const rows = db
    .prepare('SELECT * FROM products WHERE category = ? AND active = 1 ORDER BY name')
    .all(category);
  return rows.map(rowToProduct);
}

function getProductBySlug(slug) {
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  return rowToProduct(row);
}

function getProductById(id) {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  return rowToProduct(row);
}

function createProduct(data) {
  const stmt = db.prepare(`
    INSERT INTO products (slug, name, brand, category, price, image, images, icon, short_description, features, sabs_approved, options, stock, active)
    VALUES (@slug, @name, @brand, @category, @price, @image, @images, @icon, @short_description, @features, @sabs_approved, @options, @stock, @active)
  `);
  const info = stmt.run({
    slug: data.slug,
    name: data.name,
    brand: data.brand || '',
    category: data.category,
    price: data.price,
    image: primaryImage(data),
    images: JSON.stringify(normaliseImages(data)),
    icon: data.icon || null,
    short_description: data.short_description || '',
    features: JSON.stringify(data.features || []),
    options: JSON.stringify(normaliseOptions(data.options)),
    sabs_approved: data.sabs_approved ? 1 : 0,
    stock: data.stock ?? 0,
    active: data.active ?? 1,
  });
  return getProductById(info.lastInsertRowid);
}

function updateProduct(id, data) {
  const existing = getProductById(id);
  if (!existing) return null;
  const merged = { ...existing, ...data };
  db.prepare(`
    UPDATE products SET
      slug = @slug,
      name = @name,
      brand = @brand,
      category = @category,
      price = @price,
      image = @image,
      images = @images,
      icon = @icon,
      short_description = @short_description,
      features = @features,
      options = @options,
      sabs_approved = @sabs_approved,
      stock = @stock,
      active = @active
    WHERE id = @id
  `).run({
    id,
    slug: merged.slug,
    name: merged.name,
    brand: merged.brand || '',
    category: merged.category,
    price: merged.price,
    image: primaryImage(merged),
    images: JSON.stringify(normaliseImages(merged)),
    icon: merged.icon || null,
    short_description: merged.short_description || '',
    features: JSON.stringify(merged.features || []),
    options: JSON.stringify(normaliseOptions(merged.options)),
    sabs_approved: merged.sabs_approved ? 1 : 0,
    stock: merged.stock ?? 0,
    active: merged.active ? 1 : 0,
  });
  return getProductById(id);
}

function deleteProduct(id) {
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
