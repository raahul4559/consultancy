/**
 * /api/leads/:id  — GET / PATCH / DELETE a single lead
 */
import { getCollection, setCors, requireAuth, normalize, activityEntry, toObjectId, VALID_STATUSES, VALID_PRIORITIES } from '../_lib.js';

export default async function handler(req, res) {
  setCors(res, 'GET, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = requireAuth(req, res);
  if (!user) return;

  const _id = toObjectId(req.query.id);
  if (!_id) return res.status(400).json({ error: 'Invalid id' });

  let col;
  try { col = await getCollection(); } catch (e) { return res.status(500).json({ error: e.message }); }

  try {
    if (req.method === 'GET') {
      const doc = await col.findOne({ _id });
      if (!doc) return res.status(404).json({ error: 'Lead not found' });
      return res.status(200).json(normalize(doc));
    }

    if (req.method === 'PATCH') {
      const lead = await col.findOne({ _id });
      if (!lead) return res.status(404).json({ error: 'Lead not found' });

      const body = req.body || {};
      const $set = { updatedAt: new Date() };
      const $push = {};
      const activity = [];

      if (body.status !== undefined) {
        if (!VALID_STATUSES.includes(body.status)) return res.status(400).json({ error: 'Invalid status' });
        if ((lead.status || 'new') !== body.status) {
          activity.push(activityEntry('status', `Status changed: ${lead.status || 'new'} → ${body.status}`, user));
          $set.status = body.status;
        }
      }
      if (body.priority !== undefined) {
        if (!VALID_PRIORITIES.includes(body.priority)) return res.status(400).json({ error: 'Invalid priority' });
        if ((lead.priority || 'medium') !== body.priority) {
          activity.push(activityEntry('priority', `Priority: ${lead.priority || 'medium'} → ${body.priority}`, user));
          $set.priority = body.priority;
        }
      }
      const editable = ['name', 'phone', 'email', 'course', 'college', 'branch', 'exam', 'city', 'state', 'category', 'message'];
      for (const k of editable) {
        if (body[k] !== undefined && lead[k] !== body[k]) $set[k] = body[k];
      }

      if (activity.length) $push.activity = { $each: activity };

      const update = { $set };
      if (Object.keys($push).length) update.$push = $push;

      await col.updateOne({ _id }, update);
      const updated = await col.findOne({ _id });
      return res.status(200).json(normalize(updated));
    }

    if (req.method === 'DELETE') {
      const result = await col.deleteOne({ _id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Lead not found' });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
