/* EduVista Admin — Leads list view */
const LeadsView = (() => {
  const STATUS_LABELS = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', won: 'Won', lost: 'Lost' };
  const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const today = new Date(); today.setHours(0,0,0,0);
    const yest = new Date(today); yest.setDate(yest.getDate() - 1);
    if (d >= today) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (d >= yest) return 'Yesterday';
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }

  function rowHtml(lead) {
    const status = lead.status || 'new';
    const priority = lead.priority || 'medium';
    const source = lead.source || '—';
    const examOrCourse = lead.exam || lead.course || lead.college || '—';
    return `
      <tr data-id="${lead.id}">
        <td>${fmtDate(lead.createdAt)}</td>
        <td><strong>${escapeHtml(lead.name)}</strong></td>
        <td><a href="tel:${escapeHtml(lead.phone)}" onclick="event.stopPropagation()">${escapeHtml(lead.phone)}</a></td>
        <td>${escapeHtml(lead.email || '—')}</td>
        <td><span class="badge badge-source">${escapeHtml(source)}</span></td>
        <td>${escapeHtml(examOrCourse)}</td>
        <td><span class="badge badge-status-${status}">${STATUS_LABELS[status]}</span></td>
        <td><span class="badge badge-priority-${priority}">${PRIORITY_LABELS[priority]}</span></td>
      </tr>
    `;
  }

  function applyFilters(leads, search, status, priority, source) {
    const q = (search || '').trim().toLowerCase();
    return leads.filter(l => {
      if (status && (l.status || 'new') !== status) return false;
      if (priority && (l.priority || 'medium') !== priority) return false;
      if (source && (l.source || '') !== source) return false;
      if (!q) return true;
      const hay = [l.name, l.phone, l.email, l.exam, l.course, l.college, l.city, l.state, l.source]
        .filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  function exportCsv(leads) {
    const cols = ['createdAt','name','phone','email','source','status','priority','exam','course','college','branch','city','state','category','message'];
    const header = cols.join(',');
    const rows = leads.map(l => cols.map(c => {
      const v = l[c] === null || l[c] === undefined ? '' : String(l[c]);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduvista-leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function uniqueSources(leads) {
    return [...new Set(leads.map(l => l.source).filter(Boolean))].sort();
  }

  function render(container, state) {
    container.innerHTML = `
      <div class="toolbar">
        <select id="lv-status">
          <option value="">All statuses</option>
          ${Object.entries(STATUS_LABELS).map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}
        </select>
        <select id="lv-priority">
          <option value="">All priorities</option>
          ${Object.entries(PRIORITY_LABELS).map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}
        </select>
        <select id="lv-source">
          <option value="">All sources</option>
          ${uniqueSources(state.leads).map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}
        </select>
        <div class="filters-spacer"></div>
        <button class="btn btn-secondary btn-sm" id="lv-refresh">Refresh</button>
        <button class="btn btn-primary btn-sm" id="lv-export">Export CSV</button>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span id="lv-count">${state.leads.length}</span> leads</div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Name</th><th>Phone</th><th>Email</th>
                <th>Source</th><th>Exam / Course</th><th>Status</th><th>Priority</th>
              </tr>
            </thead>
            <tbody id="lv-tbody"></tbody>
          </table>
          <div id="lv-empty" class="empty" style="display:none;">
            <div class="empty-icon">&#128203;</div>
            <h3>No leads match these filters</h3>
            <p>Try clearing filters or check back later.</p>
          </div>
        </div>
      </div>
    `;

    const tbody = container.querySelector('#lv-tbody');
    const emptyEl = container.querySelector('#lv-empty');
    const countEl = container.querySelector('#lv-count');
    const sStatus = container.querySelector('#lv-status');
    const sPriority = container.querySelector('#lv-priority');
    const sSource = container.querySelector('#lv-source');

    function renderRows() {
      const filtered = applyFilters(state.leads, state.search, sStatus.value, sPriority.value, sSource.value);
      tbody.innerHTML = filtered.map(rowHtml).join('');
      countEl.textContent = filtered.length;
      emptyEl.style.display = filtered.length === 0 ? 'block' : 'none';
      tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => LeadDetail.open(tr.dataset.id));
      });
    }

    sStatus.addEventListener('change', renderRows);
    sPriority.addEventListener('change', renderRows);
    sSource.addEventListener('change', renderRows);
    container.querySelector('#lv-refresh').addEventListener('click', () => App.reload());
    container.querySelector('#lv-export').addEventListener('click', () => {
      const filtered = applyFilters(state.leads, state.search, sStatus.value, sPriority.value, sSource.value);
      exportCsv(filtered);
    });

    state.onSearchChange = renderRows;
    renderRows();
  }

  return { render, STATUS_LABELS, PRIORITY_LABELS };
})();
