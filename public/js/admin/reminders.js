/* EduVista Admin — Reminders view */
const RemindersView = (() => {
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function fmtDue(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  async function render(container) {
    container.innerHTML = `<div class="loading"><div class="spinner"></div>Loading reminders…</div>`;
    let items;
    try {
      items = await API.get('/reminders');
    } catch (err) {
      container.innerHTML = `<div class="empty"><h3>Failed to load reminders</h3><p>${escapeHtml(err.message)}</p></div>`;
      return;
    }
    if (!items.length) {
      container.innerHTML = `<div class="empty"><div class="empty-icon">&#9200;</div><h3>No reminders set</h3><p>Open a lead and add a reminder from the Reminders tab.</p></div>`;
      return;
    }
    const now = Date.now();
    const overdue = items.filter(r => !r.done && new Date(r.due).getTime() < now);
    const upcoming = items.filter(r => !r.done && new Date(r.due).getTime() >= now);
    const done = items.filter(r => r.done);

    function section(title, list, accent) {
      if (!list.length) return '';
      return `
        <div class="card" style="margin-bottom:16px;">
          <div class="card-header">
            <div class="card-title">${title} <span style="color:var(--text-3); font-weight:500;">· ${list.length}</span></div>
          </div>
          <div class="card-body" style="padding:0;">
            <table>
              <thead><tr><th>Lead</th><th>Reminder</th><th>Due</th><th></th></tr></thead>
              <tbody>
                ${list.map(r => `
                  <tr data-lead="${r.leadId}" data-rid="${r.id}">
                    <td><strong>${escapeHtml(r.leadName)}</strong><div style="font-size:11px; color:var(--text-3);">${escapeHtml(r.leadPhone)}</div></td>
                    <td>${escapeHtml(r.text)}</td>
                    <td style="color:${accent || 'inherit'}; font-weight:600;">${fmtDue(r.due)}</td>
                    <td><button class="btn btn-ghost btn-sm" data-toggle>${r.done ? 'Reopen' : 'Mark done'}</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    container.innerHTML = section('Overdue', overdue, 'var(--accent-red)')
      + section('Upcoming', upcoming, 'var(--accent-amber)')
      + section('Completed', done, '');

    container.querySelectorAll('tr[data-lead]').forEach(tr => {
      const leadId = tr.dataset.lead;
      const rid = tr.dataset.rid;
      tr.querySelector('td:first-child').addEventListener('click', () => LeadDetail.open(leadId));
      tr.querySelector('td:nth-child(2)').addEventListener('click', () => LeadDetail.open(leadId));
      tr.querySelector('[data-toggle]').addEventListener('click', async (e) => {
        e.stopPropagation();
        const isDone = e.target.textContent.trim() === 'Mark done';
        try {
          await API.patch(`/leads/${leadId}/reminders/${rid}`, { done: isDone });
          App.toast(isDone ? 'Marked done' : 'Reopened', 'success');
          render(container);
          App.refreshBadges();
        } catch (err) {
          App.toast('Failed: ' + err.message, 'error');
        }
      });
    });
  }

  return { render };
})();
