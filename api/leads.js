/**
 * /api/leads
 *  POST — public, submit a new lead (auto-enriched with status/priority/notes/etc.)
 *  GET  — auth-required, list all leads (newest first)
 */
import { getCollection, setCors, requireAuth, normalize, activityEntry } from './_lib.js';

export default async function handler(req, res) {
  setCors(res, 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let collection;
  try {
    collection = await getCollection();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  try {
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.name || !body.phone) return res.status(400).json({ error: 'Name and phone are required' });

      const newLead = {
        ...body,
        status: 'new',
        priority: body.priority || 'medium',
        notes: [],
        reminders: [],
        activity: [activityEntry('created', `Lead captured from ${body.source || 'website'}`)],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await collection.insertOne(newLead);
      return res.status(201).json({ success: true, id: result.insertedId.toString() });
    }

    if (req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;
      const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(docs.map(normalize));
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
