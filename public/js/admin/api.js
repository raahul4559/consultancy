/* EduVista Admin — API wrapper */
const API = (() => {
  const TOKEN_KEY = 'eduvista_admin_token';

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
  function clearToken() { localStorage.removeItem(TOKEN_KEY); }

  async function request(method, path, body) {
    const opts = { method, headers: {} };
    const t = getToken();
    if (t) opts.headers['Authorization'] = 'Bearer ' + t;
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await fetch('/api' + path, opts);
    let data = null;
    try { data = await res.json(); } catch (_) {}
    if (!res.ok) {
      const err = new Error(data?.error || ('HTTP ' + res.status));
      err.status = res.status;
      throw err;
    }
    return data;
  }

  return {
    getToken, setToken, clearToken,
    get:    (p)    => request('GET', p),
    post:   (p, b) => request('POST', p, b),
    patch:  (p, b) => request('PATCH', p, b),
    del:    (p)    => request('DELETE', p),
  };
})();
