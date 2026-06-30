/**
 * /api/analytics — GET aggregated metrics for the dashboard
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
    const leads = await col.find({}, { projection: { status: 1, priority: 1, source: 1, createdAt: 1, reminders: 1 } }).toArray();

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const weekStart = now - 7 * day;
    const monthStart = now - 30 * day;

    const byStatus = {}, byPriority = {}, bySource = {}, byDay = {};
    let todayCount = 0, weekCount = 0, monthCount = 0;
    let upcomingReminders = 0, overdueReminders = 0;

    for (const l of leads) {
      const created = new Date(l.createdAt).getTime();
      if (created >= todayStart.getTime()) todayCount++;
      if (created >= weekStart) weekCount++;
      if (created >= monthStart) monthCount++;

      const s = l.status || 'new';
      const p = l.priority || 'medium';
      const src = l.source || 'unknown';
      byStatus[s] = (byStatus[s] || 0) + 1;
      byPriority[p] = (byPriority[p] || 0) + 1;
      bySource[src] = (bySource[src] || 0) + 1;

      if (created >= monthStart) {
        const dayKey = new Date(created).toISOString().slice(0, 10);
        byDay[dayKey] = (byDay[dayKey] || 0) + 1;
      }

      for (const r of (l.reminders || [])) {
        if (r.done) continue;
        const dueT = new Date(r.due).getTime();
        if (dueT < now) overdueReminders++;
        else if (dueT < now + 7 * day) upcomingReminders++;
      }
    }

    const won = byStatus.won || 0;
    const lost = byStatus.lost || 0;
    const closed = won + lost;
    const conversionRate = closed > 0 ? Math.round((won / closed) * 100) : 0;

    return res.status(200).json({
      total: leads.length,
      today: todayCount, week: weekCount, month: monthCount,
      byStatus, byPriority, bySource, byDay,
      conversionRate, upcomingReminders, overdueReminders
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
