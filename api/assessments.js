import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get user ID from Clerk (will be set after Clerk is configured)
  const userId = req.headers['x-user-id'] || 'demo-user';

  try {
    switch (req.method) {
      case 'GET':
        // Get assessment data for a specific client
        const { clientId } = req.query;

        if (!clientId) {
          return res.status(400).json({ error: 'Client ID is required' });
        }

        const { rows: assessments } = await sql`
          SELECT * FROM assessments
          WHERE client_id = ${clientId} AND user_id = ${userId}
          ORDER BY updated_at DESC
          LIMIT 1
        `;

        if (assessments.length === 0) {
          return res.status(200).json({ assessment: null });
        }

        return res.status(200).json({ assessment: assessments[0] });

      case 'POST':
      case 'PUT':
        // Create or update assessment data
        const {
          clientId: assessmentClientId,
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

        if (!assessmentClientId) {
          return res.status(400).json({ error: 'Client ID is required' });
        }

        // Check if assessment exists
        const { rows: existing } = await sql`
          SELECT id FROM assessments
          WHERE client_id = ${assessmentClientId} AND user_id = ${userId}
        `;

        let result;

        if (existing.length > 0) {
          // Update existing assessment
          result = await sql`
            UPDATE assessments
            SET
              personal_history = ${JSON.stringify(personalHistory || null)},
              readiness_answers = ${JSON.stringify(readinessAnswers || null)},
              wheel_scores = ${JSON.stringify(wheelScores || null)},
              map_update = ${JSON.stringify(mapUpdate || null)},
              som_answers = ${JSON.stringify(somAnswers || null)},
              vakad_answers = ${JSON.stringify(vakadAnswers || null)},
              values_data = ${JSON.stringify(valuesData || null)},
              beliefs_data = ${JSON.stringify(beliefsData || null)},
              energy_data = ${JSON.stringify(energyData || null)},
              goals_data = ${JSON.stringify(goalsData || null)},
              personal_color_answers = ${JSON.stringify(personalColorAnswers || null)},
              spiral_answers = ${JSON.stringify(spiralAnswers || null)},
              meta_programs_answers = ${JSON.stringify(metaProgramsAnswers || null)},
              reframing_data = ${JSON.stringify(reframingData || null)},
              anchoring_data = ${JSON.stringify(anchoringData || null)},
              timeline_data = ${JSON.stringify(timelineData || null)},
              session_notes = ${JSON.stringify(sessionNotes || null)},
              followup_data = ${JSON.stringify(followupData || null)}
            WHERE id = ${existing[0].id}
            RETURNING *
          `;
        } else {
          // Create new assessment
          result = await sql`
            INSERT INTO assessments (
              client_id, user_id,
              personal_history, readiness_answers, wheel_scores, map_update,
              som_answers, vakad_answers, values_data, beliefs_data,
              energy_data, goals_data, personal_color_answers, spiral_answers,
              meta_programs_answers, reframing_data, anchoring_data,
              timeline_data, session_notes, followup_data
            )
            VALUES (
              ${assessmentClientId}, ${userId},
              ${JSON.stringify(personalHistory || null)},
              ${JSON.stringify(readinessAnswers || null)},
              ${JSON.stringify(wheelScores || null)},
              ${JSON.stringify(mapUpdate || null)},
              ${JSON.stringify(somAnswers || null)},
              ${JSON.stringify(vakadAnswers || null)},
              ${JSON.stringify(valuesData || null)},
              ${JSON.stringify(beliefsData || null)},
              ${JSON.stringify(energyData || null)},
              ${JSON.stringify(goalsData || null)},
              ${JSON.stringify(personalColorAnswers || null)},
              ${JSON.stringify(spiralAnswers || null)},
              ${JSON.stringify(metaProgramsAnswers || null)},
              ${JSON.stringify(reframingData || null)},
              ${JSON.stringify(anchoringData || null)},
              ${JSON.stringify(timelineData || null)},
              ${JSON.stringify(sessionNotes || null)},
              ${JSON.stringify(followupData || null)}
            )
            RETURNING *
          `;
        }

        return res.status(200).json({ assessment: result.rows[0] });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
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
