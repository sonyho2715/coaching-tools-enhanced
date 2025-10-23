import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper function to get user ID
const getUserId = (req) => {
  return req.headers['x-user-id'] || 'demo-user';
};

// =====================
// CLIENTS API ROUTES
// =====================
app.get('/api/clients', async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await pool.query(
      'SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json({ clients: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { name, email, phone, notes } = req.body;

    const result = await pool.query(
      'INSERT INTO clients (user_id, name, email, phone, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, email || null, phone || null, notes || null]
    );
    res.status(201).json({ client: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.put('/api/clients', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id, name, email, phone, notes } = req.body;

    const result = await pool.query(
      'UPDATE clients SET name = $1, email = $2, phone = $3, notes = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, email || null, phone || null, notes || null, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({ client: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.delete('/api/clients', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.query;

    const result = await pool.query(
      'DELETE FROM clients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// =====================
// SESSIONS API ROUTES
// =====================
app.get('/api/sessions', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { clientId } = req.query;

    let result;
    if (clientId) {
      result = await pool.query(
        `SELECT s.*, c.name as client_name
         FROM sessions s
         JOIN clients c ON s.client_id = c.id
         WHERE s.client_id = $1 AND s.user_id = $2
         ORDER BY s.session_date DESC`,
        [clientId, userId]
      );
    } else {
      result = await pool.query(
        `SELECT s.*, c.name as client_name
         FROM sessions s
         JOIN clients c ON s.client_id = c.id
         WHERE s.user_id = $1
         ORDER BY s.session_date DESC
         LIMIT 100`,
        [userId]
      );
    }

    res.status(200).json({ sessions: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      clientId,
      sessionDate,
      duration,
      notes,
      problemIdentified,
      toolsUsed
    } = req.body;

    if (!clientId || !sessionDate) {
      return res.status(400).json({
        error: 'Client ID and session date are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO sessions (client_id, user_id, session_date, duration, notes, problem_identified, tools_used)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        clientId,
        userId,
        sessionDate,
        duration || null,
        notes || null,
        problemIdentified || null,
        JSON.stringify(toolsUsed || [])
      ]
    );

    res.status(201).json({ session: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// =====================
// ASSESSMENTS API ROUTES
// =====================
app.get('/api/assessments', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { clientId } = req.query;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const result = await pool.query(
      'SELECT * FROM assessments WHERE client_id = $1 AND user_id = $2 ORDER BY updated_at DESC LIMIT 1',
      [clientId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ assessment: null });
    }

    res.status(200).json({ assessment: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/assessments', async (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      clientId,
      personalHistory,
      readinessAnswers,
      wheelScores,
      mapUpdate,
      somAnswers,
      vakadAnswers,
      valuesData,
      beliefsData,
      energyData,
      goalsData,
      personalColorAnswers,
      spiralAnswers,
      metaProgramsAnswers,
      reframingData,
      anchoringData,
      timelineData,
      sessionNotes,
      followupData
    } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    // Check if assessment exists
    const existing = await pool.query(
      'SELECT id FROM assessments WHERE client_id = $1 AND user_id = $2',
      [clientId, userId]
    );

    let result;

    if (existing.rows.length > 0) {
      // Update existing assessment
      result = await pool.query(
        `UPDATE assessments
         SET personal_history = $1, readiness_answers = $2, wheel_scores = $3,
             map_update = $4, som_answers = $5, vakad_answers = $6,
             values_data = $7, beliefs_data = $8, energy_data = $9,
             goals_data = $10, personal_color_answers = $11, spiral_answers = $12,
             meta_programs_answers = $13, reframing_data = $14, anchoring_data = $15,
             timeline_data = $16, session_notes = $17, followup_data = $18
         WHERE id = $19
         RETURNING *`,
        [
          JSON.stringify(personalHistory || null),
          JSON.stringify(readinessAnswers || null),
          JSON.stringify(wheelScores || null),
          JSON.stringify(mapUpdate || null),
          JSON.stringify(somAnswers || null),
          JSON.stringify(vakadAnswers || null),
          JSON.stringify(valuesData || null),
          JSON.stringify(beliefsData || null),
          JSON.stringify(energyData || null),
          JSON.stringify(goalsData || null),
          JSON.stringify(personalColorAnswers || null),
          JSON.stringify(spiralAnswers || null),
          JSON.stringify(metaProgramsAnswers || null),
          JSON.stringify(reframingData || null),
          JSON.stringify(anchoringData || null),
          JSON.stringify(timelineData || null),
          JSON.stringify(sessionNotes || null),
          JSON.stringify(followupData || null),
          existing.rows[0].id
        ]
      );
    } else {
      // Create new assessment
      result = await pool.query(
        `INSERT INTO assessments (
          client_id, user_id, personal_history, readiness_answers, wheel_scores,
          map_update, som_answers, vakad_answers, values_data, beliefs_data,
          energy_data, goals_data, personal_color_answers, spiral_answers,
          meta_programs_answers, reframing_data, anchoring_data, timeline_data,
          session_notes, followup_data
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         RETURNING *`,
        [
          clientId,
          userId,
          JSON.stringify(personalHistory || null),
          JSON.stringify(readinessAnswers || null),
          JSON.stringify(wheelScores || null),
          JSON.stringify(mapUpdate || null),
          JSON.stringify(somAnswers || null),
          JSON.stringify(vakadAnswers || null),
          JSON.stringify(valuesData || null),
          JSON.stringify(beliefsData || null),
          JSON.stringify(energyData || null),
          JSON.stringify(goalsData || null),
          JSON.stringify(personalColorAnswers || null),
          JSON.stringify(spiralAnswers || null),
          JSON.stringify(metaProgramsAnswers || null),
          JSON.stringify(reframingData || null),
          JSON.stringify(anchoringData || null),
          JSON.stringify(timelineData || null),
          JSON.stringify(sessionNotes || null),
          JSON.stringify(followupData || null)
        ]
      );
    }

    res.status(200).json({ assessment: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.put('/api/assessments', async (req, res) => {
  // Reuse POST handler for PUT requests
  return app._router.handle(Object.assign(req, { method: 'POST' }), res);
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
