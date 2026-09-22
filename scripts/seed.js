// The database auto-seeds itself the first time the app runs, so you normally
// don't need this. Use it to initialise the Postgres catalog without starting
// the whole app.

const { db, ensureDatabase } = require('../lib/db');

ensureDatabase()
	.then(async () => {
		const { rows } = await db.query('SELECT COUNT(*)::int AS count FROM products');
		console.log(`Database ready — ${rows[0].count} products loaded.`);
		await db.end();
	})
	.catch((error) => {
		console.error('Could not initialise database:', error.message);
		process.exitCode = 1;
	});
