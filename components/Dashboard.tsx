import React, { useState, useEffect } from 'react';
import { 
  ActivityIcon, ClockIcon, FileTextIcon, CheckCircleIcon, LoaderIcon, 
  FolderIcon, MessageSquareIcon, SettingsIcon, LogOutIcon, 
  BellIcon, ChevronDownIcon, UploadIcon, DownloadIcon, RefreshCwIcon,
  PlusIcon, ArrowRightIcon, LayersIcon, UserIcon, CheckIcon, SearchIcon, FilterIcon,
  ZapIcon
} from './Icons';
import { Button } from './Button';
import { Order, Asset, Message, TimelineEvent, UserProfile, OrderStatus, Revision, ActivityLog, ProductItem } from '../types';
import { 
  fetchOrders, fetchAssets, fetchMessages, fetchTimeline, 
  fetchRevisions, fetchActivityLog, fetchUserProfile 
} from '../services/dashboardService';

type TabView = 'overview' | 'assets' | 'revisions' | 'messages' | 'history' | 'settings';

export const Dashboard: React.FC = () => {
  // Global Dashboard State
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
  // View State
  const [currentView, setCurrentView] = useState<TabView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Active Context Data
  const [activeAssets, setActiveAssets] = useState<Asset[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [activeTimeline, setActiveTimeline] = useState<TimelineEvent[]>([]);
  const [activeRevisions, setActiveRevisions] = useState<Revision[]>([]);
  const [activeActivityLog, setActiveActivityLog] = useState<ActivityLog[]>([]);
  
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const initDashboard = async () => {
      setIsLoading(true);
      try {
        const [orderData, user] = await Promise.all([
          fetchOrders(),
          fetchUserProfile()
        ]);
        setOrders(orderData);
        setUserProfile(user);
        if (orderData.length > 0) {
          setActiveOrderId(orderData[0].id);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initDashboard();
  }, []);

  // Fetch Context Data when Active Order Changes
  useEffect(() => {
    if (!activeOrderId) return;

    const loadContextData = async () => {
      setIsDataLoading(true);
      try {
        const [assets, messages, timeline, revisions, activity] = await Promise.all([
          fetchAssets(activeOrderId),
          fetchMessages(activeOrderId),
          fetchTimeline(activeOrderId),
          fetchRevisions(activeOrderId),
          fetchActivityLog(activeOrderId)
        ]);
        setActiveAssets(assets);
        setActiveMessages(messages);
        setActiveTimeline(timeline);
        setActiveRevisions(revisions);
        setActiveActivityLog(activity);
      } catch (error) {
        console.error("Failed to load context data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadContextData();
  }, [activeOrderId]);

  const handleCreateOrder = () => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      clientId: userProfile?.id || 'guest',
      title: 'New Project Build',
      status: 'queued',
      progress: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      unreadMessagesCount: 0,
      items: []
    };
    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCurrentView('overview');
  };

  const activeOrder = orders.find(o => o.id === activeOrderId);

  // --- Sub-Components for Views ---

  const OrderSelector = () => (
    <div className="relative group mb-8">
      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-3 block px-2">Current Workspace</label>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-zinc-900 hover:border-zinc-700 transition-all shadow-sm">
        {activeOrder ? (
           <div className="flex flex-col overflow-hidden">
             <span className="text-white font-bold text-sm truncate">{activeOrder.title}</span>
             <div className="flex flex-wrap gap-1 mt-1">
                {activeOrder.items?.map((item, idx) => (
                   <span key={idx} className="text-[9px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded border border-zinc-700/50 truncate max-w-[100px]">
                      {item.name}
                   </span>
                ))}
                {(!activeOrder.items || activeOrder.items.length === 0) && (
                   <span className="text-zinc-500 text-[10px] font-mono uppercase">ID: {activeOrder.id}</span>
                )}
             </div>
           </div>
        ) : (
           <span className="text-zinc-500 text-sm italic">No Active Orders</span>
        )}
        <ChevronDownIcon size={16} className="text-zinc-600" />
      </div>
      
      {/* Dropdown */}
      {orders.length > 1 && (
         <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hidden group-hover:block z-50 shadow-2xl backdrop-blur-xl">
           {orders.filter(o => o.id !== activeOrderId).map(order => (
             <div 
               key={order.id} 
               onClick={() => setActiveOrderId(order.id)}
               className="p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800/50 last:border-0 group/item"
             >
               <div className="text-zinc-300 text-sm group-hover/item:text-white transition-colors">{order.title}</div>
               <div className="text-zinc-600 text-[10px] font-mono uppercase flex gap-2 mt-1">
                 <span>{order.status}</span>
                 {order.items && order.items.length > 0 && <span>• {order.items.length} items</span>}
               </div>
             </div>
           ))}
         </div>
      )}
    </div>
  );

  const StatusBadge = ({ status }: { status?: OrderStatus }) => {
    if (!status) return null;
    const colors = {
      queued: 'bg-zinc-800 text-zinc-400 border-zinc-700',
      analyzing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      building: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
      review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      completed: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
      denied: 'bg-red-900/30 text-red-400 border-red-500/30'
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider border ${colors[status]} backdrop-blur-sm`}>
        {status}
      </span>
    );
  };

  const ProgressView = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Status Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
               {/* Background Grid */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Build Sequence</h3>
                        <p className="text-zinc-400 text-sm flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          Agentic Core Active
                        </p>
                     </div>
                     <div className="text-right">
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200 font-mono">
                          {activeOrder?.progress || 0}%
                        </div>
                        <div className="text-zinc-600 text-xs uppercase tracking-widest mt-1">Global Completion</div>
                     </div>
                  </div>
                  
                  {/* Visual Progress Track */}
                  <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden mb-12 border border-zinc-800">
                     <div 
                       className="h-full bg-brand-500 shadow-[0_0_20px_rgba(20,184,166,0.6)] relative overflow-hidden"
                       style={{ width: `${activeOrder?.progress || 0}%` }}
                     >
                       <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                     </div>
                  </div>

                  {/* Individual Workstreams */}
                  {activeOrder?.items && activeOrder.items.length > 0 && (
                     <div className="mb-12 space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Active Workstreams ({activeOrder.items.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {activeOrder.items.map((item, idx) => (
                              <div key={idx} className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl hover:border-zinc-700 transition-colors">
                                 <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${item.gradient || 'from-zinc-800 to-zinc-900'} flex items-center justify-center`}>
                                          <div className="scale-50 text-white">{item.icon || <SettingsIcon />}</div>
                                       </div>
                                       <span className="text-sm font-bold text-white truncate max-w-[120px]">{item.name}</span>
                                    </div>
                                    <StatusBadge status={activeOrder.status} />
                                 </div>
                                 <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <div 
                                       className={`h-full bg-brand-500/50`}
                                       style={{ width: `${activeOrder.progress || 0}%` }}
                                    ></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Timeline Events */}
                  <div className="space-y-0 relative">
                     {/* Vertical Connector Line */}
                     <div className="absolute left-[11px] top-3 bottom-6 w-px bg-zinc-800"></div>
                     
                     {activeTimeline.length === 0 ? (
                        <div className="text-center py-8">
                           <LoaderIcon className="mx-auto text-zinc-700 animate-spin mb-3" size={24} />
                           <p className="text-zinc-500 text-sm">Initializing Build Sequence...</p>
                           <p className="text-zinc-700 text-xs mt-2">Events will populate as agents execute.</p>
                        </div>
                     ) : (
                       activeTimeline.map((event, i) => (
                         <div key={event.id} className="relative pl-10 pb-8 last:pb-0 group/item">
                            {/* Node */}
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${
                              event.status === 'completed' ? 'bg-brand-500 border-brand-500 text-black scale-100 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 
                              event.status === 'current' ? 'bg-zinc-900 border-amber-500 text-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 
                              'bg-zinc-950 border-zinc-800 text-zinc-700 scale-90'
                            }`}>
                              {event.status === 'completed' && <CheckIcon size={14} strokeWidth={3} />}
                              {event.status === 'current' && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>}
                            </div>
                            
                            {/* Content */}
                            <div className={`transition-all duration-300 ${event.status === 'pending' ? 'opacity-40 blur-[0.5px] grayscale' : 'opacity-100'}`}>
                               <div className="flex justify-between items-start">
                                  <h4 className={`text-base font-bold ${event.status === 'current' ? 'text-amber-400' : 'text-zinc-200'}`}>
                                     {event.title}
                                  </h4>
                                  {event.timestamp && <span className="text-[10px] text-zinc-600 font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{event.timestamp}</span>}
                               </div>
                               <p className="text-zinc-400 text-sm mt-1 leading-relaxed max-w-lg">{event.description}</p>
                            </div>
                         </div>
                       ))
                     )}
                  </div>
               </div>
            </div>
          </div>

          {/* Quick Stats / Meta */}
          <div className="space-y-6">
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 h-full flex flex-col">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                   <ActivityIcon size={14} /> Project Meta
                </h3>
                <div className="space-y-4 flex-1">
                   <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                      <span className="text-zinc-400 text-sm">Order ID</span>
                      <span className="text-white font-mono text-xs bg-zinc-900 px-2 py-1 rounded border border-zinc-800">#{activeOrder?.id || '---'}</span>
                   </div>
                   <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                      <span className="text-zinc-400 text-sm">ETA</span>
                      <span className="text-brand-400 font-mono text-sm">{activeOrder?.eta || 'Calculating...'}</span>
                   </div>
                   <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                      <span className="text-zinc-400 text-sm">Created</span>
                      <span className="text-zinc-300 text-sm">{activeOrder?.createdAt || '---'}</span>
                   </div>
                   <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                      <span className="text-zinc-400 text-sm">Total Value</span>
                      <span className="text-white font-mono text-sm">€{activeOrder?.totalValue?.toLocaleString() || '0'}</span>
                   </div>
                </div>
                
                {/* Product Summary in Meta */}
                {activeOrder?.items && activeOrder.items.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-zinc-800">
                      <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Deliverables In Contract</h4>
                      <div className="space-y-2">
                         {activeOrder.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                               <CheckIcon size={12} className="text-brand-500" />
                               {item.name}
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                <div className="mt-6 pt-6 border-t border-zinc-800">
                   <Button fullWidth variant="secondary" className="!py-3 !text-xs !bg-zinc-800 hover:!bg-zinc-700 !border-zinc-700">
                     <RefreshCwIcon size={14} /> Refresh Status
                   </Button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const AssetsView = () => (
    <div className="animate-fade-in">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Project Assets</h3>
            <p className="text-zinc-400 text-sm">Files generated during the agentic build process.</p>
          </div>
          <Button variant="primary" className="!py-2 !px-4 !text-xs">
             <UploadIcon size={14} /> Upload File
          </Button>
       </div>

       {activeAssets.length === 0 ? (
          <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center group hover:border-zinc-700 transition-colors">
             <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-700 group-hover:text-zinc-500 transition-colors">
                <FolderIcon size={32} />
             </div>
             <h4 className="text-zinc-300 font-bold mb-2">No Assets Generated Yet</h4>
             <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
               As the agents complete tasks, code archives, design files, and documents will appear here automatically.
             </p>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {activeAssets.map(asset => (
                <div key={asset.id} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-brand-500/50 p-5 rounded-2xl flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                         asset.type === 'image' ? 'bg-purple-500/10 text-purple-400' :
                         asset.type === 'code' ? 'bg-blue-500/10 text-blue-400' :
                         'bg-zinc-800 text-zinc-400'
                      }`}>
                         <FileTextIcon size={24} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 uppercase">{asset.type}</span>
                   </div>
                   
                   <div className="mt-auto">
                      <h4 className="text-white text-sm font-bold truncate mb-1" title={asset.name}>{asset.name}</h4>
                      <p className="text-zinc-500 text-xs mb-4">{asset.size} • {asset.uploadedAt}</p>
                      
                      <button className="w-full py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs font-medium hover:text-white hover:border-zinc-700 transition-colors flex items-center justify-center gap-2">
                         <DownloadIcon size={14} /> Download
                      </button>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );

  const MessagesView = () => (
    <div className="h-[700px] flex flex-col bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden animate-fade-in shadow-2xl">
       {/* Chat Header */}
       <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex justify-between items-center">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="font-bold text-white">Project Uplink</span>
             </div>
             <p className="text-xs text-zinc-500">Secure channel with Architects & Admins</p>
          </div>
          <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400" title="You">ME</div>
             <div className="w-8 h-8 rounded-full bg-brand-900 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-brand-400" title="System">SYS</div>
          </div>
       </div>

       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {activeMessages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-60">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                   <MessageSquareIcon size={24} className="text-zinc-500" />
                </div>
                <p className="text-zinc-400 font-medium">No messages yet</p>
                <p className="text-zinc-600 text-sm mt-1">Start the conversation with your lead architect.</p>
             </div>
          ) : (
             activeMessages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'} animate-fade-in-up`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-lg ${
                      msg.isAdmin 
                        ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-300 border border-zinc-700' 
                        : 'bg-gradient-to-br from-brand-500 to-brand-600 text-black border border-brand-400'
                   }`}>
                      {msg.isAdmin ? 'AD' : 'ME'}
                   </div>
                   <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      msg.isAdmin 
                        ? 'bg-zinc-800/80 text-zinc-200 rounded-tl-none border border-zinc-700' 
                        : 'bg-brand-600/90 text-white rounded-tr-none border border-brand-500/50'
                   }`}>
                      {msg.content}
                      <div className={`text-[10px] mt-2 opacity-50 font-mono uppercase ${msg.isAdmin ? 'text-left' : 'text-right'}`}>
                         {msg.timestamp}
                      </div>
                   </div>
                </div>
             ))
          )}
       </div>

       {/* Input Area */}
       <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
          <div className="relative">
             <input 
                type="text" 
                placeholder="Type your message..." 
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl py-4 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all placeholder-zinc-600 shadow-inner"
                disabled={!activeOrderId}
             />
             <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-500 rounded-lg text-black hover:bg-brand-400 transition-colors disabled:opacity-50 hover:shadow-lg shadow-brand-500/20"
                disabled={!activeOrderId}
             >
                <ArrowRightIcon size={18} />
             </button>
          </div>
       </div>
    </div>
  );

  const RevisionsView = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Revisions</h3>
            <p className="text-zinc-500 text-sm">Review deliverables and request changes.</p>
          </div>
       </div>

       {activeRevisions.length === 0 ? (
          <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center group hover:border-zinc-700 transition-colors">
             <LayersIcon size={40} className="mx-auto text-zinc-700 mb-4 group-hover:text-zinc-500 transition-colors" />
             <h4 className="text-zinc-400 font-bold mb-2">No Revisions Yet</h4>
             <p className="text-zinc-600 text-sm max-w-sm mx-auto">
               Once we hit a milestone, you will receive revision rounds here to approve or critique.
             </p>
          </div>
       ) : (
          <div className="space-y-6">
            {activeRevisions.map((rev) => (
              <div key={rev.id} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-bold text-lg">{rev.name}</h4>
                        <span className={`text-[10px] px-2.5 py-1 rounded font-mono uppercase tracking-wide font-bold ${
                          rev.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                          rev.status === 'awaiting_review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' : 
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {rev.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs">Delivered: {rev.deliveryDate}</p>
                   </div>
                   <Button variant="outline" className="!py-2 !px-4 !text-xs">
                     View Details
                   </Button>
                </div>
                
                <div className="bg-zinc-950/50 rounded-2xl p-5 border border-zinc-800/50 mb-6">
                  <h5 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Deliverables</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rev.items.map(item => (
                       <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group cursor-pointer">
                          <span className="text-zinc-300 text-sm flex items-center gap-3">
                            <FileTextIcon size={16} className="text-zinc-600 group-hover:text-brand-400 transition-colors" /> {item.name}
                          </span>
                          <DownloadIcon size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                       </div>
                    ))}
                  </div>
                </div>

                {rev.status === 'awaiting_review' && (
                  <div className="flex gap-4">
                     <Button className="flex-1 bg-green-600 hover:bg-green-500 border-none text-white shadow-lg shadow-green-900/20">
                        <CheckIcon size={16} /> Approve Revision
                     </Button>
                     <Button variant="secondary" className="flex-1 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white">
                        <MessageSquareIcon size={16} /> Request Changes
                     </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
       )}
    </div>
  );

  const HistoryView = () => (
    <div className="animate-fade-in">
       <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-white">Activity Log</h3>
          <Button variant="outline" className="!py-2 !px-4 !text-xs">
             <DownloadIcon size={14} /> Export CSV
          </Button>
       </div>

       <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          {activeActivityLog.length === 0 ? (
            <div className="p-16 text-center text-zinc-500">
               <ClockIcon size={40} className="mx-auto mb-4 opacity-20" />
               <p className="text-sm font-medium">No activity recorded for this order yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/80 text-zinc-500 font-bold uppercase text-xs tracking-wider border-b border-zinc-800">
                <tr>
                   <th className="px-6 py-5">Action</th>
                   <th className="px-6 py-5">User</th>
                   <th className="px-6 py-5">Date</th>
                   <th className="px-6 py-5">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                 {activeActivityLog.map(log => (
                   <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-6 py-4 text-white font-medium group-hover:text-brand-300 transition-colors">{log.action}</td>
                      <td className="px-6 py-4 text-zinc-400">
                         <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shadow-inner ${
                              log.actorRole === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              log.actorRole === 'system' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                              'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            }`}>
                              {log.actorRole[0].toUpperCase()}
                            </div>
                            {log.actorName}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{log.timestamp}</td>
                      <td className="px-6 py-4 text-zinc-600 font-mono text-xs truncate max-w-[200px]">
                         {log.metadata ? JSON.stringify(log.metadata) : '-'}
                      </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          )}
       </div>
    </div>
  );

  const SettingsView = () => (
     <div className="animate-fade-in max-w-4xl">
        <h3 className="text-2xl font-bold text-white mb-8">Workspace Settings</h3>
        
        <div className="space-y-8">
           {/* Profile Section */}
           <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
              <h4 className="text-white font-bold mb-6 flex items-center gap-3 text-lg">
                 <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400"><UserIcon size={20} /></div> User Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-zinc-500 text-xs uppercase font-bold mb-3 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={userProfile?.name || "Client User"} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors"
                    />
                 </div>
                 <div>
                    <label className="block text-zinc-500 text-xs uppercase font-bold mb-3 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={userProfile?.email || "client@example.com"} 
                      disabled
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-500 cursor-not-allowed opacity-70"
                    />
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-zinc-500 text-xs uppercase font-bold mb-3 ml-1">Company / Organization</label>
                    <input 
                      type="text" 
                      placeholder="Optional"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors"
                    />
                 </div>
              </div>
              <div className="mt-8 flex justify-end pt-6 border-t border-zinc-800/50">
                 <Button>Save Changes</Button>
              </div>
           </div>

           {/* Notifications */}
           <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
              <h4 className="text-white font-bold mb-6 flex items-center gap-3 text-lg">
                 <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400"><BellIcon size={20} /></div> Notifications
              </h4>
              <div className="space-y-4">
                 <label className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/50 hover:bg-zinc-900 cursor-pointer transition-colors group">
                    <div>
                       <div className="text-white font-medium text-sm group-hover:text-brand-300 transition-colors">Email Alerts</div>
                       <div className="text-zinc-500 text-xs mt-1">Receive updates on build progress and new messages.</div>
                    </div>
                    <div className="w-12 h-6 bg-brand-500/20 rounded-full relative transition-colors group-hover:bg-brand-500/30">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-brand-500 rounded-full shadow-lg"></div>
                    </div>
                 </label>
                 <label className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/50 hover:bg-zinc-900 cursor-pointer transition-colors group">
                    <div>
                       <div className="text-white font-medium text-sm group-hover:text-brand-300 transition-colors">Slack Integration</div>
                       <div className="text-zinc-500 text-xs mt-1">Connect your workspace to a Slack channel.</div>
                    </div>
                    <div className="w-12 h-6 bg-zinc-800 rounded-full relative">
                       <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-500 rounded-full shadow-lg"></div>
                    </div>
                 </label>
              </div>
           </div>
        </div>
     </div>
  );

  // --- Main Render ---

  if (isLoading) {
    return (
       <div className="min-h-screen bg-zinc-950 pt-32 flex flex-col items-center justify-center">
          <LoaderIcon className="animate-spin text-brand-500 mb-6" size={48} />
          <p className="text-zinc-400 font-bold text-sm tracking-widest uppercase animate-pulse">Establishing Secure Uplink...</p>
          <p className="text-zinc-600 text-xs mt-2 font-mono">Handshaking with Agentic Core</p>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-40 pb-12 flex flex-col">
       <div className="container mx-auto px-6 flex-1 flex flex-col md:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className={`w-full md:w-72 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'hidden'}`}>
             
             <OrderSelector />

             <nav className="space-y-2 mb-10">
                {[
                  { id: 'overview', icon: <ActivityIcon size={18} />, label: 'Overview' },
                  { id: 'assets', icon: <FolderIcon size={18} />, label: 'Assets & Files' },
                  { id: 'revisions', icon: <LayersIcon size={18} />, label: 'Revisions' },
                  { id: 'messages', icon: <MessageSquareIcon size={18} />, label: 'Collaboration' },
                  { id: 'history', icon: <ClockIcon size={18} />, label: 'History log' },
                  { id: 'settings', icon: <SettingsIcon size={18} />, label: 'Settings' }
                ].map(item => (
                   <button
                     key={item.id}
                     onClick={() => setCurrentView(item.id as TabView)}
                     disabled={!activeOrderId && item.id !== 'settings'}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden group ${
                        currentView === item.id 
                           ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 text-white shadow-lg border border-zinc-700/50' 
                           : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                     } ${!activeOrderId && item.id !== 'settings' ? 'opacity-40 cursor-not-allowed' : ''}`}
                   >
                      {/* Active Indicator Bar */}
                      {currentView === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500"></div>}
                      
                      <span className={`relative z-10 transition-transform duration-300 ${currentView === item.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {item.icon}
                      </span>
                      <span className={`relative z-10 transition-transform duration-300 ${currentView === item.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {item.label}
                      </span>
                      
                      {item.id === 'messages' && activeOrder?.unreadMessagesCount ? (
                         <span className="ml-auto bg-brand-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.4)]">
                            {activeOrder.unreadMessagesCount}
                         </span>
                      ) : null}
                   </button>
                ))}
             </nav>

             <div className="mt-auto pt-8 border-t border-zinc-900">
                <div className="flex items-center gap-4 px-2 py-2 rounded-xl hover:bg-zinc-900/30 transition-colors cursor-pointer group">
                   {userProfile?.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-zinc-800 group-hover:border-brand-500 transition-colors" />
                   ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                         {userProfile?.name?.charAt(0) || 'U'}
                      </div>
                   )}
                   <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate group-hover:text-brand-400 transition-colors">{userProfile?.name || 'Guest User'}</div>
                      <div className="text-xs text-zinc-600 truncate">{userProfile?.email || 'Login required'}</div>
                   </div>
                   <button className="text-zinc-600 hover:text-red-400 p-2">
                      <LogOutIcon size={16} />
                   </button>
                </div>
             </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
             
             {/* Main Header */}
             <div className="flex justify-between items-start mb-10 pb-6 border-b border-zinc-900">
                <div>
                   <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                         {activeOrder ? activeOrder.title : 'Welcome to Timace Workspace'}
                      </h1>
                      {activeOrder && <StatusBadge status={activeOrder.status} />}
                   </div>
                   <p className="text-zinc-400 text-sm">
                      {activeOrder 
                        ? 'Project ID: ' + activeOrder.id 
                        : 'Select an order from the sidebar to manage your project.'}
                   </p>
                </div>
                
                <div className="flex items-center gap-4">
                   <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all relative">
                      <BellIcon size={20} />
                      <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-900 shadow"></span>
                   </button>
                   {!activeOrder && (
                      <Button onClick={handleCreateOrder} className="!py-2.5 !px-5 !text-xs shadow-lg shadow-brand-500/10">
                         <PlusIcon size={16} /> New Order
                      </Button>
                   )}
                </div>
             </div>

             {/* Dynamic Content */}
             {!activeOrder && currentView !== 'settings' ? (
                <div className="py-32 text-center border-2 border-dashed border-zinc-900 rounded-[2rem] bg-zinc-900/10 hover:bg-zinc-900/20 transition-colors">
                   <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                     <FolderIcon size={48} className="text-zinc-700" />
                   </div>
                   <h2 className="text-2xl font-bold text-white mb-2">No Active Context</h2>
                   <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
                      You don't have any active orders selected. Create a new order to initialize the Agentic Build System.
                   </p>
                   <Button onClick={handleCreateOrder} className="h-12 px-8">Start New Project</Button>
                </div>
             ) : (
                <div className="animate-fade-in-up">
                   {isDataLoading ? (
                      <div className="py-40 flex flex-col items-center justify-center">
                         <LoaderIcon className="animate-spin text-zinc-600 mb-4" size={32} />
                         <span className="text-zinc-600 text-xs font-mono">Retrieving Context...</span>
                      </div>
                   ) : (
                      <>
                         {currentView === 'overview' && <ProgressView />}
                         {currentView === 'assets' && <AssetsView />}
                         {currentView === 'revisions' && <RevisionsView />}
                         {currentView === 'messages' && <MessagesView />}
                         {currentView === 'history' && <HistoryView />}
                         {currentView === 'settings' && <SettingsView />}
                      </>
                   )}
                </div>
             )}
          </main>

       </div>
    </div>
  );
};