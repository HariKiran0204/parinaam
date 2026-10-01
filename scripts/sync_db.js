const fs = require('fs');
const { Pool } = require('pg');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      dbUrl = trimmed.slice('DATABASE_URL='.length).trim();
      if ((dbUrl.startsWith('"') && dbUrl.endsWith('"')) || (dbUrl.startsWith("'") && dbUrl.endsWith("'"))) {
        dbUrl = dbUrl.slice(1, -1);
      }
      break;
    }
  }
}

console.log('Connecting to database...');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const res1 = await pool.query(
    "UPDATE users SET verification_status = 'pending', platform_fee_paid = FALSE WHERE role = 'student' AND verified_by IS NULL RETURNING id, full_name, email, verification_status;"
  );
  console.log(`Updated ${res1.rowCount} student records to 'pending'.`);

  const res2 = await pool.query(
    "SELECT verification_status, count(*) FROM users GROUP BY verification_status;"
  );
  console.log('Current user status breakdown:', res2.rows);

  await pool.end();
}

main().catch(err => {
  console.error('Error syncing db:', err);
  process.exit(1);
});
