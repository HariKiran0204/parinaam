const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const res = await pool.query('SELECT id, name, status, registration_open, fee FROM events ORDER BY created_at DESC');
  console.log('ALL EVENTS IN DB:');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

main().catch(console.error);
