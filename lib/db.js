const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const seedProducts = require('../data/products-seed');

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'store.db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

let db = global._jaysDb;
if (!db) {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  global._jaysDb = db;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    images TEXT DEFAULT '[]',
    icon TEXT,
    short_description TEXT,
    features TEXT,
    sabs_approved INTEGER DEFAULT 0,
    options TEXT DEFAULT '[]',
    stock INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT UNIQUE,
    customer_name TEXT,
    customer_email TEXT,
    shipping_address TEXT,
    items TEXT NOT NULL,
    amount_total REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// --- Migration: add `options` to databases created before variants existed ---
const productColumns = db.prepare('PRAGMA table_info(products)').all().map((c) => c.name);
if (!productColumns.includes('options')) {
  db.exec("ALTER TABLE products ADD COLUMN options TEXT DEFAULT '[]'");
  // Backfill existing rows with the standard SA size/colour options for their category.
  const { defaultOptionsForCategory } = require('./sa-sizes');
  const rows = db.prepare('SELECT id, category FROM products').all();
  const setOptions = db.prepare('UPDATE products SET options = ? WHERE id = ?');
  const backfill = db.transaction((list) => {
    for (const r of list) {
      setOptions.run(JSON.stringify(defaultOptionsForCategory(r.category)), r.id);
    }
  });
  backfill(rows);
}

// --- Migration: add `images` (photo gallery) to older databases ---
if (!productColumns.includes('images')) {
  db.exec("ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]'");
  // Seed the gallery with whatever single photo the product already had.
  const rows = db.prepare('SELECT id, image FROM products').all();
  const setImages = db.prepare('UPDATE products SET images = ? WHERE id = ?');
  const backfillImages = db.transaction((list) => {
    for (const r of list) {
      setImages.run(JSON.stringify(r.image ? [r.image] : []), r.id);
    }
  });
  backfillImages(rows);
}

// Auto-seed on first run
const productCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
if (productCount === 0) {
  const insert = db.prepare(`
    INSERT INTO products (slug, name, brand, category, price, image, images, icon, short_description, features, sabs_approved, options, stock, active)
    VALUES (@slug, @name, @brand, @category, @price, @image, @images, @icon, @short_description, @features, @sabs_approved, @options, @stock, @active)
  `);
  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run({
        ...row,
        features: JSON.stringify(row.features || []),
        options: JSON.stringify(row.options || []),
        images: JSON.stringify(row.images || (row.image ? [row.image] : [])),
        sabs_approved: row.sabs_approved ? 1 : 0,
      });
    }
  });
  insertMany(seedProducts);
}

function safeParse(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

// The gallery always leads with the product's primary image, with no duplicates.
function galleryFor(row) {
  const list = safeParse(row.images).map(String).filter(Boolean);
  if (row.image && !list.includes(row.image)) list.unshift(row.image);
  return list;
}

function rowToProduct(row) {
  if (!row) return null;
  return {
    ...row,
    features: row.features ? JSON.parse(row.features) : [],
    options: safeParse(row.options),
    images: galleryFor(row),
    sabs_approved: !!row.sabs_approved,
    active: !!row.active,
  };
}

module.exports = {
  db,
  rowToProduct,
};
