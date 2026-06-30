/* EduVista Admin — App shell, router, state */
const App = (() => {
  const state = {
    leads: [],
    search: '',
    onSearchChange: null,
    pollHandle: null
  };
  const PAGE_TITLES = {
    dashboard: 'Dashboard',
    leads: 'Leads',
    pipeline: 'Pipeline',
    reminders: 'Reminders'
  };

  const els = {};

  function $(id) { return document.getElementById(id); }

  function init() {
    els.loginPage  = $('login-page');
    els.app        = $('app');
    els.content    = $('content');
    els.pageTitle  = $('page-title');
    els.search     = $('global-search');
    els.toast      = $('toast');
    els.sidebar    = $('sidebar');
    els.overlay    = $('sidebar-overlay');

    $('login-form').addEventListener('submit', onLogin);
    $('logout-btn').addEventListener('click', onLogout);
    $('mobile-menu-btn').addEventListener('click', toggleSidebar);
    els.overlay.addEventListener('click', toggleSidebar);

    els.search.addEventListener('input', () => {
      state.search = els.search.value;
      if (state.onSearchChange) state.onSearchChange();
    });

    document.querySelectorAll('.nav-link[data-route]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth < 768) toggleSidebar(false);
      });
    });

    window.addEventListener('hashchange', renderRoute);

    LeadDetail.init();
    boot();
  }

  async function boot() {
    const user = await Auth.init();
    if (!user) return showLogin();
    showApp(user);
  }

  async function onLogin(e) {
    e.preventDefault();
    const username = $('login-username').value.trim();
    const password = $('login-password').value;
    const err = $('login-error');
    err.style.display = 'none';
    try {
      const user = await Auth.login(username, password);
      showApp(user);
    } catch (e2) {
      err.textContent = e2.message || 'Login failed';
      err.style.display = 'block';
    }
  }

  async function onLogout() {
    await Auth.logout();
    showLogin();
  }

  function showLogin() {
    els.loginPage.style.display = 'flex';
    els.app.style.display = 'none';
    if (state.pollHandle) { clearInterval(state.pollHandle); state.pollHandle = null; }
  }

  async function showApp(user) {
    els.loginPage.style.display = 'none';
    els.app.style.display = 'flex';
    $('sidebar-username').textContent = user.username;
    $('sidebar-avatar').textContent = (user.username[0] || 'A').toUpperCase();
    if (!location.hash) location.hash = '#/dashboard';
    await reload();
    renderRoute();
    state.pollHandle = setInterval(refreshSilently, 30000);
  }

  async function reload() {
    try {
      state.leads = await API.get('/leads');
      refreshBadges();
      renderRoute();
    } catch (err) {
      if (err.status === 401) { showLogin(); return; }
      toast('Failed to load leads: ' + err.message, 'error');
    }
  }

  async function refreshSilently() {
    try {
      state.leads = await API.get('/leads');
      refreshBadges();
      if (state.onSearchChange) state.onSearchChange();
    } catch (_) {}
  }

  async function refreshBadges() {
    const leadsBadge = $('badge-leads');
    leadsBadge.textContent = state.leads.length;
    leadsBadge.classList.toggle('show', state.leads.length > 0);

    try {
      const a = await API.get('/analytics');
      const total = (a.upcomingReminders || 0) + (a.overdueReminders || 0);
      const remBadge = $('badge-reminders');
      remBadge.textContent = total;
      remBadge.classList.toggle('show', total > 0);
    } catch (_) {}
  }

  function renderRoute() {
    const route = (location.hash.replace(/^#\//, '') || 'dashboard').split('/')[0];
    document.querySelectorAll('.nav-link[data-route]').forEach(link => {
      link.classList.toggle('active', link.dataset.route === route);
    });
    els.pageTitle.textContent = PAGE_TITLES[route] || route;
    state.onSearchChange = null;
    els.search.style.display = (route === 'leads' || route === 'pipeline') ? '' : 'none';

    if (route === 'dashboard')   return Analytics.render(els.content);
    if (route === 'leads')       return LeadsView.render(els.content, state);
    if (route === 'pipeline')    return PipelineView.render(els.content, state);
    if (route === 'reminders')   return RemindersView.render(els.content);
    location.hash = '#/dashboard';
  }

  function toast(msg, type) {
    els.toast.className = 'toast ' + (type || '');
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => els.toast.classList.remove('show'), 2400);
  }

  function toggleSidebar(force) {
    const open = typeof force === 'boolean' ? force : !els.sidebar.classList.contains('open');
    els.sidebar.classList.toggle('open', open);
    els.overlay.classList.toggle('show', open);
  }

  return { init, reload, refreshSilently, refreshBadges, toast };
})();

document.addEventListener('DOMContentLoaded', App.init);
