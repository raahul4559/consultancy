/* EduVista Admin — Lead Detail Modal */
const LeadDetail = (() => {
  let _lead = null;
  let _tab = 'info';
  let _modal, _body, _nameEl, _subEl, _tabsEl, _closeBtn, _delBtn;

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function init() {
    _modal = document.getElementById('lead-modal');
    _body = document.getElementById('modal-body');
    _nameEl = document.getElementById('modal-lead-name');
    _subEl = document.getElementById('modal-lead-sub');
    _tabsEl = _modal.querySelectorAll('.modal-tab');
    _closeBtn = document.getElementById('modal-close-btn');
    _delBtn = document.getElementById('modal-delete-btn');

    _closeBtn.addEventListener('click', close);
    _modal.addEventListener('click', (e) => { if (e.target === _modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && _modal.classList.contains('show')) close(); });
    _tabsEl.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
    _delBtn.addEventListener('click', deleteLead);
  }

  async function open(id) {
    if (!_modal) init();
    _modal.classList.add('show');
    _nameEl.textContent = 'Loading…';
    _subEl.textContent = '';
    _body.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
    _tab = 'info';
    setActiveTab(_tab);
    try {
      _lead = await API.get('/leads/' + id);
      paint();
    } catch (err) {
      _body.innerHTML = `<div class="empty"><h3>Failed to load lead</h3><p>${escapeHtml(err.message)}</p></div>`;
    }
  }

  function close() {
    _modal.classList.remove('show');
    _lead = null;
  }

  function switchTab(name) {
    _tab = name;
    setActiveTab(name);
    paintTab();
  }

  function setActiveTab(name) {
    _tabsEl.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  }

  function paint() {
    _nameEl.textContent = _lead.name;
    const meta = [_lead.phone, _lead.email].filter(Boolean).join(' · ');
    _subEl.textContent = meta;
    paintTab();
  }

  function paintTab() {
    if (_tab === 'info') return paintInfo();
    if (_tab === 'notes') return paintNotes();
    if (_tab === 'reminders') return paintReminders();
    if (_tab === 'activity') return paintActivity();
  }

  function paintInfo() {
    const l = _lead;
    const fields = [
      ['Source', l.source],
      ['Page', l.page],
      ['Exam', l.exam],
      ['Course', l.course],
      ['College', l.college],
      ['Branch', l.branch],
      ['City', l.city],
      ['State', l.state],
      ['Category', l.category],
      ['Predicted rank', l.predictedRank],
      ['Input score', l.input],
      ['Message', l.message],
      ['Created', new Date(l.createdAt).toLocaleString()],
      ['Updated', l.updatedAt ? new Date(l.updatedAt).toLocaleString() : '—']
    ].filter(([, v]) => v !== undefined && v !== null && v !== '');

    _body.innerHTML = `
      <div class="field-row">
        <label>Status</label>
        <select id="dt-status">
          ${Object.entries(LeadsView.STATUS_LABELS).map(([v, lab]) =>
            `<option value="${v}" ${(l.status || 'new') === v ? 'selected' : ''}>${lab}</option>`).join('')}
        </select>
      </div>
      <div class="field-row">
        <label>Priority</label>
        <select id="dt-priority">
          ${Object.entries(LeadsView.PRIORITY_LABELS).map(([v, lab]) =>
            `<option value="${v}" ${(l.priority || 'medium') === v ? 'selected' : ''}>${lab}</option>`).join('')}
        </select>
      </div>
      <hr style="border:none; border-top:1px solid var(--border-light); margin:16px 0;">
      <dl class="info-grid">
        ${fields.map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('')}
      </dl>
    `;
    _body.querySelector('#dt-status').addEventListener('change', (e) => updateField({ status: e.target.value }));
    _body.querySelector('#dt-priority').addEventListener('change', (e) => updateField({ priority: e.target.value }));
  }

  async function updateField(patch) {
    try {
      const updated = await API.patch('/leads/' + _lead.id, patch);
      _lead = updated;
      App.toast('Saved', 'success');
      App.refreshSilently(); // keep view in sync
    } catch (err) {
      App.toast('Save failed: ' + err.message, 'error');
    }
  }

  function paintNotes() {
    const notes = (_lead.notes || []).slice().reverse();
    _body.innerHTML = `
      <ul class="note-list">
        ${notes.length ? notes.map(n => `
          <li class="note-item">
            <div>${escapeHtml(n.text)}</div>
            <div class="note-meta">— ${escapeHtml(n.by)} · ${new Date(n.at).toLocaleString()}</div>
          </li>
        `).join('') : `<li style="color:var(--text-3); font-size:13px;">No notes yet.</li>`}
      </ul>
      <div class="note-form">
        <textarea id="dt-note-text" placeholder="Add a note (e.g., called, interested in BTech CSE…)"></textarea>
        <div><button class="btn btn-primary btn-sm" id="dt-note-add">Add note</button></div>
      </div>
    `;
    _body.querySelector('#dt-note-add').addEventListener('click', async () => {
      const text = _body.querySelector('#dt-note-text').value.trim();
      if (!text) return;
      try {
        await API.post(`/leads/${_lead.id}/notes`, { text });
        _lead = await API.get('/leads/' + _lead.id);
        paintNotes();
        App.toast('Note added', 'success');
      } catch (err) {
        App.toast('Failed: ' + err.message, 'error');
      }
    });
  }

  function paintReminders() {
    const now = Date.now();
    const reminders = (_lead.reminders || []).slice().sort((a, b) => new Date(a.due) - new Date(b.due));
    _body.innerHTML = `
      <ul class="reminder-list">
        ${reminders.length ? reminders.map(r => {
          const due = new Date(r.due).getTime();
          const overdue = !r.done && due < now;
          return `
            <li class="reminder-item ${r.done ? 'done' : ''} ${overdue ? 'overdue' : ''}">
              <div style="display:flex; gap:10px; align-items:flex-start;">
                <input type="checkbox" data-rid="${r.id}" ${r.done ? 'checked' : ''} style="margin-top:3px;">
                <div style="flex:1;">
                  <div class="reminder-text">${escapeHtml(r.text)}</div>
                  <div class="reminder-meta">
                    <span class="reminder-due">${new Date(r.due).toLocaleString()}</span>
                    · added by ${escapeHtml(r.by)}
                  </div>
                </div>
              </div>
            </li>
          `;
        }).join('') : `<li style="color:var(--text-3); font-size:13px;">No reminders set.</li>`}
      </ul>
      <div class="reminder-form">
        <input type="text" id="dt-rem-text" placeholder="What to do (e.g., Follow-up call)">
        <div class="row">
          <input type="datetime-local" id="dt-rem-due">
          <button class="btn btn-primary btn-sm" id="dt-rem-add">Add reminder</button>
        </div>
      </div>
    `;
    // default due = tomorrow 10am
    const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(10, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, '0');
    _body.querySelector('#dt-rem-due').value =
      `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}`;

    _body.querySelector('#dt-rem-add').addEventListener('click', async () => {
      const text = _body.querySelector('#dt-rem-text').value.trim();
      const dueLocal = _body.querySelector('#dt-rem-due').value;
      if (!text || !dueLocal) { App.toast('Need text and due date', 'error'); return; }
      const due = new Date(dueLocal).toISOString();
      try {
        await API.post(`/leads/${_lead.id}/reminders`, { text, due });
        _lead = await API.get('/leads/' + _lead.id);
        paintReminders();
        App.toast('Reminder added', 'success');
        App.refreshBadges();
      } catch (err) {
        App.toast('Failed: ' + err.message, 'error');
      }
    });

    _body.querySelectorAll('input[type="checkbox"][data-rid]').forEach(cb => {
      cb.addEventListener('change', async () => {
        try {
          await API.patch(`/leads/${_lead.id}/reminders/${cb.dataset.rid}`, { done: cb.checked });
          _lead = await API.get('/leads/' + _lead.id);
          paintReminders();
          App.refreshBadges();
        } catch (err) {
          App.toast('Failed: ' + err.message, 'error');
        }
      });
    });
  }

  function paintActivity() {
    const acts = (_lead.activity || []).slice().reverse();
    _body.innerHTML = `
      <ul class="activity-list">
        ${acts.length ? acts.map(a => `
          <li class="activity-item">
            <div>${escapeHtml(a.text)}</div>
            <div class="activity-meta">— ${escapeHtml(a.by)} · ${new Date(a.at).toLocaleString()}</div>
          </li>
        `).join('') : `<li style="color:var(--text-3); font-size:13px;">No activity recorded.</li>`}
      </ul>
    `;
  }

  async function deleteLead() {
    if (!_lead) return;
    if (!confirm(`Delete lead "${_lead.name}"? This cannot be undone.`)) return;
    try {
      await API.del('/leads/' + _lead.id);
      App.toast('Lead deleted', 'success');
      close();
      App.reload();
    } catch (err) {
      App.toast('Delete failed: ' + err.message, 'error');
    }
  }

  return { init, open, close };
})();
