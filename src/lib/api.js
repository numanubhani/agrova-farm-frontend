import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

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
  exportUrl: (month) => `/api/reports/export/?month=${encodeURIComponent(month)}`,
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
