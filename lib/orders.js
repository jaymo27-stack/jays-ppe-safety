const { db, ensureDatabase } = require('./db');

async function createOrder(data) {
  await ensureDatabase();
  const { rows } = await db.query(`
    INSERT INTO orders (stripe_session_id, customer_name, customer_email, shipping_address, items, amount_total, currency, status)
    VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, $8)
    RETURNING *
  `, [
    data.stripe_session_id || null, data.customer_name || '', data.customer_email || '',
    JSON.stringify(data.shipping_address || {}), JSON.stringify(data.items || []),
    data.amount_total || 0, data.currency || 'zar', data.status || 'pending',
  ]);
  return rowToOrder(rows[0]);
}

async function getOrderById(id) {
  await ensureDatabase();
  const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
  return rowToOrder(rows[0]);
}

async function getOrderBySessionId(sessionId) {
  await ensureDatabase();
  const { rows } = await db.query('SELECT * FROM orders WHERE stripe_session_id = $1', [sessionId]);
  return rowToOrder(rows[0]);
}

async function updateOrderStatusBySessionId(sessionId, status) {
  await ensureDatabase();
  await db.query('UPDATE orders SET status = $1 WHERE stripe_session_id = $2', [status, sessionId]);
}

async function getAllOrders() {
  await ensureDatabase();
  const { rows } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows.map(rowToOrder);
}

function rowToOrder(row) {
  if (!row) return null;
  return {
    ...row,
    shipping_address: row.shipping_address || {},
    items: row.items || [],
    amount_total: Number(row.amount_total),
  };
}

module.exports = {
  createOrder,
  getOrderById,
  getOrderBySessionId,
  updateOrderStatusBySessionId,
  getAllOrders,
};
