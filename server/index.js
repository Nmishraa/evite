import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initDb } from './db.js';
import { createSshTunnel } from './tunnel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'connected',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '5433',
      database: process.env.DB_NAME || 'Neha_datta',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '5433'
    });
  }
});

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST or update event
app.post('/api/events', async (req, res) => {
  const { id, title, description, date, location, host, category, theme } = req.body;
  try {
    const query = `
      INSERT INTO events (id, title, description, date, location, host, category, theme)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) 
      DO UPDATE SET 
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        date = EXCLUDED.date,
        location = EXCLUDED.location,
        host = EXCLUDED.host,
        category = EXCLUDED.category,
        theme = EXCLUDED.theme
      RETURNING *;
    `;
    const values = [id, title, description, date, location, host, category, theme];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET guests for an event
app.get('/api/events/:eventId/guests', async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM guests WHERE event_id = $1 ORDER BY updated_at DESC', [eventId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST or update guest RSVP
app.post('/api/guests', async (req, res) => {
  const { id, eventId, name, email, status, plusOnes } = req.body;
  try {
    const query = `
      INSERT INTO guests (id, event_id, name, email, status, plus_ones, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        status = EXCLUDED.status,
        plus_ones = EXCLUDED.plus_ones,
        updated_at = NOW()
      RETURNING *;
    `;
    const values = [id, eventId, name, email, status, plusOnes || 0];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET comments for an event
app.get('/api/events/:eventId/comments', async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM comments WHERE event_id = $1 ORDER BY created_at ASC', [eventId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new comment
app.post('/api/comments', async (req, res) => {
  const { id, eventId, author, text } = req.body;
  try {
    const query = `
      INSERT INTO comments (id, event_id, author, text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id, eventId, author, text];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express server and verify DB connection
app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  try {
    await createSshTunnel();
    await initDb();
  } catch (err) {
    console.warn('Backend running in fallback mode until DB connection is active.');
  }
});
