import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
})

// Test connection on initialization
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err)
  process.exit(-1)
})

// Export query helper
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  
  if (process.env.DEBUG_LOGGING === 'true') {
    console.log('[DB Query]', { text, duration, rows: res.rowCount })
  }
  
  return res
}
