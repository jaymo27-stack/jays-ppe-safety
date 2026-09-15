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
    icon TEXT,
    short_description TEXT,
    features TEXT,
    sabs_approved INTEGER DEFAULT 0,
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

// Auto-seed on first run
const productCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
if (productCount === 0) {
  const insert = db.prepare(`
    INSERT INTO products (slug, name, brand, category, price, image, icon, short_description, features, sabs_approved, stock, active)
    VALUES (@slug, @name, @brand, @category, @price, @image, @icon, @short_description, @features, @sabs_approved, @stock, @active)
  `);
  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run({
        ...row,
        features: JSON.stringify(row.features || []),
        sabs_approved: row.sabs_approved ? 1 : 0,
      });
    }
  });
  insertMany(seedProducts);
}

function rowToProduct(row) {
  if (!row) return null;
  return {
    ...row,
    features: row.features ? JSON.parse(row.features) : [],
    sabs_approved: !!row.sabs_approved,
    active: !!row.active,
  };
}

module.exports = {
  db,
  rowToProduct,
};
