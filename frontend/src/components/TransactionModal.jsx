import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useEffect } from 'react';

function TransactionModal({ item, type, onClose }) {
  const { createStockIn, createStockOut, loading, errors, clearErrors } = useInventoryStore();
  const [qty, setQty] = useState(1);
  const [refID, setRefID] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('idle'); // idle, success, error

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { item_id: item.id, quantity: parseInt(qty), reference_id: refID, notes };
      let success = false;
      if (type === 'IN') {
        success = await createStockIn(data);
      } else {
        success = await createStockOut(data);
      }
      
      if (success) {
        setStatus('success');
        setTimeout(onClose, 1500);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <div className="glass-card animate-fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', animation: 'bounce 1s infinite' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Sync Completed</h2>
          <p style={{ color: 'var(--text-muted)' }}>Stock {type === 'IN' ? 'Inbound' : 'Outbound'} successful.</p>
        </div>
      </div>,
      document.body
    );
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container animate-fade-in">
        <header className="modal-header">
          <div className="flex-center">
            <div style={{ padding: '8px', background: `${type === 'IN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}`, color: `${type === 'IN' ? 'var(--accent-success)' : 'var(--accent-warning)'}`, borderRadius: '8px' }}>
              {type === 'IN' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Stock {type === 'IN' ? 'Inbound' : 'Outbound Allocation'}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="flex-between">
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Asset</p>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{item.sku}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avail: {item.available_stock} {type === 'OUT' ? 'Units' : ''}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phys: {item.physical_stock} Units</p>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Quantity to {type === 'IN' ? 'Receive' : 'Allocate'}</label>
                <input 
                  type="number" 
                  className={`input-standard ${errors.quantity ? 'input-error' : ''}`} 
                  style={{ fontSize: '1.2rem', fontWeight: '800', textAlign: 'center' }}
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)} 
                />
                {errors.quantity && <span className="error-text" style={{ textAlign: 'center' }}>{errors.quantity}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">{type === 'IN' ? 'Supplier / Source' : 'Recipient / Customer'}</label>
                <input 
                  type="text" 
                  className={`input-standard ${errors.reference_id || errors.item_id ? 'input-error' : ''}`} 
                  placeholder="e.g. Warehouse A / John Doe" 
                  value={refID} 
                  onChange={(e) => setRefID(e.target.value)} 
                />
                {(errors.reference_id || errors.item_id) && <span className="error-text">{errors.reference_id || errors.item_id}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Internal Notes</label>
                <textarea 
                  className="input-standard" 
                  style={{ minHeight: '60px', resize: 'none' }}
                  placeholder="Reason for movement..." 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
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
              <Send size={18} />
              {loading ? 'Processing...' : `Confirm Stock ${type === 'IN' ? 'In' : 'Out'}`}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default TransactionModal;
