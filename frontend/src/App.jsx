import React, { useEffect, useState } from 'react';
import { Package, History, LayoutDashboard, Search, AlertCircle } from 'lucide-react';
import { useInventoryStore } from './store/useInventoryStore';
import InventoryList from './components/InventoryList';
import DashboardCards from './components/DashboardCards';
import TransactionHistory from './components/TransactionHistory';

function App() {
  const { fetchItems, fetchTransactions, loading, error } = useInventoryStore();
  const [activeTab, setActiveTab] = useState('inventory');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchItems(filter);
    fetchTransactions();
  }, [filter, fetchItems, fetchTransactions]);

  return (
    <div className="app-container">
      {error && (
        <div className="glass-card flex-center" style={{ borderColor: 'var(--accent-error)', color: 'var(--accent-error)', marginBottom: '2rem' }}>
          <AlertCircle size={20} />
          <span>Server Error: {error}. Is the backend running?</span>
        </div>
      )}

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

        <div className="search-group">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search SKU or name..." 
            className="search-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </header>

      <main>
        <DashboardCards />

        <div className="tab-nav animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
