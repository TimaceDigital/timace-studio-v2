import React from 'react';
import { Button } from './Button';
import { ArrowRightIcon, ActivityIcon, MessageSquareIcon, FileTextIcon, LockIcon } from './Icons';

interface DashboardTeaserProps {
  onNavigate: () => void;
}

export const DashboardTeaser: React.FC<DashboardTeaserProps> = ({ onNavigate }) => {
  return (
    <section className="py-32 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-brand-900/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-brand-400 text-xs font-mono uppercase tracking-widest mb-8">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Live Client Portal
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Watch the engine run.<br />
              <span className="text-zinc-600">Zero black boxes.</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-8 font-light leading-relaxed">
              We don't hide behind account managers. You get a direct line to the build process. Track agentic execution, review code commits, and chat with architects in real-time.
            </p>
            
            <ul className="space-y-4 mb-10">
               {[
                 { icon: <ActivityIcon size={18} />, text: "Real-time build progress tracking" },
                 { icon: <MessageSquareIcon size={18} />, text: "Direct async channel to developers" },
                 { icon: <FileTextIcon size={18} />, text: "Instant asset & code delivery" },
                 { icon: <LockIcon size={18} />, text: "Secure, role-based access" }
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-500">
                      {item.icon}
                    </div>
                    {item.text}
                 </li>
               ))}
            </ul>

            <Button onClick={onNavigate} className="h-12 px-8">
               Enter Dashboard Demo <ArrowRightIcon className="ml-2" size={16} />
            </Button>
          </div>

          {/* Visual UI Simulation */}
          <div className="relative group perspective-1000">
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-brand-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             
             {/* Main Window */}
             <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transform group-hover:rotate-y-2 group-hover:rotate-x-2 transition-transform duration-700 ease-out">
                {/* Window Header */}
                <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                   <div className="ml-4 h-5 w-48 bg-zinc-800 rounded-md"></div>
                </div>
                
                {/* Window Body */}
                <div className="p-6 grid grid-cols-3 gap-6 h-[400px]">
                   {/* Sidebar */}
                   <div className="col-span-1 border-r border-zinc-800 pr-6 space-y-3">
                      <div className="h-8 w-full bg-zinc-800/50 rounded-lg"></div>
                      <div className="h-8 w-full bg-brand-500/10 border border-brand-500/20 rounded-lg"></div>
                      <div className="h-8 w-full bg-zinc-800/50 rounded-lg"></div>
                      <div className="h-8 w-full bg-zinc-800/50 rounded-lg"></div>
                      <div className="mt-8 h-32 w-full bg-zinc-900 rounded-xl border border-zinc-800 p-3">
                         <div className="w-8 h-8 rounded-full bg-zinc-800 mb-2"></div>
                         <div className="h-2 w-16 bg-zinc-800 rounded mb-1"></div>
                         <div className="h-2 w-10 bg-zinc-800 rounded"></div>
                      </div>
                   </div>
                   
                   {/* Main Area */}
                   <div className="col-span-2 space-y-6">
                      {/* Status Card */}
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                         <div className="flex justify-between items-center mb-4">
                            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                            <div className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-mono border border-amber-500/20">BUILDING</div>
                         </div>
                         <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-[65%] bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                         </div>
                      </div>

                      {/* Log Feed */}
                      <div className="space-y-3">
                         <div className="flex gap-3 items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="h-2 w-48 bg-zinc-800 rounded"></div>
                         </div>
                         <div className="flex gap-3 items-center opacity-70">
                            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                            <div className="h-2 w-32 bg-zinc-800 rounded"></div>
                         </div>
                         <div className="flex gap-3 items-center opacity-50">
                            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                            <div className="h-2 w-40 bg-zinc-800 rounded"></div>
                         </div>
                      </div>

                      {/* Chat Simulation */}
                      <div className="mt-auto pt-4 border-t border-zinc-800">
                         <div className="flex gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-brand-900 flex-shrink-0"></div>
                            <div className="p-3 bg-zinc-900 rounded-lg rounded-tl-none border border-zinc-800 text-xs text-zinc-400">
                               Deploying the database schema now.
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Floating Elements */}
             <div className="absolute -right-6 -bottom-6 bg-zinc-900 border border-zinc-700 p-4 rounded-xl shadow-xl animate-float">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                   <div className="text-xs font-mono text-zinc-300">Agentic Core Active</div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};