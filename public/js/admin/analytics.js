/* EduVista Admin — Analytics / Dashboard */
const Analytics = (() => {
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function statCard(label, value, accent, sub) {
    return `
      <div class="stat-card accent-${accent}">
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}</div>
        ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
      </div>
    `;
  }

  function donutBars(title, data, totalOverride) {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const total = totalOverride !== undefined ? totalOverride : entries.reduce((a, [, v]) => a + v, 0);
    if (!entries.length) return '';
    return `
      <div class="card">
        <div class="card-header"><div class="card-title">${title}</div></div>
        <div class="card-body">
          ${entries.map(([k, v]) => `
            <div class="donut-row">
              <div class="label">${escapeHtml(k)}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${total ? Math.round(v / total * 100) : 0}%"></div></div>
              <div class="count">${v}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function dailyChart(byDay) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, label: d.toLocaleDateString([], { day: 'numeric', month: 'short' }), count: byDay[key] || 0 });
    }
    const max = Math.max(1, ...days.map(d => d.count));
    return `
      <div class="card">
        <div class="card-header"><div class="card-title">Last 14 days</div></div>
        <div class="card-body">
          <div class="chart-bars">
            ${days.map(d => `
              <div class="chart-bar" style="height:${(d.count / max) * 100}%" title="${d.label}: ${d.count}">
                ${d.count > 0 ? `<div class="chart-bar-label">${d.count}</div>` : ''}
              </div>
            `).join('')}
          </div>
          <div class="chart-x">${days.map(d => `<div class="tick">${d.label.split(' ')[0]}</div>`).join('')}</div>
        </div>
      </div>
    `;
  }

  async function render(container) {
    container.innerHTML = `<div class="loading"><div class="spinner"></div>Loading analytics…</div>`;
    let a;
    try {
      a = await API.get('/analytics');
    } catch (err) {
      container.innerHTML = `<div class="empty"><h3>Failed to load analytics</h3><p>${escapeHtml(err.message)}</p></div>`;
      return;
    }

    const won = a.byStatus.won || 0;
    const lost = a.byStatus.lost || 0;

    container.innerHTML = `
      <div class="stats-grid">
        ${statCard('Total leads', a.total, 'primary')}
        ${statCard('Today', a.today, 'green', 'last 24h')}
        ${statCard('This week', a.week, 'amber', 'last 7 days')}
        ${statCard('This month', a.month, 'blue', 'last 30 days')}
        ${statCard('Conversion', a.conversionRate + '%', 'green', `${won} won / ${won + lost} closed`)}
        ${statCard('Reminders', (a.upcomingReminders + a.overdueReminders), 'amber', `${a.overdueReminders} overdue`)}
      </div>
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px;">
        ${dailyChart(a.byDay)}
        ${donutBars('Status', a.byStatus, a.total)}
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:16px;">
        ${donutBars('Source', a.bySource, a.total)}
        ${donutBars('Priority', a.byPriority, a.total)}
      </div>
    `;
  }

  return { render };
})();
