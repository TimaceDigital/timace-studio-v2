import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { fetchAllOrders, updateOrderStatus, onOrderUpdate } from '../../services/adminService';
import { Button } from '../Button';
import { 
  LoaderIcon, FilterIcon, SearchIcon, ClockIcon, 
  CheckCircleIcon, XIcon, MessageSquareIcon, FileTextIcon, 
  ChevronDownIcon, UploadIcon, SettingsIcon, UserIcon, ShieldCheckIcon, ArrowRightIcon, RefreshCwIcon
} from '../Icons';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadOrders = async () => {
    setLoading(true); // Show loading state on manual refresh or initial load
    try {
      const data = await fetchAllOrders();
      setOrders(data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersSilent = async () => {
    // Background update without full loading spinner
    try {
      const data = await fetchAllOrders();
      setOrders(data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch orders silently", e);
    }
  };

  // Initial load and Subscription
  useEffect(() => {
    loadOrders();
    
    // Subscribe to real-time updates (simulated DB or localStorage events)
    const unsubscribe = onOrderUpdate(() => {
      loadOrdersSilent();
    });

    return () => unsubscribe();
  }, []);

  // Auto-select first order if none selected
  useEffect(() => {
    if (!selectedOrderId && orders.length > 0) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    await updateOrderStatus(id, newStatus);
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  if (loading && orders.length === 0) return <div className="flex justify-center p-20"><LoaderIcon className="animate-spin text-zinc-600" /></div>;

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Order List */}
      <div className="w-full md:w-1/3 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
           <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2" title="Real-time connection active">
               <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`}></div>
               <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Live</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] text-zinc-600 font-mono hidden xl:block">
                 {lastUpdated.toLocaleTimeString()}
               </span>
               <button 
                 onClick={loadOrders} 
                 disabled={loading}
                 className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                 title="Refresh Orders"
               >
                 <RefreshCwIcon size={14} className={loading ? "animate-spin" : ""} />
               </button>
             </div>
           </div>
           <div className="relative mb-4">
             <SearchIcon className="absolute left-3 top-2.5 text-zinc-500" size={16} />
             <input type="text" placeholder="Search orders..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500/50" />
           </div>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Queued', 'Proposal', 'Building', 'Review'].map(filter => (
                 <button key={filter} className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs hover:text-white whitespace-nowrap">
                   {filter}
                 </button>
              ))}
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
           {orders.length === 0 ? (
             <div className="p-8 text-center text-zinc-500 text-sm">No orders found.</div>
           ) : (
             orders.map(order => (
               <div 
                 key={order.id} 
                 onClick={() => setSelectedOrderId(order.id)}
                 className={`p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-colors ${selectedOrder?.id === order.id ? 'bg-zinc-800/50 border-l-2 border-l-brand-500' : ''}`}
               >
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium text-sm truncate max-w-[70%]">{order.title}</h4>
                    {order.type === 'proposal' && (
                       <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded text-purple-400 uppercase font-bold tracking-wide">Proposal</span>
                    )}
                    {order.type !== 'proposal' && (
                       <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 uppercase">{order.status}</span>
                    )}
                 </div>
                 <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span>{order.clientName || order.clientId}</span>
                    <span>{order.createdAt}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden relative">
         {!selectedOrder ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
               <FileTextIcon size={48} className="mb-4 opacity-20" />
               <p>Select an order to view details</p>
            </div>
         ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row justify-between items-start gap-4">
                 <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{selectedOrder.title}</h2>
                      {selectedOrder.type === 'proposal' && (
                        <div className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">Proposal Request</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                       <span className="font-mono">#{selectedOrder.id}</span>
                       <span className="flex items-center gap-1"><UserIcon size={14} /> {selectedOrder.clientName} ({selectedOrder.clientEmail})</span>
                       <span className="flex items-center gap-1"><ClockIcon size={14} /> ETA: {selectedOrder.eta || 'TBD'}</span>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {selectedOrder.status === 'queued' && (
                       <>
                         <Button className="!py-2 !px-4 !text-xs bg-green-600 hover:bg-green-500 border-none" onClick={() => handleStatusUpdate(selectedOrder.id, 'analyzing')}>
                           Accept Order
                         </Button>
                         <Button variant="outline" className="!py-2 !px-4 !text-xs text-red-400 hover:text-red-300 border-zinc-700" onClick={() => handleStatusUpdate(selectedOrder.id, 'denied')}>
                           Deny
                         </Button>
                       </>
                    )}
                    {selectedOrder.type === 'proposal' && selectedOrder.status !== 'completed' && (
                       <Button className="!py-2 !px-4 !text-xs bg-purple-600 hover:bg-purple-500 border-none">
                         Generate & Send Proposal
                       </Button>
                    )}
                    <div className="relative group">
                       <Button variant="secondary" className="!py-2 !px-4 !text-xs flex items-center gap-2">
                         {selectedOrder.status.toUpperCase()} <ChevronDownIcon size={14} />
                       </Button>
                       {/* Status Dropdown */}
                       <div className="absolute right-0 top-full mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hidden group-hover:block z-50 shadow-xl">
                          {['queued', 'analyzing', 'building', 'review', 'completed', 'cancelled'].map((s) => (
                             <button 
                                key={s}
                                onClick={() => handleStatusUpdate(selectedOrder.id, s as OrderStatus)}
                                className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 capitalize"
                             >
                                {s}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left Col: Vision & Items */}
                    <div className="space-y-8">
                       
                       {/* Project Vision */}
                       <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800">
                          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <FileTextIcon size={14} /> Project Vision & Notes
                          </h3>
                          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                             {selectedOrder.notes || "No additional notes provided."}
                          </p>
                       </div>

                       {/* Order Items Configuration */}
                       <div>
                          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <SettingsIcon size={14} /> Build Configuration
                          </h3>
                          <div className="space-y-4">
                             {selectedOrder.items?.map((item, idx) => {
                               const config = selectedOrder.configurations?.[idx] || {};
                               return (
                                 <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800/50">
                                       <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient || 'from-zinc-700 to-zinc-800'} flex items-center justify-center shrink-0`}>
                                          <div className="scale-75 text-white">{item.icon || <SettingsIcon />}</div>
                                       </div>
                                       <div>
                                          <div className="text-white font-bold text-sm">{item.name}</div>
                                          <div className="text-zinc-500 text-xs">{item.category}</div>
                                       </div>
                                       <div className="ml-auto text-zinc-400 font-mono text-sm">
                                          {item.priceValue ? `€${item.priceValue.toLocaleString()}` : 'Custom'}
                                       </div>
                                    </div>
                                    
                                    {/* Config Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                       {Object.entries(config).map(([key, value]) => (
                                          <div key={key} className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/50">
                                             <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">{key.replace(/_/g, ' ')}</div>
                                             <div className="text-zinc-300 text-xs">{value}</div>
                                          </div>
                                       ))}
                                       {Object.keys(config).length === 0 && (
                                          <div className="col-span-2 text-zinc-600 text-xs italic">No custom configuration selected.</div>
                                       )}
                                    </div>
                                 </div>
                               );
                             })}
                             {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                <div className="text-zinc-500 text-sm italic">No items found in this order.</div>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Right Col: Communication & Files */}
                    <div className="flex flex-col gap-6">
                       
                       {/* Files/Assets */}
                       <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800">
                          <div className="flex justify-between items-center mb-4">
                             <h3 className="text-sm font-bold text-white uppercase tracking-wider">Deliverables</h3>
                             <button className="text-brand-400 text-xs flex items-center gap-1 hover:underline">
                                <UploadIcon size={12} /> Upload
                             </button>
                          </div>
                          <div className="space-y-2">
                             <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex justify-between items-center group cursor-pointer hover:border-zinc-700">
                                <span className="text-zinc-300 text-sm flex items-center gap-2">
                                   <FileTextIcon size={16} className="text-zinc-600 group-hover:text-brand-400" /> contract_v1.pdf
                                </span>
                                <span className="text-zinc-500 text-xs">Admin Upload</span>
                             </div>
                             {/* Placeholder for empty state */}
                             <div className="border border-dashed border-zinc-800 p-4 rounded-lg text-center">
                                <span className="text-zinc-600 text-xs">No deliverables uploaded yet.</span>
                             </div>
                          </div>
                       </div>

                       {/* Chat Widget */}
                       <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden min-h-[400px]">
                           <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <MessageSquareIcon size={14} className="text-zinc-400" />
                                <span className="text-xs font-bold text-white uppercase">Client Channel</span>
                              </div>
                              <span className="text-[10px] text-zinc-500">{selectedOrder.clientEmail}</span>
                           </div>
                           
                           <div className="flex-1 p-4 overflow-y-auto space-y-4">
                              {/* Mock Messages */}
                              <div className="flex justify-start">
                                 <div className="bg-zinc-800 text-zinc-300 p-3 rounded-xl rounded-tl-none text-sm max-w-[85%]">
                                    <div className="text-[10px] text-zinc-500 mb-1 font-bold">{selectedOrder.clientName}</div>
                                    System Notification: Order {selectedOrder.status}.
                                 </div>
                              </div>
                           </div>
                           
                           <div className="p-3 border-t border-zinc-800">
                              <div className="relative">
                                <input type="text" placeholder="Message client..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500/50 focus:outline-none pr-10" />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                                  <ArrowRightIcon size={14} />
                                </button>
                              </div>
                           </div>
                       </div>

                    </div>
                 </div>
              </div>
            </>
         )}
      </div>
    </div>
  );
};