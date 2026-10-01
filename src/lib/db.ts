import { Pool } from 'pg';
import { mockDb } from './mockStore';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('rds.amazonaws.com')
    ? { rejectUnauthorized: false }
    : process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.warn('PostgreSQL pool error notice:', err.message);
});

export const db = {
  query: async (text: string, params?: unknown[]): Promise<{ rows: any[]; rowCount: number }> => {
    // If PostgreSQL URL is configured, attempt live query
    if (process.env.DATABASE_URL) {
      try {
        const start = Date.now();
        const res = await pool.query(text, params as any[]);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development') {
          console.log('Executed live PostgreSQL query', { text: text.slice(0, 60), duration, rows: res.rowCount });
        }
        return { rows: res.rows || [], rowCount: res.rowCount ?? (res.rows ? res.rows.length : 0) };
      } catch (err: any) {
        console.warn(`[DB notice] PostgreSQL query error (${err.message}). Using local store.`);
      }
    }

    // In-memory database store
    const start = Date.now();
    const res = await mockDb.executeQuery(text, (params || []) as any[]);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed In-Memory query', { text: text.slice(0, 60), duration, rows: res.rowCount });
    }
    return res;
  },
  getClient: () => pool.connect(),
};

export default pool;
