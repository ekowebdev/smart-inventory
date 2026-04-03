import React from 'react';
import ReactDOM from 'react-dom';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

function DeleteConfirmModal({ item, onClose }) {
  const { deleteItem, loading, error } = useInventoryStore();

  const handleDelete = async () => {
    await deleteItem(item.id);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container animate-fade-in" style={{ maxWidth: '400px' }}>
        <header className="modal-header">
          <div className="flex-center">
            <div style={{ padding: '8px', background: 'var(--accent-error)15', color: 'var(--accent-error)', borderRadius: '8px' }}>
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Confirm Deletion</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </header>

        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
            Are you sure you want to delete <span style={{ color: 'white', fontWeight: '700' }}>{item.name}</span> ({item.sku})?
          </p>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-error)30', borderRadius: '12px', fontSize: '0.85rem' }}>
            <p style={{ color: 'var(--accent-error)', fontWeight: '600' }}>Warning: This action cannot be undone.</p>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Deletion will fail if this SKU is referenced in the transaction ledger.</p>
          </div>

          {error && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', borderRadius: '12px', fontSize: '0.8rem' }}>
              Error: {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={onClose} className="premium-button" style={{ background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)', boxShadow: 'none' }}>
              Cancel
            </button>
            <button 
              onClick={handleDelete} 
              className="premium-button" 
              style={{ background: 'var(--accent-error)', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)' }}
              disabled={loading}
            >
              <Trash2 size={16} />
              {loading ? 'Deleting...' : 'Delete SKU'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default DeleteConfirmModal;
