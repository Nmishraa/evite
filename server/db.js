import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || '2.24.200.44',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER || 'neha_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Neha_datta',
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// Initialize database schema tables if not exist
export async function initDb() {
  const client = await pool.connect();
  try {
    console.log(`Connecting to PostgreSQL database at ${process.env.DB_HOST || '2.24.200.44'}:${process.env.DB_PORT || '5433'}...`);
    
    // Create User table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        "isGuest" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date VARCHAR(100),
        location TEXT,
        host VARCHAR(255),
        category VARCHAR(100),
        theme VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure main event exists for foreign key references
    await client.query(`
      INSERT INTO events (id, title, description, date, location, host)
      VALUES ('main-event-2026', 'My Special Event', 'Join us for a great night!', 'July 15, 2026', 'Skyline Terrace, NY', 'Alex & Jordan')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Create guests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id VARCHAR(255) PRIMARY KEY,
        event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pending',
        plus_ones INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(255) PRIMARY KEY,
        event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
        author VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables verified/created successfully.');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}
