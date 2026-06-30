/**
 * /api/reminders — GET all reminders across all leads
 */
import { getCollection, setCors, requireAuth } from './_lib.js';

export default async function handler(req, res) {
  setCors(res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  let col;
  try { col = await getCollection(); } catch (e) { return res.status(500).json({ error: e.message }); }

  try {
    const docs = await col.find({ reminders: { $exists: true, $ne: [] } }, { projection: { name: 1, phone: 1, reminders: 1 } }).toArray();
    const all = [];
    for (const d of docs) {
      for (const r of (d.reminders || [])) {
        all.push({ ...r, leadId: d._id.toString(), leadName: d.name, leadPhone: d.phone });
      }
    }
    all.sort((a, b) => new Date(a.due) - new Date(b.due));
    return res.status(200).json(all);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
