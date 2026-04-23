import axios from 'axios';

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

// Attach access token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ft_access');
  if (token) cfg.headers['Authorization'] = `Bearer ${token}`;
  return cfg;
});

let refreshing = false;
let queue = [];

const flush = (token, err) => {
  queue.forEach(p => err ? p.reject(err) : p.resolve(token));
  queue = [];
};

// Auto-refresh on 401
api.interceptors.response.use(
  r => r,
  async err => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(token => {
          orig.headers['Authorization'] = `Bearer ${token}`;
          return api(orig);
        });
      }
      refreshing = true;
      try {
        const refreshToken = localStorage.getItem('ft_refresh');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post('/api/auth/refresh-token', { refreshToken });
        localStorage.setItem('ft_access',  data.accessToken);
        localStorage.setItem('ft_refresh', data.refreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        flush(data.accessToken, null);
        orig.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(orig);
      } catch (e) {
        flush(null, e);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
