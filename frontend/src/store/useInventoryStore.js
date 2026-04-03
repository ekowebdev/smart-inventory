import { create } from 'zustand';
import { inventoryApi } from '../api/inventoryApi';

export const useInventoryStore = create((set, get) => ({
  items: [],
  transactions: [],
  loading: false,
  error: null,

  fetchItems: async (filter = '') => {
    set({ loading: true });
    try {
      const { data } = await inventoryApi.getItems(filter);
      set({ items: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTransactions: async (type = '', status = '') => {
    set({ loading: true });
    try {
      const { data } = await inventoryApi.getTransactions(type, status);
      set({ transactions: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createStockIn: async (data) => {
    set({ loading: true });
    try {
      await inventoryApi.createStockIn(data);
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createStockOut: async (data) => {
    set({ loading: true });
    try {
      await inventoryApi.createStockOut(data);
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createItem: async (data) => {
    set({ loading: true });
    try {
      await inventoryApi.createItem(data);
      get().fetchItems();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateItem: async (id, data) => {
    set({ loading: true });
    try {
      await inventoryApi.updateItem(id, data);
      get().fetchItems();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteItem: async (id) => {
    set({ loading: true });
    try {
      await inventoryApi.deleteItem(id);
      get().fetchItems();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateTxStatus: async (id, status, notes = '') => {
    set({ loading: true });
    try {
      await inventoryApi.updateStatus(id, { status, notes });
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));
