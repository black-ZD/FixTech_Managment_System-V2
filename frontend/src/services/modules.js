import api from './api';

export const authAPI = {
  login:        d => api.post('/auth/login', d),
  refresh:      d => api.post('/auth/refresh-token', d),
  logout:       d => api.post('/auth/logout', d),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export const productsAPI = {
  getAll:         ()     => api.get('/products'),
  getById:        id     => api.get(`/products/${id}`),
  getLowStock:    (t)    => api.get('/products/low-stock', { params: { threshold: t } }),
  getStockHistory:(pid)  => api.get('/products/stock-history', { params: { product_id: pid } }),
  create:         d      => api.post('/products', d),
  update:         (id,d) => api.put(`/products/${id}`, d),
  delete:         id     => api.delete(`/products/${id}`),
};

export const salesAPI = {
  getAll:    ()  => api.get('/sales'),
  create:    d   => api.post('/sales', d),
  getDaily:  ()  => api.get('/sales/daily'),
  getMonthly:()  => api.get('/sales/monthly'),
};

export const expensesAPI = {
  getAll:        ()     => api.get('/expenses'),
  getSummary:    ()     => api.get('/expenses/summary'),
  getMonthlyTrend:()    => api.get('/expenses/trend'),
  create:        d      => api.post('/expenses', d),
  update:        (id,d) => api.put(`/expenses/${id}`, d),
  delete:        id     => api.delete(`/expenses/${id}`),
};

export const staffAPI = {
  getAll:         ()     => api.get('/staff'),
  create:         d      => api.post('/staff', d),
  update:         (id,d) => api.put(`/staff/${id}`, d),
  delete:         id     => api.delete(`/staff/${id}`),
  markAttendance: d      => api.post('/staff/attendance', d),
  getAttendance:  sid    => api.get('/staff/attendance', { params: { staff_id: sid } }),
};

export const reportsAPI = {
  dailySales:         (days) => api.get('/reports/sales', { params: { days } }),
  monthlyProfit:      ()     => api.get('/reports/profit'),
  expenseBreakdown:   ()     => api.get('/reports/expenses'),
  productPerformance: ()     => api.get('/reports/product-performance'),
};
