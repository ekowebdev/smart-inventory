import { create } from 'zustand';
import { inventoryApi } from '../api/inventoryApi';
import { itemSchema } from '../schemas/itemSchema';
import { transactionSchema } from '../schemas/transactionSchema';

const formatZodErrors = (error) => {
  const errors = {};
  error.issues.forEach((issue) => {
    errors[issue.path[0]] = issue.message;
  });
  return errors;
};

export const useInventoryStore = create((set, get) => ({
  items: [],
  transactions: [],
  loading: false,
  errors: {},

  fetchItems: async (filter = '') => {
    set({ loading: true });
    try {
      const { data } = await inventoryApi.getItems(filter);
      set({ items: data, loading: false, error: null });
    } catch (err) {
      set({ items: [], loading: false });
    }
  },

  fetchTransactions: async (type = '', status = '') => {
    set({ loading: true });
    try {
      const { data } = await inventoryApi.getTransactions(type, status);
      set({ transactions: data, loading: false });
    } catch (err) {
      set({ transactions: [], loading: false });
    }
  },

  clearErrors: () => set({ errors: {} }),

  createStockIn: async (data) => {
    const result = transactionSchema.safeParse(data);
    if (!result.success) {
      set({ errors: formatZodErrors(result.error) });
      return false;
    }

    set({ loading: true, errors: {} });
    try {
      await inventoryApi.createStockIn(data);
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      set({ errors: { general: errMsg }, loading: false });
      return false;
    }
  },

  createStockOut: async (data) => {
    const result = transactionSchema.safeParse(data);
    if (!result.success) {
      set({ errors: formatZodErrors(result.error) });
      return false;
    }

    set({ loading: true, errors: {} });
    try {
      await inventoryApi.createStockOut(data);
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      set({ errors: { general: errMsg }, loading: false });
      return false;
    }
  },

  createItem: async (data) => {
    const result = itemSchema.safeParse(data);
    if (!result.success) {
      set({ errors: formatZodErrors(result.error) });
      return false;
    }

    set({ loading: true, errors: {} });
    try {
      await inventoryApi.createItem(data);
      get().fetchItems();
      set({ loading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      const backendErrors = {};
      if (errMsg.includes("Item.Name")) backendErrors.name = "Name already exists or invalid";
      if (errMsg.includes("Item.SKU")) backendErrors.sku = "SKU already exists or invalid";

      set({ errors: Object.keys(backendErrors).length > 0 ? backendErrors : { general: errMsg }, loading: false });
      return false;
    }
  },

  updateItem: async (id, data) => {
    const result = itemSchema.safeParse(data);
    if (!result.success) {
      set({ errors: formatZodErrors(result.error) });
      return false;
    }

    set({ loading: true, errors: {} });
    try {
      await inventoryApi.updateItem(id, data);
      get().fetchItems();
      set({ loading: false });
      return true;
    } catch (err) {
      set({ errors: { general: err.response?.data?.error || err.message }, loading: false });
      return false;
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
