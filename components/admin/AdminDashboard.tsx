import React, { useState } from 'react';
import { 
  LayersIcon, ShoppingBagIcon, UserIcon, MessageCircleIcon, 
  CreditCardIcon, SettingsIcon, LogOutIcon, LayoutIcon, DatabaseIcon 
} from '../Icons';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminBuilds } from './AdminBuilds';
import { AdminSystem } from './AdminSystem';
import { Button } from '../Button';

// Placeholder components for other admin sections to keep the file clean
const AdminClients = () => <div className="p-10 text-center text-zinc-500">Client List Module</div>;
const AdminSupport = () => <div className="p-10 text-center text-zinc-500">Support Ticket System Module</div>;
const AdminFinance = () => <div className="p-10 text-center text-zinc-500">Payments & Invoicing Module</div>;
const AdminSettings = () => <div className="p-10 text-center text-zinc-500">Admin Configuration Module</div>;

type AdminView = 'orders' | 'products' | 'builds' | 'clients' | 'support' | 'finance' | 'settings' | 'system';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('orders');

  const navItems = [
    { id: 'orders', label: 'Order Management', icon: <LayersIcon size={18} /> },
    { id: 'products', label: 'Products', icon: <ShoppingBagIcon size={18} /> },
    { id: 'builds', label: 'Portfolio Builds', icon: <LayoutIcon size={18} /> },
    { id: 'clients', label: 'Clients', icon: <UserIcon size={18} /> },
    { id: 'support', label: 'Support Tickets', icon: <MessageCircleIcon size={18} /> },
    { id: 'finance', label: 'Finance', icon: <CreditCardIcon size={18} /> },
    { id: 'system', label: 'System Architecture', icon: <DatabaseIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-zinc-800">
           <div className="flex items-center gap-2 mb-1">
             <div className="w-6 h-6 bg-brand-500 rounded-md"></div>
             <span className="font-bold text-white tracking-tight">Timace Admin</span>
           </div>
           <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">v2.0 Control</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
           {navItems.map(item => (
             <button
               key={item.id}
               onClick={() => setCurrentView(item.id as AdminView)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                 currentView === item.id 
                   ? 'bg-brand-900/20 text-brand-400 border border-brand-500/10' 
                   : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
               }`}
             >
               {item.icon}
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/10 transition-colors"
           >
             <LogOutIcon size={18} />
             Log Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
         <header className="px-8 py-5 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center flex-shrink-0">
            <h1 className="text-xl font-bold text-white capitalize">
              {navItems.find(n => n.id === currentView)?.label}
            </h1>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-zinc-400 font-mono">System Operational</span>
               </div>
               <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                 AD
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
            {currentView === 'orders' && <AdminOrders />}
            {currentView === 'products' && <AdminProducts />}
            {currentView === 'builds' && <AdminBuilds />}
            {currentView === 'clients' && <AdminClients />}
            {currentView === 'support' && <AdminSupport />}
            {currentView === 'finance' && <AdminFinance />}
            {currentView === 'system' && <AdminSystem />}
            {currentView === 'settings' && <AdminSettings />}
         </div>
      </main>
    </div>
  );
};