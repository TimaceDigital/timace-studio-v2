import React from 'react';
import { ArrowRightIcon, ActivityIcon, MessageSquareIcon, GitBranchIcon, DatabaseIcon } from './Icons';
import { Button } from './Button';

interface PossibilitiesTeaserProps {
  onNavigate: () => void;
}

export const PossibilitiesTeaser: React.FC<PossibilitiesTeaserProps> = ({ onNavigate }) => {
  return (
    <section className="py-32 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-brand-400 text-xs font-mono uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            Limitless Execution
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
           If you can describe it,<br />
           <span className="text-zinc-600">we can build it.</span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
           We build custom websites, apps, tools, and internal systems using agentic execution and human-led design. No platform lock-in. No artificial limits.
        </p>

        {/* Visual Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 px-4">
            
            {/* Card 1: SaaS / Data */}
            <div className="group relative bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-900/60 transition-all duration-500 hover:border-zinc-700 overflow-hidden text-left h-72 flex flex-col shadow-lg">
                <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <ActivityIcon size={120} />
                </div>
                <div className="mb-auto relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                        <ActivityIcon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">SaaS Dashboards</h3>
                    <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Real-time analytics, user management, and subscription flows.</p>
                </div>
                {/* Abstract UI representation */}
                <div className="mt-6 border border-zinc-800 bg-zinc-950/50 rounded-lg p-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500 shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                        <div className="h-2 w-16 bg-zinc-800 rounded-full"></div>
                        <div className="h-2 w-8 bg-zinc-800 rounded-full"></div>
                    </div>
                    <div className="flex gap-2 items-end h-20 pl-1 pb-1 border-l border-b border-zinc-800">
                        <div className="w-1/5 bg-zinc-800 rounded-t-sm h-[40%] group-hover:bg-blue-900/40 transition-colors delay-75"></div>
                        <div className="w-1/5 bg-zinc-800 rounded-t-sm h-[70%] group-hover:bg-blue-900/60 transition-colors delay-100"></div>
                        <div className="w-1/5 bg-zinc-800 rounded-t-sm h-[50%] group-hover:bg-blue-800 transition-colors delay-150"></div>
                        <div className="w-1/5 bg-zinc-800 rounded-t-sm h-[90%] group-hover:bg-blue-600 transition-colors delay-200"></div>
                        <div className="w-1/5 bg-zinc-800 rounded-t-sm h-[60%] group-hover:bg-blue-500 transition-colors delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Card 2: AI / Chat (Center Feature) */}
            <div className="group relative bg-zinc-900/60 border border-zinc-700 rounded-3xl p-6 hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden text-left h-72 flex flex-col md:-mt-6 md:mb-6 shadow-2xl shadow-brand-900/20 z-10">
                 <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <MessageSquareIcon size={120} />
                </div>
                <div className="mb-auto relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4 border border-brand-500/20 group-hover:scale-110 transition-transform duration-500">
                        <MessageSquareIcon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">AI Agents</h3>
                    <p className="text-zinc-500 text-sm mt-1 leading-relaxed">LLM integrations, RAG pipelines, and conversational interfaces.</p>
                </div>
                {/* Abstract UI representation */}
                <div className="mt-6 border border-zinc-800 bg-zinc-950/50 rounded-lg p-3 opacity-80 group-hover:opacity-100 transition-opacity duration-500 shadow-inner flex flex-col justify-end space-y-3">
                    <div className="flex justify-start">
                        <div className="bg-zinc-800 rounded-lg rounded-tl-none px-3 py-2 w-3/4 h-8 flex items-center">
                            <div className="h-1.5 w-full bg-zinc-700 rounded-full opacity-50"></div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-brand-900/30 border border-brand-500/10 rounded-lg rounded-tr-none px-3 py-2 w-2/3 h-8 flex items-center">
                            <div className="h-1.5 w-full bg-brand-500/50 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex justify-start">
                         <div className="bg-zinc-800 rounded-lg rounded-tl-none px-3 py-2 w-1/4 h-8 flex items-center justify-center gap-1">
                            <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Card 3: Internal Tools */}
             <div className="group relative bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-900/60 transition-all duration-500 hover:border-zinc-700 overflow-hidden text-left h-72 flex flex-col shadow-lg">
                 <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <DatabaseIcon size={120} />
                </div>
                <div className="mb-auto relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                        <GitBranchIcon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Internal Tools</h3>
                    <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Admin panels, CRMs, and automated workflow systems.</p>
                </div>
                {/* Abstract UI representation */}
                <div className="mt-6 border border-zinc-800 bg-zinc-950/50 rounded-lg p-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500 shadow-inner space-y-2">
                     <div className="flex gap-2 mb-3">
                        <div className="w-8 h-8 rounded bg-zinc-800"></div>
                        <div className="flex-1 space-y-1.5 py-1">
                            <div className="h-1.5 w-full bg-zinc-800 rounded"></div>
                            <div className="h-1.5 w-2/3 bg-zinc-800 rounded"></div>
                        </div>
                     </div>
                     <div className="h-px w-full bg-zinc-800/50 my-1"></div>
                     <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <div className="h-1.5 w-3/4 bg-zinc-800 rounded"></div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                            <div className="h-1.5 w-1/2 bg-zinc-800 rounded"></div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                            <div className="h-1.5 w-2/3 bg-zinc-800 rounded"></div>
                        </div>
                     </div>
                </div>
            </div>

        </div>

        <div className="flex justify-center">
             <Button variant="outline" onClick={onNavigate} className="h-12 px-8 group bg-zinc-900/50 backdrop-blur-sm border-zinc-700 hover:border-brand-500/50 hover:bg-zinc-900">
                Explore All Capabilities <ArrowRightIcon className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
             </Button>
        </div>
      </div>
    </section>
  );
};