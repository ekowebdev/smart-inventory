import React, { useState } from 'react';
import { Plus, Edit3, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import TransactionModal from './TransactionModal';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteConfirmModal from './DeleteConfirmModal';


function InventoryList() {
  const { items } = useInventoryStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);


  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Inventory Assets</h3>
        <button className="premium-button" onClick={() => setIsAddModalOpen(true)}>

          <Plus size={18} />
          Add New SKU
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Details</th>
              <th style={{ textAlign: 'center' }}>Physical Stock</th>
              <th style={{ textAlign: 'center' }}>Available Stock</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
              <th style={{ textAlign: 'right' }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No items found. Add a new SKU to get started.
                </td>
              </tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>{item.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.sku}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: '700', fontSize: '1.1rem' }}>{item.physical_stock}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', color: item.available_stock < 5 ? 'var(--accent-warning)' : 'var(--accent-success)' }}>
                    {item.available_stock}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="flex-center" style={{ justifyContent: 'center' }}>
                    <button 
                      onClick={() => openModal(item, 'IN')}
                      className="premium-button" 
                      style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', boxShadow: 'none' }}
                    >
                      <ArrowDownRight size={18} />
                    </button>
                    <button 
                      onClick={() => openModal(item, 'OUT')}
                      className="premium-button"
                      style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', boxShadow: 'none' }}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex-center" style={{ justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setEditingItem(item)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => setDeletingItem(item)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-error)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalType && <TransactionModal item={selectedItem} type={modalType} onClose={() => setModalType(null)} />}
      {isAddModalOpen && <AddItemModal onClose={() => setIsAddModalOpen(false)} />}
      {editingItem && <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} />}
      {deletingItem && <DeleteConfirmModal item={deletingItem} onClose={() => setDeletingItem(null)} />}

    </div>
  );
}

export default InventoryList;
