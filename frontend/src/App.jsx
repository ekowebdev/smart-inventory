import React, { useEffect, useState } from 'react';
import { Package, History, LayoutDashboard, Search, AlertCircle, X } from 'lucide-react';
import { useInventoryStore } from './store/useInventoryStore';
import InventoryList from './features/inventory/components/InventoryList';
import DashboardCards from './components/DashboardCards';
import TransactionHistory from './features/transactions/components/TransactionHistory';

function App() {
  const { fetchItems, fetchTransactions, loading, itemFilter, setItemFilter } = useInventoryStore();
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    fetchItems();
    fetchTransactions();
  }, [fetchItems, fetchTransactions]);

  return (
    <div className="app-container">

      <header className="layout-header animate-fade-in">
        <div className="flex-center">
          <div className="app-logo">
            <Package size={28} color="white" />
          </div>
          <div>
            <h1 className="app-title">Smart Inventory</h1>
            <p className="app-version">Premium Core System v1.1</p>
          </div>
        </div>
      </header>

      <main>
        <DashboardCards />

        <div className="flex-between animate-fade-in" style={{ animationDelay: '0.1s', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="tab-nav" style={{ margin: 0 }}>
            <button
              className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <LayoutDashboard size={18} />
              Inventory List
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={18} />
              Ledger History
            </button>
          </div>

          {activeTab === 'inventory' && (
            <div className="search-group">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by Name or SKU..."
                className="search-input"
                value={itemFilter}
                onChange={(e) => setItemFilter(e.target.value)}
              />
              {itemFilter && (
                <button 
                  onClick={() => setItemFilter('')}
                  style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {activeTab === 'inventory' ? <InventoryList /> : <TransactionHistory />}
        </div>
      </main>

      {loading && (
        <div className="glass-card animate-fade-in" style={{ position: 'fixed', bottom: '2rem', right: '2rem', padding: '10px 20px', borderRadius: '30px' }}>
          <div className="flex-center">
            <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Syncing data...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
