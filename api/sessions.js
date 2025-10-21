import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get user ID from Clerk (will be set after Clerk is configured)
  const userId = req.headers['x-user-id'] || 'demo-user';

  try {
    switch (req.method) {
      case 'GET':
        // Get sessions for a client or all clients
        const { clientId } = req.query;

        let query;
        if (clientId) {
          query = sql`
            SELECT s.*, c.name as client_name
            FROM sessions s
            JOIN clients c ON s.client_id = c.id
            WHERE s.client_id = ${clientId} AND s.user_id = ${userId}
            ORDER BY s.session_date DESC
          `;
        } else {
          query = sql`
            SELECT s.*, c.name as client_name
            FROM sessions s
            JOIN clients c ON s.client_id = c.id
            WHERE s.user_id = ${userId}
            ORDER BY s.session_date DESC
            LIMIT 100
          `;
        }

        const { rows: sessions } = await query;
        return res.status(200).json({ sessions });

      case 'POST':
        // Create a new session
        const {
          clientId: sessionClientId,
          sessionDate,
          duration,
          notes,
          problemIdentified,
          toolsUsed
        } = req.body;

        if (!sessionClientId || !sessionDate) {
          return res.status(400).json({
            error: 'Client ID and session date are required'
          });
        }

        const { rows: newSession } = await sql`
          INSERT INTO sessions (
            client_id, user_id, session_date, duration,
            notes, problem_identified, tools_used
          )
          VALUES (
            ${sessionClientId},
            ${userId},
            ${sessionDate},
            ${duration || null},
            ${notes || null},
            ${problemIdentified || null},
            ${JSON.stringify(toolsUsed || [])}
          )
          RETURNING *
        `;

        return res.status(201).json({ session: newSession[0] });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
