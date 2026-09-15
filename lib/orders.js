const { db } = require('./db');

function createOrder(data) {
  const stmt = db.prepare(`
    INSERT INTO orders (stripe_session_id, customer_name, customer_email, shipping_address, items, amount_total, currency, status)
    VALUES (@stripe_session_id, @customer_name, @customer_email, @shipping_address, @items, @amount_total, @currency, @status)
  `);
  const info = stmt.run({
    stripe_session_id: data.stripe_session_id || null,
    customer_name: data.customer_name || '',
    customer_email: data.customer_email || '',
    shipping_address: JSON.stringify(data.shipping_address || {}),
    items: JSON.stringify(data.items || []),
    amount_total: data.amount_total || 0,
    currency: data.currency || 'zar',
    status: data.status || 'pending',
  });
  return getOrderById(info.lastInsertRowid);
}

function getOrderById(id) {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  return rowToOrder(row);
}

function getOrderBySessionId(sessionId) {
  const row = db.prepare('SELECT * FROM orders WHERE stripe_session_id = ?').get(sessionId);
  return rowToOrder(row);
}

function updateOrderStatusBySessionId(sessionId, status) {
  db.prepare('UPDATE orders SET status = ? WHERE stripe_session_id = ?').run(status, sessionId);
}

function getAllOrders() {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  return rows.map(rowToOrder);
}

function rowToOrder(row) {
  if (!row) return null;
  return {
    ...row,
    shipping_address: row.shipping_address ? JSON.parse(row.shipping_address) : {},
    items: row.items ? JSON.parse(row.items) : [],
  };
}

module.exports = {
  createOrder,
  getOrderById,
  getOrderBySessionId,
  updateOrderStatusBySessionId,
  getAllOrders,
};
