/**
 * /api/leads/:id/reminders/:rid — PATCH a reminder (done toggle, edit text/due)
 */
import { getCollection, setCors, requireAuth, toObjectId } from '../../../_lib.js';

export default async function handler(req, res) {
  setCors(res, 'PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  const _id = toObjectId(req.query.id);
  if (!_id) return res.status(400).json({ error: 'Invalid id' });
  const rid = req.query.rid;
  if (!rid) return res.status(400).json({ error: 'Reminder id required' });

  let col;
  try { col = await getCollection(); } catch (e) { return res.status(500).json({ error: e.message }); }

  try {
    const lead = await col.findOne({ _id });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const idx = (lead.reminders || []).findIndex(r => r.id === rid);
    if (idx === -1) return res.status(404).json({ error: 'Reminder not found' });

    const $set = { updatedAt: new Date() };
    if (req.body?.done !== undefined) $set[`reminders.${idx}.done`] = !!req.body.done;
    if (req.body?.text) $set[`reminders.${idx}.text`] = req.body.text;
    if (req.body?.due) $set[`reminders.${idx}.due`] = req.body.due;

    await col.updateOne({ _id }, { $set });
    const updated = await col.findOne({ _id });
    return res.status(200).json(updated.reminders[idx]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
