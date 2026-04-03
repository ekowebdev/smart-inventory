import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, Edit, Box } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

function EditItemModal({ item, onClose }) {
  const { updateItem, loading } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: item.name,
    sku: item.sku,
    category: item.category,
    description: item.description,
    price: item.price,
    physical_stock: item.physical_stock,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { 
        ...formData, 
        price: parseFloat(formData.price),
        physical_stock: parseInt(formData.physical_stock)
    };
    await updateItem(item.id, data);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container animate-fade-in">
        <header className="modal-header">
          <div className="flex-center">
            <div style={{ padding: '10px', background: 'var(--primary)15', color: 'var(--primary)', borderRadius: '10px' }}>
              <Edit size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit SKU Details</h3>
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
                className="input-standard" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="form-field">
              <label className="form-label">SKU Code</label>
              <input 
                type="text" 
                className="input-standard" 
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                required 
              />
            </div>
            <div className="form-field">
              <label className="form-label">Category</label>
              <input 
                type="text" 
                className="input-standard" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Physical Stock (Adjustment)</label>
              <input 
                type="number" 
                className="input-standard" 
                value={formData.physical_stock}
                onChange={(e) => setFormData({...formData, physical_stock: e.target.value})}
              />
            </div>
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Price / Unit (USD)</label>
              <input 
                type="number" 
                step="0.01"
                className="input-standard" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Short Description</label>
              <textarea 
                className="input-standard" 
                style={{ minHeight: '80px', resize: 'none' }}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              {loading ? 'Updating SKU...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default EditItemModal;
