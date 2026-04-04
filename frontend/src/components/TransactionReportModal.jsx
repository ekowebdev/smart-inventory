import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, FileText, CheckCircle, Package, Calendar, ClipboardList } from 'lucide-react';

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
      <div className="modal-container report-modal animate-fade-in" style={{
        maxWidth: '740px',
        background: '#ffffff',
        color: '#1e293b',
        border: 'none'
      }}>
        {/* Header - Action Bar */}
        <header className="modal-header print-hide" style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '1.25rem 2rem'
        }}>
          <div className="flex-center">
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px' }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#334155', margin: 0 }}>Official Stock Report</h3>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audit-Ready Document</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => window.print()}
              className="premium-button print-hide"
              style={{
                background: '#fff',
                color: '#334155',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                padding: '8px 16px',
                fontSize: '0.8rem'
              }}
            >
              <Printer size={14} /> Print Report
            </button>
            <button
              onClick={onClose}
              className="print-hide"
              style={{
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                transition: 'all 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Print Styles */}
        <style>
          {`
            @media print {
              /* Hide the main app root and any other overlays */
              #root, 
              .modal-overlay:not(:has(.report-modal)) {
                display: none !important;
              }

              body, html {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: auto !important;
              }

              /* The overlay itself should not behave like a modal anymore */
              .modal-overlay {
                position: relative !important;
                display: block !important;
                background: white !important;
                backdrop-filter: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                height: auto !important;
                z-index: auto !important;
              }

              .report-modal {
                position: static !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                max-height: none !important;
                display: flex !important;
                flex-direction: column !important;
                background: white !important;
                color: black !important;
              }

              .modal-header {
                border-bottom: 2px solid #334155 !important;
                background: white !important;
                padding: 15mm 20mm 10mm 20mm !important;
                display: flex !important;
                justify-content: space-between !important;
              }

              .modal-body {
                overflow: visible !important;
                max-height: none !important;
                padding: 10mm 20mm !important;
                flex: none !important;
                display: block !important;
              }

              .modal-footer {
                position: relative !important;
                bottom: auto !important;
                border-top: 1px solid #e2e8f0 !important;
                background: white !important;
                padding: 15mm 20mm !important;
                display: block !important;
              }

              /* General fixes for print quality */
              h2, h3, h4 { color: black !important; }
              p, span { color: #334155 !important; }
              
              /* Ensure backgrounds are printed if 'Print Background Graphics' is off */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Final overrides */
              .print-hide {
                display: none !important;
              }
            }

            @page {
              size: A4;
              margin: 0;
            }
          `}
        </style>

        {/* Report Content */}
        <div className="modal-body" style={{ padding: '3rem' }}>
          {/* Brand/Watermark Mockup */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              padding: '12px',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '12px',
              marginBottom: '1rem'
            }}>
              <Package size={32} />
            </div>
            <h2 style={{ margin: '0', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em', color: '#0f172a' }}>
              SMART<span style={{ color: '#3b82f6' }}>INVENTORY</span>
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700' }}>
              Warehouse Operations Division
            </p>
            <div style={{ width: '40px', height: '3px', background: '#3b82f6', margin: '1.5rem auto' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 6px', fontWeight: '800' }}>Reference ID</p>
              <h3 style={{ margin: '0', fontSize: '1.25rem', fontWeight: '800', color: '#334155', fontFamily: 'monospace' }}>{transaction.reference_id}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 6px', fontWeight: '800' }}>Issuance Date</p>
              <p style={{ margin: '0', fontSize: '1rem', fontWeight: '700', color: '#334155' }}>{formatDate(transaction.updated_at)}</p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '2rem',
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: '16px',
            marginBottom: '3rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#64748b' }}>
                <Package size={18} />
                <span style={{ fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Asset Information</span>
              </div>
              <h4 style={{ margin: '0', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{transaction.item?.name}</h4>
              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ padding: '4px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>
                  SKU: {transaction.item?.sku}
                </span>
                <span style={{ padding: '4px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>
                  Category: {transaction.item?.category}
                </span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#64748b' }}>
                <ClipboardList size={18} />
                <span style={{ fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Movement</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: '900', color: transaction.type === 'STOCK_IN' ? '#10b981' : '#f43f5e' }}>
                  {transaction.type === 'STOCK_IN' ? '+' : '-'}{transaction.quantity}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#64748b' }}>UNITS</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.85rem', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: transaction.type === 'STOCK_IN' ? '#10b981' : '#f43f5e' }}></span>
                {transaction.type.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Audit Trail Section */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Calendar size={18} style={{ color: '#3b82f6' }} /> Chain of Custody & Audit logs
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '10px' }}>
              {transaction.logs?.map((log, index) => (
                <div key={log.id} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  {index !== transaction.logs.length - 1 && (
                    <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-20px', width: '2px', background: '#f1f5f9' }}></div>
                  )}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: log.to_status === 'DONE' ? '#10b981' : '#f1f5f9',
                    boxShadow: log.to_status === 'DONE' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                    border: log.to_status === 'DONE' ? 'none' : '2px solid #e2e8f0'
                  }}>
                    {log.to_status === 'DONE' ? <CheckCircle size={14} color="#fff" /> : <div style={{ width: '6px', height: '6px', background: '#cbd5e1', borderRadius: '50%' }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>{log.to_status}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{formatDate(log.created_at)}</span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                      {log.notes || 'Automated status migration recorded by System'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="modal-footer" style={{
          background: '#f8fafc',
          padding: '1.5rem 3rem',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'center'
        }}>
          <div>
            <p style={{ margin: '0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', lineHeight: '1.6' }}>
              SECURED DOCUMENT - SYSTEM GENERATED <br />
              Generated on: {new Date().toLocaleString()} | Trace ID: {transaction.id.toString().padStart(8, '0')}
            </p>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}

export default TransactionReportModal;
