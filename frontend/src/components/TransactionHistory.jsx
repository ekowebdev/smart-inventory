import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Play, Filter } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import StatusUpdateModal from './StatusUpdateModal';
import TransactionReportModal from './TransactionReportModal';
import { Eye } from 'lucide-react';

function TransactionHistory() {
  const { transactions, fetchTransactions } = useInventoryStore();
  const [selectedTx, setSelectedTx] = useState(null);
  const [targetStatus, setTargetStatus] = useState(null);
  const [reportTx, setReportTx] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTransactions(typeFilter, statusFilter);
  }, [typeFilter, statusFilter, fetchTransactions]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DONE': return <CheckCircle size={14} color="var(--accent-success)" />;
      case 'IN_PROGRESS': return <Play size={14} color="var(--accent-warning)" />;
      case 'CANCELLED': return <XCircle size={14} color="var(--accent-error)" />;
      default: return <Clock size={14} color="var(--text-muted)" />;
    }
  };

  const openUpdateModal = (tx, nextStatus) => {
    setSelectedTx(tx);
    setTargetStatus(nextStatus);
  };

  const sortedTransactions = [...transactions].reverse();

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="flex-between" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(30, 41, 59, 0.4)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Transaction Ledger</h3>
        <div className="flex-center" style={{ gap: '10px' }}>
          <div className="flex-center" style={{ gap: '6px' }}>
             <Filter size={14} style={{ color: 'var(--text-muted)' }} />
             <select 
               className="input-standard" 
               style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
             >
               <option value="">All Types</option>
               <option value="STOCK_IN">Stock In</option>
               <option value="STOCK_OUT">Stock Out</option>
             </select>
          </div>
          <select 
             className="input-standard" 
             style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
          >
             <option value="">All Status</option>
             <option value="CREATED">Created</option>
             <option value="IN_PROGRESS">In Progress</option>
             <option value="DONE">Done</option>
             <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref / Item</th>
              <th style={{ textAlign: 'center' }}>Type</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Workflow Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No transaction history recorded yet. Add items and start stock flows.
                </td>
              </tr>
            ) : sortedTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>{tx.reference_id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{tx.item?.name}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-badge ${tx.type === 'STOCK_IN' ? 'status-done' : 'status-progress'}`}>
                    {tx.type}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontWeight: '700', fontSize: '1.1rem' }}>{tx.quantity}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getStatusIcon(tx.status)}
                    <span className={`status-badge status-${tx.status.toLowerCase()}`}>{tx.status}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex-center" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                    {(tx.status === 'CREATED' || tx.status === 'DRAFT') && (
                      <>
                        <button onClick={() => openUpdateModal(tx, 'IN_PROGRESS')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)', boxShadow: 'none' }}>
                          <Play size={12} /> Start
                        </button>
                        <button onClick={() => openUpdateModal(tx, 'CANCELLED')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', boxShadow: 'none' }}>
                          <XCircle size={12} /> Cancel
                        </button>
                      </>
                    )}
                    {tx.status === 'IN_PROGRESS' && (
                      <>
                        <button onClick={() => openUpdateModal(tx, 'DONE')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-success)', boxShadow: 'none' }}>
                          <CheckCircle size={12} /> Complete
                        </button>
                        <button onClick={() => openUpdateModal(tx, 'CANCELLED')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', boxShadow: 'none' }}>
                          <XCircle size={12} /> Rollback
                        </button>
                      </>
                    )}
                    {tx.status === 'DONE' && (
                      <button 
                        onClick={() => setReportTx(tx)} 
                        className="premium-button" 
                        style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', boxShadow: 'none' }}
                      >
                        <Eye size={12} /> View Report
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <StatusUpdateModal 
          transaction={selectedTx} 
          nextStatus={targetStatus} 
          onClose={() => { setSelectedTx(null); setTargetStatus(null); }} 
        />
      )}

      {reportTx && (
        <TransactionReportModal 
          transaction={reportTx} 
          onClose={() => setReportTx(null)} 
        />
      )}
    </div>
  );
}

export default TransactionHistory;
