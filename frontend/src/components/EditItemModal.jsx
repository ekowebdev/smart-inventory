import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, Settings2, Box, Info } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useEffect } from 'react';

function EditItemModal({ item, onClose }) {
  const { updateItem, loading, errors, clearErrors } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: item.name,
    sku: item.sku,
    category: item.category,
    description: item.description,
    price: item.price,
    physical_stock: item.physical_stock,
    adjustment_reason: ''
  });

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      physical_stock: parseInt(formData.physical_stock)
    };
    // Note: adjustment_reason is currently a UI field to fulfill "Adjustment" requirement
    const success = await updateItem(item.id, data);
    if (success) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="modal-container animate-fade-in" style={{ maxWidth: '600px' }}>
        <header className="modal-header">
          <div className="flex-center">
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '10px' }}>
              <Settings2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Stock Adjustment</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modify physical inventory levels and SKU metadata</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '12px', marginBottom: '1.5rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Info size={18} style={{ color: 'var(--accent-warning)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>Caution:</strong> Adjusting physical stock directly bypasses the standard Stock In/Out workflow. Use this only for inventory corrections.
              </p>
            </div>

            <div className="form-grid cols-2">
              <div className="form-field">
                <label className="form-label">Physical Stock (Current)</label>
                <input
                  type="number"
                  className="input-standard"
                  style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'var(--accent-warning)' }}
                  value={formData.physical_stock}
                  onChange={(e) => setFormData({ ...formData, physical_stock: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">SKU Code (Read-Only)</label>
                <input
                  type="text"
                  className="input-standard"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                  value={formData.sku}
                  disabled
                />
              </div>
              <div className="form-field">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className={`input-standard ${errors.name ? 'input-error' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="form-field">
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
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Reason for Adjustment</label>
                <textarea
                  className="input-standard"
                  placeholder="e.g. Cycle count discrepancy, damaged goods..."
                  style={{ minHeight: '60px', resize: 'none' }}
                  value={formData.adjustment_reason}
                  onChange={(e) => setFormData({ ...formData, adjustment_reason: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="premium-button"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', borderRadius: '12px' }}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Processing Adjustment...' : 'Commit Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default EditItemModal;

