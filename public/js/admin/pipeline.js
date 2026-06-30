/* EduVista Admin — Pipeline / Kanban */
const PipelineView = (() => {
  const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function cardHtml(lead) {
    const priority = lead.priority || 'medium';
    const meta = [lead.exam, lead.course, lead.college].filter(Boolean).slice(0, 2);
    return `
      <div class="kanban-card" draggable="true" data-id="${lead.id}">
        <div class="kanban-card-name">${escapeHtml(lead.name)}</div>
        <div class="kanban-card-meta">
          <span>${escapeHtml(lead.phone)}</span>
          ${meta.map(m => `<span>· ${escapeHtml(m)}</span>`).join('')}
        </div>
        <div class="kanban-card-footer">
          <span class="badge badge-priority-${priority}">${LeadsView.PRIORITY_LABELS[priority]}</span>
          ${lead.source ? `<span class="badge badge-source">${escapeHtml(lead.source)}</span>` : ''}
        </div>
      </div>
    `;
  }

  function render(container, state) {
    container.innerHTML = `
      <div class="toolbar">
        <div class="filters-spacer"></div>
        <button class="btn btn-secondary btn-sm" id="pv-refresh">Refresh</button>
      </div>
      <div class="kanban" id="pv-kanban">
        ${STATUSES.map(s => `
          <div class="kanban-col" data-status="${s}">
            <div class="kanban-col-header">
              <div class="kanban-col-title">${LeadsView.STATUS_LABELS[s]}</div>
              <div class="kanban-col-count" data-count></div>
            </div>
            <div class="kanban-col-body" data-dropzone></div>
          </div>
        `).join('')}
      </div>
    `;

    const root = container.querySelector('#pv-kanban');

    function renderCols() {
      const q = (state.search || '').trim().toLowerCase();
      const visible = state.leads.filter(l => {
        if (!q) return true;
        const hay = [l.name, l.phone, l.email, l.exam, l.course, l.college].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      });
      STATUSES.forEach(s => {
        const col = root.querySelector(`[data-status="${s}"]`);
        const items = visible.filter(l => (l.status || 'new') === s);
        col.querySelector('[data-count]').textContent = items.length;
        col.querySelector('[data-dropzone]').innerHTML = items.map(cardHtml).join('');
      });
      attachDnd();
      attachClicks();
    }

    function attachClicks() {
      root.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('click', () => LeadDetail.open(card.dataset.id));
      });
    }

    function attachDnd() {
      let dragId = null;

      root.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
          dragId = card.dataset.id;
          card.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', dragId);
        });
        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
          dragId = null;
        });
      });

      root.querySelectorAll('[data-dropzone]').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', async (e) => {
          e.preventDefault();
          zone.classList.remove('drag-over');
          const id = dragId || e.dataTransfer.getData('text/plain');
          const newStatus = zone.parentElement.dataset.status;
          if (!id || !newStatus) return;
          const lead = state.leads.find(l => l.id === id);
          if (!lead || (lead.status || 'new') === newStatus) return;
          const prev = lead.status;
          lead.status = newStatus; // optimistic
          renderCols();
          try {
            const updated = await API.patch('/leads/' + id, { status: newStatus });
            Object.assign(lead, updated);
            App.toast('Moved ' + lead.name + ' → ' + LeadsView.STATUS_LABELS[newStatus], 'success');
          } catch (err) {
            lead.status = prev;
            renderCols();
            App.toast('Failed: ' + err.message, 'error');
          }
        });
      });
    }

    container.querySelector('#pv-refresh').addEventListener('click', () => App.reload());
    state.onSearchChange = renderCols;
    renderCols();
  }

  return { render };
})();
