import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Play, Filter, RotateCcw, Eye, Package, ListChecks } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import StatusUpdateModal from './StatusUpdateModal';
import TransactionReportModal from './TransactionReportModal';
import Pagination from '../../../components/Pagination';

function TransactionHistory() {
  const { 
    transactions, 
    metaTransactions, 
    txType,
    txStatus,
    txPage,
    txLimit,
    setTxType,
    setTxStatus,
    setTxPage,
    setTxLimit 
  } = useInventoryStore();
  
  const [selectedTx, setSelectedTx] = useState(null);
  const [targetStatus, setTargetStatus] = useState(null);
  const [reportTx, setReportTx] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DONE': return <CheckCircle size={14} color="var(--accent-success)" />;
      case 'IN_PROGRESS': return <Play size={14} color="var(--accent-warning)" />;
      case 'CANCELLED': return <XCircle size={14} color="var(--accent-error)" />;
      default: return <Clock size={14} color="var(--text-muted)" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'DONE': return 'status-done';
      case 'IN_PROGRESS': return 'status-warning';
      case 'CANCELLED': return 'status-error';
      default: return 'status-created';
    }
  };

  const openUpdateModal = (tx, nextStatus) => {
    setSelectedTx(tx);
    setTargetStatus(nextStatus);
  };

  const handlePageChange = (page) => {
    setTxPage(page);
  };

  const handlePageSizeChange = (e) => {
    setTxLimit(Number(e.target.value));
  };

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="flex-between" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(30, 41, 59, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: '0.75rem' }}>
            <ListChecks size={20} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Transaction Ledger</h3>
        </div>

        <div className="flex-center" style={{ gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Show</span>
            <select 
              value={txLimit} 
              onChange={handlePageSizeChange}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)', 
                color: 'white', 
                borderRadius: '0.5rem',
                padding: '0.25rem 0.5rem',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            >
              <option value="5" style={{ background: '#1e293b' }}>5</option>
              <option value="10" style={{ background: '#1e293b' }}>10</option>
              <option value="20" style={{ background: '#1e293b' }}>20</option>
              <option value="50" style={{ background: '#1e293b' }}>50</option>
            </select>
          </div>

          <div className="flex-center" style={{ gap: '10px' }}>
            <div className="flex-center" style={{ gap: '6px' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                className="input-standard"
                style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="STOCK_IN">Stock In</option>
                <option value="STOCK_OUT">Stock Out</option>
              </select>
            </div>
            <select
              className="input-standard"
              style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
              value={txStatus}
              onChange={(e) => setTxStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="CREATED">Created</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {(txType || txStatus) && (
              <button
                onClick={() => { setTxType(''); setTxStatus(''); }}
                title="Reset Filters"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
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
            {!Array.isArray(transactions) || transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No transaction history recorded yet. Add items and start stock flows.
                </td>
              </tr>
            ) : transactions.map((tx) => (
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
                    <span className={`status-badge ${getStatusClass(tx.status)}`}>{tx.status}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex-center" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                    {/* Stock In Workflow: CREATED -> IN_PROGRESS -> DONE */}
                    {tx.type === 'STOCK_IN' && tx.status === 'CREATED' && (
                      <>
                        <button onClick={() => openUpdateModal(tx, 'IN_PROGRESS')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', boxShadow: 'none' }}>
                          <Play size={12} /> Start Receiving
                        </button>
                        <button onClick={() => openUpdateModal(tx, 'CANCELLED')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', boxShadow: 'none' }}>
                          <XCircle size={12} /> Cancel
                        </button>
                      </>
                    )}

                    {/* Stock Out Workflow: DRAFT -> IN_PROGRESS -> DONE */}
                    {tx.type === 'STOCK_OUT' && tx.status === 'DRAFT' && (
                      <>
                        <button onClick={() => openUpdateModal(tx, 'IN_PROGRESS')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)', boxShadow: 'none' }}>
                          <Package size={12} /> Start Packing
                        </button>
                        <button onClick={() => openUpdateModal(tx, 'CANCELLED')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', boxShadow: 'none' }}>
                          <XCircle size={12} /> Cancel
                        </button>
                      </>
                    )}

                    {/* In Progress to Done for both */}
                    {tx.status === 'IN_PROGRESS' && (
                      <>
                        <button onClick={() => openUpdateModal(tx, 'DONE')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-success)', boxShadow: 'none' }}>
                          <CheckCircle size={12} /> {tx.type === 'STOCK_IN' ? 'Confirm Delivery' : 'Confirm Dispatch'}
                        </button>
                        <button onClick={() => openUpdateModal(tx, 'CANCELLED')} className="premium-button" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', boxShadow: 'none' }}>
                          <XCircle size={12} /> {tx.type === 'STOCK_OUT' ? 'Rollback' : 'Reject'}
                        </button>
                      </>
                    )}

                    {/* Report for DONE */}
                    {tx.status === 'DONE' && (
                      <button
                        onClick={() => setReportTx(tx)}
                        className="premium-button"
                        style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(30, 41, 59, 0.4)', color: 'var(--text-muted)', border: '1px solid var(--border)', boxShadow: 'none' }}
                      >
                        <Eye size={12} /> View Official Report
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '1rem 1.5rem' }}>
        <Pagination 
          currentPage={metaTransactions.current_page || 1} 
          totalPages={metaTransactions.total_pages || 1} 
          onPageChange={handlePageChange} 
        />
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
