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
  // --- Data State ---
  items: [],
  metaItems: {},
  transactions: [],
  metaTransactions: {},
  loading: false,
  errors: {},

  // --- UI State (Items) ---
  itemFilter: '',
  itemPage: 1,
  itemLimit: 5,

  // --- UI State (Transactions) ---
  txType: '',
  txStatus: '',
  txPage: 1,
  txLimit: 5,

  // --- UI State Setters ---
  setItemFilter: (filter) => {
    set({ itemFilter: filter, itemPage: 1 });
    get().fetchItems();
  },
  setItemPage: (page) => {
    set({ itemPage: page });
    get().fetchItems();
  },
  setItemLimit: (limit) => {
    set({ itemLimit: limit, itemPage: 1 });
    get().fetchItems();
  },
  setTxType: (type) => {
    set({ txType: type, txPage: 1 });
    get().fetchTransactions();
  },
  setTxStatus: (status) => {
    set({ txStatus: status, txPage: 1 });
    get().fetchTransactions();
  },
  setTxPage: (page) => {
    set({ txPage: page });
    get().fetchTransactions();
  },
  setTxLimit: (limit) => {
    set({ txLimit: limit, txPage: 1 });
    get().fetchTransactions();
  },

  // --- Reset Helper (Minimalist logic: reset filters and page to default) ---
  resetUIState: () => {
    set({
      itemFilter: '',
      itemPage: 1,
      txType: '',
      txStatus: '',
      txPage: 1
    });
  },

  // --- Fetch Methods ---
  fetchItems: async () => {
    const { itemFilter, itemPage, itemLimit } = get();
    set({ loading: true });
    try {
      const response = await inventoryApi.getItems(itemFilter, itemPage, itemLimit);
      set({ 
        items: response.data.data, 
        metaItems: response.data.meta,
        loading: false, 
        errors: {} 
      });
    } catch (err) {
      set({ items: [], metaItems: {}, loading: false });
    }
  },

  fetchTransactions: async () => {
    const { txType, txStatus, txPage, txLimit } = get();
    set({ loading: true });
    try {
      const response = await inventoryApi.getTransactions(txType, txStatus, txPage, txLimit);
      set({ 
        transactions: response.data.data, 
        metaTransactions: response.data.meta,
        loading: false, 
        errors: {}
      });
    } catch (err) {
      set({ transactions: [], metaTransactions: {}, loading: false });
    }
  },

  clearErrors: () => set({ errors: {} }),

  // --- Write Actions (Create, Update, Delete) ---
  // All these will now reset filters to ensure newly added/updated data is visible on Page 1
  
  createStockIn: async (data) => {
    const result = transactionSchema.safeParse(data);
    if (!result.success) {
      set({ errors: formatZodErrors(result.error) });
      return false;
    }

    set({ loading: true, errors: {} });
    try {
      await inventoryApi.createStockIn(data);
      get().resetUIState(); // Reset filters
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
      return true;
    } catch (err) {
      const errorData = err.response?.data?.error;
      const errMsg = errorData?.message || err.message;
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
      get().resetUIState(); // Reset filters
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
      return true;
    } catch (err) {
      const errorData = err.response?.data?.error;
      const errMsg = errorData?.message || err.message;
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
      get().resetUIState(); // Reset filters
      get().fetchItems();
      set({ loading: false });
      return true;
    } catch (err) {
      const errorData = err.response?.data?.error;
      const errMsg = errorData?.message || err.message;
      const backendErrors = {};
      
      if (errorData?.code === "INVALID_INPUT") {
        if (errMsg.includes("Name")) backendErrors.name = "Name already exists or invalid";
        if (errMsg.includes("SKU")) backendErrors.sku = "SKU already exists or invalid";
      }

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
      get().resetUIState(); // Reset filters
      get().fetchItems();
      set({ loading: false });
      return true;
    } catch (err) {
      const errorData = err.response?.data?.error;
      set({ errors: { general: errorData?.message || err.message }, loading: false });
      return false;
    }
  },

  deleteItem: async (id) => {
    set({ loading: true });
    try {
      await inventoryApi.deleteItem(id);
      get().resetUIState(); // Reset filters
      get().fetchItems();
      set({ loading: false });
    } catch (err) {
      set({ errors: { general: err.response?.data?.error?.message || err.message }, loading: false });
    }
  },

  updateTxStatus: async (id, status, notes = '') => {
    set({ loading: true });
    try {
      await inventoryApi.updateStatus(id, { status, notes });
      get().resetUIState(); // Reset filters
      get().fetchItems();
      get().fetchTransactions();
      set({ loading: false });
    } catch (err) {
      set({ errors: { general: err.response?.data?.error?.message || err.message }, loading: false });
    }
  }
}));
