import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download, FileText, CheckCircle, Package, User, Calendar, ClipboardList } from 'lucide-react';

function TransactionReportModal({ transaction, onClose }) {
  if (!transaction) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return createPortal(
    <div className="modal-overlay" style={{ backdropFilter: 'blur(12px)' }}>
      <div className="modal-content report-modal" style={{ 
        maxWidth: '700px', 
        background: '#fff', 
        color: '#1e293b',
        padding: '0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header - Action Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem 1.5rem', 
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
            <FileText size={18} />
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Official Stock Report</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => window.print()}
              className="premium-button print-hide" 
              style={{ 
                background: '#fff', 
                color: '#334155', 
                border: '1px solid #e2e8f0', 
                boxShadow: 'none',
                padding: '6px 12px',
                fontSize: '0.8rem'
              }}
            >
              <Printer size={14} /> Print
            </button>
            <button 
              onClick={onClose} 
              className="print-hide"
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#94a3b8',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Print Styles */}
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .report-modal, .report-modal * {
                visibility: visible;
              }
              .report-modal {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: none !important;
                border: none !important;
              }
              .print-hide {
                display: none !important;
              }
              .modal-overlay {
                background: none !important;
                backdrop-filter: none !important;
              }
            }
          `}
        </style>

        {/* Report Content */}
        <div style={{ padding: '2.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
          {/* Brand/Watermark Mockup */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#0f172a' }}>
              SMART<span style={{ color: '#3b82f6' }}>INVENTORY</span>
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Warehouse Operations Division
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px', fontWeight: '700' }}>Transaction Ref</p>
              <h3 style={{ margin: '0', fontSize: '1.1rem', fontWeight: '700' }}>{transaction.reference_id}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px', fontWeight: '700' }}>Completion Date</p>
              <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: '600' }}>{formatDate(transaction.updated_at)}</p>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1.5rem', 
            background: '#f1f5f9', 
            padding: '1.5rem', 
            borderRadius: '12px',
            marginBottom: '2.5rem'
          }}>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#475569' }}>
                 <Package size={16} />
                 <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Item Information</span>
               </div>
               <p style={{ margin: '0', fontSize: '1rem', fontWeight: '700' }}>{transaction.item?.name}</p>
               <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>SKU: {transaction.item?.sku}</p>
               <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Category: {transaction.item?.category}</p>
            </div>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#475569' }}>
                 <ClipboardList size={16} />
                 <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Movement Details</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                 <span style={{ fontSize: '1.5rem', fontWeight: '800', color: transaction.type === 'STOCK_IN' ? '#10b981' : '#f43f5e' }}>
                   {transaction.type === 'STOCK_IN' ? '+' : '-'}{transaction.quantity}
                 </span>
                 <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Units</span>
               </div>
               <p style={{ margin: '4px 0 0', fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>
                 Type: <span style={{ textTransform: 'capitalize' }}>{transaction.type.replace('_', ' ').toLowerCase()}</span>
               </p>
            </div>
          </div>

          {/* Audit Trail Section */}
          <div style={{ marginBottom: '1rem' }}>
             <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Calendar size={16} /> Status History & Audit Trail
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {transaction.logs?.map((log, index) => (
                 <div key={log.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                   {index !== transaction.logs.length - 1 && (
                     <div style={{ position: 'absolute', left: '10px', top: '24px', bottom: '-15px', width: '2px', background: '#e2e8f0' }}></div>
                   )}
                   <div style={{ 
                     width: '22px', 
                     height: '22px', 
                     borderRadius: '50%', 
                     background: log.to_status === 'DONE' ? '#10b981' : '#e2e8f0', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center',
                     flexShrink: 0,
                     zIndex: 2
                   }}>
                     {log.to_status === 'DONE' && <CheckCircle size={14} color="#fff" />}
                   </div>
                   <div style={{ flex: 1 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Status: {log.to_status}</span>
                       <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatDate(log.created_at)}</span>
                     </div>
                     <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                       "{log.notes || 'Automated status migration'}"
                     </p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1.5rem 2.5rem', 
          background: '#f8fafc', 
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', fontSize: '0.65rem', color: '#94a3b8', lineHeight: '1.5' }}>
            This is a computer-generated document. No signature is required. <br />
            System Timestamp: {new Date().toISOString()} | Trace ID: TR-{transaction.id}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TransactionReportModal;
