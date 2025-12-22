import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { fetchAllOrders, approveOrder, denyOrder, onOrderUpdate } from '../../services/adminService';
import { Button } from '../Button';
import { 
  LoaderIcon, FilterIcon, SearchIcon, ClockIcon, 
  CheckCircleIcon, XIcon, MessageSquareIcon, FileTextIcon, 
  ChevronDownIcon, UploadIcon, SettingsIcon, UserIcon, ShieldCheckIcon, ArrowRightIcon, RefreshCwIcon,
  ChevronRightIcon
} from '../Icons';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    setLoading(true);
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

  useEffect(() => {
    loadOrders();
    
    const unsubscribe = onOrderUpdate(() => {
       fetchAllOrders().then(data => {
         setOrders(data);
         setLastUpdated(new Date());
       });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedOrderId && orders.length > 0) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  const handleApproveOrder = async (id: string) => {
    await approveOrder(id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'approved' } : o));
  };

  const handleDenyOrder = async (id: string) => {
    await denyOrder(id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'denied' } : o));
  };

  const filteredOrders = orders
    .filter(order => filter === 'All' || order.status.toLowerCase() === filter.toLowerCase())
    .filter(order => 
       search === '' || 
       order.title.toLowerCase().includes(search.toLowerCase()) || 
       order.clientName?.toLowerCase().includes(search.toLowerCase()) ||
       order.id.includes(search)
    );

  if (loading && orders.length === 0) return <div className="flex justify-center p-20"><LoaderIcon className="animate-spin text-zinc-600" /></div>;

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Status Badge Helper
  const getStatusBadge = (status: string, type?: string) => {
    if (type === 'proposal') {
      return <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded text-purple-400 uppercase font-bold tracking-wide">Proposal</span>;
    }
    
    const colors: Record<string, string> = {
      'pending_approval': 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      'approved': 'bg-green-500/10 border-green-500/20 text-green-400',
      'denied': 'bg-red-500/10 border-red-500/20 text-red-400',
      'building': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      'completed': 'bg-zinc-700/50 border-zinc-600 text-zinc-300',
    };

    return (
      <span className={`text-[10px] border px-1.5 py-0.5 rounded uppercase font-bold tracking-wide ${colors[status] || 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Order List */}
      <div className="w-full md:w-1/3 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden max-h-[calc(100vh-140px)]">
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
             <input 
               type="text" 
               placeholder="Search orders..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors placeholder:text-zinc-600" 
             />
           </div>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'pending_approval', 'approved', 'building', 'review'].map(f => (
                 <button 
                   key={f} 
                   onClick={() => setFilter(f)}
                   className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${filter === f ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
                 >
                   {f === 'All' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                 </button>
              ))}
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {filteredOrders.length === 0 ? (
             <div className="p-8 text-center flex flex-col items-center justify-center h-40">
               <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                  <SearchIcon size={16} className="text-zinc-600" />
               </div>
               <p className="text-zinc-500 text-sm">No orders found.</p>
             </div>
           ) : (
             filteredOrders.map(order => (
               <div 
                 key={order.id} 
                 onClick={() => setSelectedOrderId(order.id)}
                 className={`p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-all group relative ${selectedOrder?.id === order.id ? 'bg-zinc-800/50 border-l-2 border-l-brand-500 pl-[14px]' : 'border-l-2 border-l-transparent pl-[14px]'}`}
               >
                 <div className="flex justify-between items-start mb-1.5">
                    <h4 className={`font-medium text-sm truncate max-w-[70%] ${selectedOrder?.id === order.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>{order.title}</h4>
                    {getStatusBadge(order.status, order.type)}
                 </div>
                 <div className="flex justify-between items-center text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                       <UserIcon size={10} />
                       <span className="truncate max-w-[100px]">{order.clientName || 'Unknown Client'}</span>
                    </div>
                    <span className="font-mono text-[10px] opacity-70">{new Date(order.createdAt).toLocaleDateString()}</span>
                 </div>
                 {selectedOrder?.id === order.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                       <ChevronRightIcon size={16} className="text-brand-500" />
                    </div>
                 )}
               </div>
             ))
           )}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden relative max-h-[calc(100vh-140px)]">
         {!selectedOrder ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
               <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                  <FileTextIcon size={32} className="opacity-20" />
               </div>
               <h3 className="text-lg font-medium text-zinc-300 mb-2">No Order Selected</h3>
               <p className="max-w-xs mx-auto">Select an order from the list to view details, manage status, and communicate with the client.</p>
            </div>
         ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex flex-col lg:flex-row justify-between items-start gap-4 shrink-0 z-10">
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white">{selectedOrder.title}</h2>
                      {selectedOrder.type === 'proposal' && (
                        <div className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">Proposal Request</div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400">
                       <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-500 select-all">ID: {selectedOrder.id}</span>
                       <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group">
                          <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-300">
                            <UserIcon size={10} />
                          </div>
                          {selectedOrder.clientName} 
                          <span className="text-zinc-600 text-xs">({selectedOrder.clientEmail})</span>
                       </span>
                       <span className="flex items-center gap-1.5">
                          <ClockIcon size={14} className="text-zinc-500" /> 
                          <span className="text-zinc-500">ETA:</span> 
                          <span className="text-zinc-300">{selectedOrder.eta || 'To Be Determined'}</span>
                       </span>
                    </div>
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="flex gap-2 self-end lg:self-start">
                    {selectedOrder.status === 'pending_approval' ? (
                       <>
                         <Button 
                           className="!py-2 !px-4 !text-xs bg-green-600/10 hover:bg-green-600/20 text-green-500 border border-green-600/30 hover:border-green-500/50" 
                           onClick={() => handleApproveOrder(selectedOrder.id)}
                           icon={<CheckCircleIcon size={14} />}
                         >
                           Approve Order
                         </Button>
                         <Button 
                           variant="outline" 
                           className="!py-2 !px-4 !text-xs text-red-400 hover:text-red-300 border-zinc-700 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30" 
                           onClick={() => handleDenyOrder(selectedOrder.id)}
                           icon={<XIcon size={14} />}
                         >
                           Deny
                         </Button>
                       </>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Current Status</div>
                        {getStatusBadge(selectedOrder.status, selectedOrder.type)}
                      </div>
                    )}
                    
                    {selectedOrder.type === 'proposal' && selectedOrder.status !== 'completed' && (
                       <Button className="!py-2 !px-4 !text-xs bg-purple-600 hover:bg-purple-500 border-none shadow-lg shadow-purple-900/20">
                         Generate Proposal
                       </Button>
                    )}
                 </div>
              </div>

              {/* Body Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
                    
                    {/* Left Col: Vision & Items */}
                    <div className="space-y-8">
                       
                       {/* Project Vision */}
                       <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800 relative group">
                          <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <FileTextIcon size={14} /> Project Vision & Notes
                          </h3>
                          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-zinc-700">
                             {selectedOrder.notes || "No additional notes provided by the client."}
                          </p>
                       </div>

                       {/* Order Items Configuration */}
                       <div>
                          <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <SettingsIcon size={14} /> Build Configuration
                          </h3>
                          <div className="space-y-4">
                             {selectedOrder.items?.map((item, idx) => {
                               const config = selectedOrder.configurations?.[idx] || {};
                               return (
                                 <div key={idx} className="bg-zinc-900/50 border border-zinc-800/60 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800/50">
                                       <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient || 'from-zinc-700 to-zinc-800'} flex items-center justify-center shrink-0 shadow-inner`}>
                                          <div className="scale-100 text-white">{item.icon || <SettingsIcon />}</div>
                                       </div>
                                       <div>
                                          <div className="text-white font-bold text-sm">{item.name}</div>
                                          <div className="text-zinc-500 text-xs">{item.category}</div>
                                       </div>
                                       <div className="ml-auto flex flex-col items-end">
                                          <div className="text-zinc-300 font-mono text-sm font-medium">
                                            {item.priceValue ? `€${item.priceValue.toLocaleString()}` : 'Custom'}
                                          </div>
                                          {item.priceValue ? (
                                            <div className="text-[10px] text-zinc-600">Base Price</div>
                                          ) : null}
                                       </div>
                                    </div>
                                    
                                    {/* Config Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                       {Object.entries(config).map(([key, value]) => (
                                          <div key={key} className="bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800/50 flex flex-col justify-between h-full">
                                             <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 tracking-wide">{key.replace(/_/g, ' ')}</div>
                                             <div className="text-zinc-300 text-xs font-medium">{value}</div>
                                          </div>
                                       ))}
                                       {Object.keys(config).length === 0 && (
                                          <div className="col-span-2 text-zinc-600 text-xs italic bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/30 border-dashed text-center">
                                            No custom configuration options selected.
                                          </div>
                                       )}
                                    </div>
                                 </div>
                               );
                             })}
                             {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                <div className="text-zinc-500 text-sm italic p-4 border border-dashed border-zinc-800 rounded-lg text-center">
                                  No items found in this order.
                                </div>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Right Col: Communication & Files */}
                    <div className="flex flex-col gap-6">
                       
                       {/* Chat Widget */}
                       <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden min-h-[400px] shadow-lg shadow-black/20">
                           <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center shrink-0">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Client Channel</span>
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                                {selectedOrder.clientEmail}
                              </span>
                           </div>
                           
                           <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
                              <div className="text-center my-4">
                                <span className="text-[10px] text-zinc-600 bg-zinc-900/80 px-2 py-1 rounded-full border border-zinc-800">
                                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {/* System Message - Start */}
                              <div className="flex justify-center my-4">
                                 <div className="bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 px-4 py-2 rounded-full text-xs flex items-center gap-2">
                                    <ShieldCheckIcon size={12} />
                                    <span>Secure channel established for Order #{selectedOrder.id}</span>
                                 </div>
                              </div>

                              {/* Mock Messages - In a real app, map through messages */}
                              <div className="flex justify-start">
                                 <div className="flex flex-col items-start gap-1 max-w-[85%]">
                                    <div className="flex items-center gap-2 ml-1">
                                       <span className="text-[10px] text-zinc-500 font-bold">{selectedOrder.clientName}</span>
                                       <span className="text-[10px] text-zinc-600">{new Date(selectedOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="bg-zinc-800 text-zinc-200 p-3 rounded-2xl rounded-tl-none text-sm border border-zinc-700/50 shadow-sm">
                                       <p>Hi there! I've just submitted my order. Looking forward to getting this started.</p>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex justify-end">
                                 <div className="flex flex-col items-end gap-1 max-w-[85%]">
                                    <div className="flex items-center gap-2 mr-1">
                                       <span className="text-[10px] text-zinc-600">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                       <span className="text-[10px] text-brand-400 font-bold">System</span>
                                    </div>
                                    <div className="bg-brand-500/10 text-brand-100 p-3 rounded-2xl rounded-tr-none text-sm border border-brand-500/20 shadow-sm">
                                       <p>Order received. Status: <span className="font-mono font-bold uppercase text-xs">{selectedOrder.status.replace('_', ' ')}</span></p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 shrink-0">
                              <div className="relative">
                                <input 
                                  type="text" 
                                  placeholder="Message client..." 
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all shadow-inner" 
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                                  <ArrowRightIcon size={16} />
                                </button>
                              </div>
                           </div>
                       </div>

                       {/* Files/Assets */}
                       <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800">
                          <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                               <FileTextIcon size={14} /> Deliverables & Files
                             </h3>
                             <button className="text-brand-400 text-xs flex items-center gap-1 hover:underline hover:text-brand-300 transition-colors">
                                <UploadIcon size={12} /> Upload New
                             </button>
                          </div>
                          <div className="space-y-2">
                             <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex justify-between items-center group cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/50 transition-all">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                                      <FileTextIcon size={16} />
                                   </div>
                                   <div>
                                      <div className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">contract_v1.pdf</div>
                                      <div className="text-[10px] text-zinc-600">2.4 MB • Uploaded by Admin</div>
                                   </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="text-zinc-500 hover:text-white"><ArrowRightIcon size={14} /></button>
                                </div>
                             </div>
                             
                             {/* Placeholder for empty state */}
                             {/* <div className="border border-dashed border-zinc-800 p-6 rounded-lg text-center flex flex-col items-center justify-center gap-2">
                                <UploadIcon size={20} className="text-zinc-700" />
                                <span className="text-zinc-600 text-xs">No deliverables uploaded yet.</span>
                             </div> */}
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