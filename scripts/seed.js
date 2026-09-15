// The database auto-seeds itself the first time the app runs, so you normally
// don't need this. Use it if you've deleted data/store.db and want to recreate
// it with the default product catalog without starting the whole app.

const { db } = require('../lib/db');

const count = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
console.log(`✓ Database ready at data/store.db — ${count} products loaded.`);
