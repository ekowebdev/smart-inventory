import React from 'react';
import { Package, Smartphone, AlertCircle, ShoppingCart } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

function DashboardCards() {
  const { items } = useInventoryStore();
  
  const totalItems = items.length;
  const totalPhysical = items.reduce((sum, item) => sum + (item.physical_stock || 0), 0);
  const totalAvailable = items.reduce((sum, item) => sum + (item.available_stock || 0), 0);
  const totalReserved = totalPhysical - totalAvailable;

  const stats = [
    { title: 'Total SKUs', value: totalItems, icon: <Package size={24} />, color: 'var(--primary)' },
    { title: 'Warehouse Stock', value: totalPhysical, icon: <Smartphone size={24} />, color: 'var(--accent-success)' },
    { title: 'Available For Sale', value: totalAvailable, icon: <ShoppingCart size={24} />, color: 'var(--accent-warning)' },
    { title: 'Allocated Out', value: totalReserved, icon: <AlertCircle size={24} />, color: 'var(--accent-error)' },
  ];

  return (
    <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.05s' }}>
      {stats.map((stat, i) => (
        <div key={i} className="glass-card flex-between group transition-all" style={{ padding: '2rem' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{stat.title}</p>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', tracking: '-0.02em' }}>{stat.value}</h3>
          </div>
          <div style={{ padding: '12px', background: `${stat.color}15`, borderRadius: '12px', color: stat.color }}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
