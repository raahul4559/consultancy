/**
 * /api/leads/:id/notes — POST add a note
 */
import { getCollection, setCors, requireAuth, activityEntry, toObjectId } from '../../_lib.js';

export default async function handler(req, res) {
  setCors(res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  const _id = toObjectId(req.query.id);
  if (!_id) return res.status(400).json({ error: 'Invalid id' });

  const text = (req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Note text required' });

  let col;
  try { col = await getCollection(); } catch (e) { return res.status(500).json({ error: e.message }); }

  try {
    const lead = await col.findOne({ _id });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const note = { id: Date.now().toString(), text, by: user, at: new Date().toISOString() };
    const act = activityEntry('note', `Note added: "${text.slice(0, 60)}${text.length > 60 ? '…' : ''}"`, user);

    await col.updateOne(
      { _id },
      { $push: { notes: note, activity: act }, $set: { updatedAt: new Date() } }
    );
    return res.status(201).json(note);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
