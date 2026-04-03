import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle, AlertTriangle, Play, Save } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

function StatusUpdateModal({ transaction, nextStatus, onClose }) {
  const { updateTxStatus, loading } = useInventoryStore();
  const [notes, setNotes] = useState(`Update to ${nextStatus.replace('_', ' ')}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTxStatus(transaction.id, nextStatus, notes);
    onClose();
  };

  const getStatusConfig = () => {
    switch (nextStatus) {
      case 'IN_PROGRESS': return { icon: <Play size={24} />, color: 'var(--accent-warning)', label: 'Start Process' };
      case 'DONE': return { icon: <CheckCircle size={24} />, color: 'var(--accent-success)', label: 'Complete Execution' };
      case 'CANCELLED': return { icon: <AlertTriangle size={24} />, color: 'var(--accent-error)', label: 'Cancel / Rollback' };
      default: return { icon: <CheckCircle size={24} />, color: 'var(--primary)', label: 'Update Status' };
    }
  };

  const config = getStatusConfig();

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container animate-fade-in" style={{ maxWidth: '450px' }}>
        <header className="modal-header">
          <div className="flex-center">
            <div style={{ padding: '10px', background: `${config.color}15`, color: config.color, borderRadius: '12px' }}>
              {config.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Confirm Workflow</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Transitioning Ref:</p>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{transaction.reference_id}</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <span className={`status-badge status-${transaction.status.toLowerCase()}`}>{transaction.status}</span>
              <span style={{ color: 'var(--text-muted)' }}>→</span>
              <span className={`status-badge status-${nextStatus.toLowerCase()}`} style={{ background: config.color + '20', color: config.color }}>{nextStatus}</span>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Workflow Notes</label>
            <textarea 
              className="input-standard" 
              style={{ minHeight: '100px', resize: 'none' }}
              placeholder="Enter details for this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="premium-button" 
              style={{ width: '100%', justifyContent: 'center', padding: '16px', borderRadius: '12px', background: config.color, boxShadow: `0 8px 20px ${config.color}30` }}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Processing...' : config.label}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default StatusUpdateModal;
