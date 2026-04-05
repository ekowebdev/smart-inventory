import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
});

export const inventoryApi = {
  getItems: (filter = '', page = 1, limit = 10) => api.get(`/items?filter=${filter}&page=${page}&limit=${limit}`),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (data) => api.post('/items', data),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  deleteItem: (id) => api.delete(`/items/${id}`),

  getTransactions: (type = '', status = '', page = 1, limit = 10) => api.get(`/transactions?type=${type}&status=${status}&page=${page}&limit=${limit}`),
  createStockIn: (data) => api.post('/transactions/stock-in', data),
  createStockOut: (data) => api.post('/transactions/stock-out', data),
  updateStatus: (id, data) => api.put(`/transactions/${id}/status`, data),
};
