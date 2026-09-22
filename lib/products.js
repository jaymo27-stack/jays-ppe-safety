const { db, ensureDatabase, rowToProduct } = require('./db');
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

async function getAllProducts({ activeOnly = true } = {}) {
  await ensureDatabase();
  const { rows } = await db.query(
    activeOnly
      ? 'SELECT * FROM products WHERE active = TRUE ORDER BY category, name'
      : 'SELECT * FROM products ORDER BY category, name'
  );
  return rows.map(rowToProduct);
}

async function getProductsByCategory(category) {
  await ensureDatabase();
  const { rows } = await db.query(
    'SELECT * FROM products WHERE category = $1 AND active = TRUE ORDER BY name',
    [category]
  );
  return rows.map(rowToProduct);
}

async function getProductBySlug(slug) {
  await ensureDatabase();
  const { rows } = await db.query('SELECT * FROM products WHERE slug = $1', [slug]);
  return rowToProduct(rows[0]);
}

async function getProductById(id) {
  await ensureDatabase();
  const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return rowToProduct(rows[0]);
}

async function createProduct(data) {
  await ensureDatabase();
  const { rows } = await db.query(`
    INSERT INTO products (slug, name, brand, category, price, image, images, icon, short_description, features, sabs_approved, options, stock, active)
    VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10::jsonb, $11, $12::jsonb, $13, $14)
    RETURNING *
  `, [
    data.slug, data.name, data.brand || '', data.category, data.price, primaryImage(data),
    JSON.stringify(normaliseImages(data)), data.icon || null, data.short_description || '',
    JSON.stringify(data.features || []), !!data.sabs_approved, JSON.stringify(normaliseOptions(data.options)),
    data.stock ?? 0, data.active !== false,
  ]);
  return rowToProduct(rows[0]);
}

async function updateProduct(id, data) {
  const existing = await getProductById(id);
  if (!existing) return null;
  const merged = { ...existing, ...data };
  const { rows } = await db.query(`
    UPDATE products SET
      slug = $1, name = $2, brand = $3, category = $4, price = $5,
      image = $6, images = $7::jsonb, icon = $8, short_description = $9,
      features = $10::jsonb, options = $11::jsonb, sabs_approved = $12,
      stock = $13, active = $14
    WHERE id = $15
    RETURNING *
  `, [
    merged.slug, merged.name, merged.brand || '', merged.category, merged.price, primaryImage(merged),
    JSON.stringify(normaliseImages(merged)), merged.icon || null, merged.short_description || '',
    JSON.stringify(merged.features || []), JSON.stringify(normaliseOptions(merged.options)),
    !!merged.sabs_approved, merged.stock ?? 0, !!merged.active, id,
  ]);
  return rowToProduct(rows[0]);
}

async function deleteProduct(id) {
  await ensureDatabase();
  await db.query('DELETE FROM products WHERE id = $1', [id]);
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
