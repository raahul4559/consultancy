/**
 * /api/leads/:id/reminders — POST add a reminder
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
  const due = req.body?.due;
  if (!text || !due) return res.status(400).json({ error: 'text and due required' });

  let col;
  try { col = await getCollection(); } catch (e) { return res.status(500).json({ error: e.message }); }

  try {
    const lead = await col.findOne({ _id });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const reminder = {
      id: Date.now().toString(),
      text,
      due,
      done: false,
      by: user,
      at: new Date().toISOString()
    };
    const act = activityEntry('reminder', `Reminder set for ${new Date(due).toLocaleString()}: ${text}`, user);

    await col.updateOne(
      { _id },
      { $push: { reminders: reminder, activity: act }, $set: { updatedAt: new Date() } }
    );
    return res.status(201).json(reminder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
