import 'dotenv/config';

import {neon} from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Pool } from 'pg';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';

// Determine if we're using Neon Local or Neon Cloud based on the DATABASE_URL
const isNeonLocal = process.env.NODE_ENV === 'development' && 
  process.env.DATABASE_URL && 
  (process.env.DATABASE_URL.includes('neon-local') || process.env.DATABASE_URL.includes('localhost'));

let db, sql;

if (isNeonLocal) {
  // Use PostgreSQL pool for Neon Local
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Neon Local doesn't require SSL
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close clients after 30 seconds of inactivity
    connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
  });
  
  db = drizzleNode(pool);
  sql = pool;
  
  console.log('✅ Connected to Neon Local (PostgreSQL)');
} else {
  // Use Neon serverless for production/cloud
  sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql);
  
  console.log('✅ Connected to Neon Cloud (Serverless)');
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  if (isNeonLocal && sql) {
    console.log('Closing database connection...');
    await sql.end();
  }
  process.exit(0);
});

export { db, sql };

