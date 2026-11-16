import axios from 'axios';

// In dev this stays '/api' and Vite's proxy (vite.config.js) forwards it to
// the local Django server. In production (different subdomain for the
// backend) set VITE_API_BASE_URL at build time, e.g. in .env.production:
//   VITE_API_BASE_URL=https://api.yourdomain.com/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const api = axios.create({ baseURL: API_BASE_URL });

const ACCESS_KEY = 'farm_access';
const REFRESH_KEY = 'farm_refresh';

function getAccess() {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}
function getRefresh() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}
export function setTokens({ access, refresh } = {}) {
  try {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    else localStorage.removeItem(ACCESS_KEY);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    else if (refresh !== undefined) localStorage.removeItem(REFRESH_KEY);
  } catch {}
}
export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {}
}
export function hasRefreshToken() {
  return !!getRefresh();
}

api.interceptors.request.use((config) => {
  const token = getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    const isAuthEndpoint = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/refresh');
    if (response?.status === 401 && !isAuthEndpoint && !config._retried) {
      const refresh = getRefresh();
      if (refresh) {
        config._retried = true;
        try {
          refreshPromise = refreshPromise || api.post('/auth/refresh/', { refresh }).then((r) => r.data);
          const data = await refreshPromise;
          refreshPromise = null;
          setTokens({ access: data.access });
          config.headers.Authorization = `Bearer ${data.access}`;
          return api(config);
        } catch {
          refreshPromise = null;
          clearTokens();
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else {
        clearTokens();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Surface a readable message from a DRF error payload, e.g.
// {"rate": ["Rate must be greater than 0."]} -> "Rate must be greater than 0."
export function apiErrorMessage(err, fallback = 'Something went wrong.') {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const v = data[firstKey];
    return Array.isArray(v) ? v[0] : String(v);
  }
  return fallback;
}

export const Auth = {
  register: (payload) => api.post('/auth/register/', payload).then((r) => r.data),
  login: (username, password) => api.post('/auth/login/', { username, password }).then((r) => r.data),
  me: () => api.get('/auth/me/').then((r) => r.data),
  requestPasswordReset: (email) => api.post('/auth/password-reset/', { email }).then((r) => r.data),
  confirmPasswordReset: (uid, token, password) =>
    api.post('/auth/password-reset/confirm/', { uid, token, password }).then((r) => r.data),
  users: {
    list: () => api.get('/auth/users/').then((r) => r.data),
    update: (id, payload) => api.patch(`/auth/users/${id}/`, payload).then((r) => r.data),
  },
};

export const Customers = {
  list: () => api.get('/customers/').then((r) => r.data),
  create: (payload) => api.post('/customers/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/customers/${id}/`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/customers/${id}/`),
};

export const Deliveries = {
  forDate: (date) => api.get('/deliveries/', { params: { date } }).then((r) => r.data),
  save: (date, entries) => api.post('/deliveries/', { date, entries }).then((r) => r.data),
};

export const Production = {
  forDate: (date) => api.get('/production/', { params: { date } }).then((r) => r.data),
  save: (date, am, pm) => api.post('/production/', { date, am, pm }).then((r) => r.data),
  recent: (limit = 10) => api.get('/production/recent/', { params: { limit } }).then((r) => r.data),
};

export const Expenses = {
  list: (month) => api.get('/expenses/', { params: { month } }).then((r) => r.data),
  create: (payload) => api.post('/expenses/', payload).then((r) => r.data),
  remove: (id) => api.delete(`/expenses/${id}/`),
};

export const Payments = {
  create: (payload) => api.post('/payments/', payload).then((r) => r.data),
};

export const Dashboard = {
  get: (month) => api.get('/dashboard/', { params: { month } }).then((r) => r.data),
};

export const Bills = {
  list: (month) => api.get('/bills/', { params: { month } }).then((r) => r.data),
  receipt: (customerId, month) =>
    api.get(`/bills/${customerId}/receipt/`, { params: { month } }).then((r) => r.data),
};

export const Reports = {
  get: (month) => api.get('/reports/', { params: { month } }).then((r) => r.data),
  exportUrl: (month) => `${API_BASE_URL}/reports/export/?month=${encodeURIComponent(month)}`,
};

export const Settings = {
  get: () => api.get('/settings/').then((r) => r.data),
  update: (payload) => api.put('/settings/', payload).then((r) => r.data),
};

export const Admin = {
  resetDemo: () => api.post('/reset-demo/').then((r) => r.data),
  clearAll: () => api.post('/clear-all/').then((r) => r.data),
};

export default api;
