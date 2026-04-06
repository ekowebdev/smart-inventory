import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, Box } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useEffect } from 'react';

function AddItemModal({ onClose }) {
  const { createItem, loading, errors, clearErrors } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    price: 0,
    physical_stock: 0,
  });

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      physical_stock: parseInt(formData.physical_stock),
      available_stock: parseInt(formData.physical_stock)
    };
    const success = await createItem(data);
    if (success) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container animate-fade-in">
        <header className="modal-header">
          <div className="flex-center">
            <div style={{ padding: '10px', background: 'var(--primary)15', color: 'var(--primary)', borderRadius: '10px' }}>
              <Box size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Register New Asset</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid cols-2">
            <div className="form-field">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className={`input-standard ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. MacBook Pro M3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">SKU Code</label>
              <input
                type="text"
                className={`input-standard ${errors.sku ? 'input-error' : ''}`}
                placeholder="e.g. LAP-MBP-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
              {errors.sku && <span className="error-text">{errors.sku}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Category</label>
              <input
                type="text"
                className={`input-standard ${errors.category ? 'input-error' : ''}`}
                placeholder="Electronics"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Initial Physical Stock</label>
              <input
                type="number"
                className="input-standard"
                value={formData.physical_stock}
                onChange={(e) => setFormData({ ...formData, physical_stock: e.target.value })}
              />
            </div>
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Price / Unit (USD)</label>
              <input
                type="number"
                step="0"
                className={`input-standard ${errors.price ? 'input-error' : ''}`}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Short Description</label>
              <textarea
                className="input-standard"
                style={{ minHeight: '80px', resize: 'none' }}
                placeholder="Enter technical details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="premium-button"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', borderRadius: '12px' }}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Creating SKU...' : 'Save & Register SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default AddItemModal;
