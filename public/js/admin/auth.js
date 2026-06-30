/* EduVista Admin — Auth */
const Auth = (() => {
  let _user = null;

  async function init() {
    const token = API.getToken();
    if (!token) return null;
    try {
      const data = await API.get('/auth/verify');
      if (data?.valid) {
        _user = { username: data.username };
        return _user;
      }
    } catch (_) {}
    API.clearToken();
    return null;
  }

  async function login(username, password) {
    const data = await API.post('/auth/login', { username, password });
    if (data?.token) {
      API.setToken(data.token);
      _user = { username: data.username };
      return _user;
    }
    throw new Error('Login failed');
  }

  async function logout() {
    try { await API.post('/auth/logout'); } catch (_) {}
    API.clearToken();
    _user = null;
  }

  function user() { return _user; }

  return { init, login, logout, user };
})();
