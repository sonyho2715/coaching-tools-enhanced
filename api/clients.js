import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get user ID from Clerk (will be set after Clerk is configured)
  const userId = req.headers['x-user-id'] || 'demo-user';

  try {
    switch (req.method) {
      case 'GET':
        // Get all clients for a user
        const { rows: clients } = await sql`
          SELECT * FROM clients
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
        `;
        return res.status(200).json({ clients });

      case 'POST':
        // Create a new client
        const { name, email, phone, notes } = req.body;

        const { rows: newClient } = await sql`
          INSERT INTO clients (user_id, name, email, phone, notes)
          VALUES (${userId}, ${name}, ${email || null}, ${phone || null}, ${notes || null})
          RETURNING *
        `;
        return res.status(201).json({ client: newClient[0] });

      case 'PUT':
        // Update an existing client
        const { id, name: updatedName, email: updatedEmail, phone: updatedPhone, notes: updatedNotes } = req.body;

        const { rows: updatedClient } = await sql`
          UPDATE clients
          SET name = ${updatedName},
              email = ${updatedEmail || null},
              phone = ${updatedPhone || null},
              notes = ${updatedNotes || null}
          WHERE id = ${id} AND user_id = ${userId}
          RETURNING *
        `;

        if (updatedClient.length === 0) {
          return res.status(404).json({ error: 'Client not found' });
        }

        return res.status(200).json({ client: updatedClient[0] });

      case 'DELETE':
        // Delete a client
        const { id: deleteId } = req.query;

        const { rowCount } = await sql`
          DELETE FROM clients
          WHERE id = ${deleteId} AND user_id = ${userId}
        `;

        if (rowCount === 0) {
          return res.status(404).json({ error: 'Client not found' });
        }

        return res.status(200).json({ message: 'Client deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
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
