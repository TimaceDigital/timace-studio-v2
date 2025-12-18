import React from 'react';
import { EyeIcon, ZapIcon, MessageSquareIcon, LockIcon, XIcon, CheckIcon, ArrowRightIcon } from './Icons';
import { Button } from './Button';

export const Philosophy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950 relative overflow-hidden animate-fade-in">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-900/10 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
            
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-32">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-brand-400 text-xs font-mono uppercase tracking-widest mb-6">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                    System Override
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                    The Async <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-brand-600">Manifesto.</span>
                </h1>
                <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
                    We rejected the bloated agency model to build a system that respects your time, your budget, and your intelligence.
                </p>
            </div>

            {/* Principles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                {[
                    {
                        id: "01",
                        icon: <ZapIcon size={32} />,
                        title: "Speed is a System",
                        desc: "Delays are rarely technical; they are communicative. We delete meetings, onboarding calls, and email chains. We use Agentic AI to turn weeks into hours.",
                        color: "text-brand-400"
                    },
                    {
                        id: "02",
                        icon: <EyeIcon size={32} />,
                        title: "Human Vision, AI Hands",
                        desc: "AI is a power tool, not an artist. Our architects define the vision and structure. Then, we let our agents execute the code at superhuman speed.",
                        color: "text-purple-400"
                    },
                    {
                        id: "03",
                        icon: <MessageSquareIcon size={32} />,
                        title: "Zero Nonsense",
                        desc: "We don't gatekeep code. We don't lock features behind paywalls. We operate as an async productized studio because we value your independence.",
                        color: "text-blue-400"
                    },
                    {
                        id: "04",
                        icon: <LockIcon size={32} />,
                        title: "Radical Transparency",
                        desc: "Fixed pricing. No hidden fees. You track the build live in your dashboard. You see what we see. Trust is built through visibility.",
                        color: "text-amber-400"
                    }
                ].map((item, i) => (
                    <div key={i} className="group relative p-10 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 rounded-3xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <span className="text-8xl font-bold font-mono text-white">{item.id}</span>
                        </div>
                        <div className={`mb-6 ${item.color} bg-zinc-950/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                        <p className="text-zinc-400 leading-relaxed relative z-10 max-w-sm">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* Comparison Section */}
            <div className="max-w-5xl mx-auto mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">The Paradigm Shift</h2>
                    <p className="text-zinc-400">Why we built Timace Studio v2.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                    {/* Old Way */}
                    <div className="p-8 md:p-12 rounded-3xl bg-red-950/10 border border-red-900/30 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 border border-red-900/50 px-4 py-1 rounded-full text-red-500 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                            Traditional Agency
                        </div>
                        <ul className="space-y-6 pt-4">
                            {[
                                "Hourly billing (incentivized delay)",
                                "Endless discovery meetings",
                                "Code ownership gatekeeping",
                                "Opaque development process",
                                "Weeks to see a prototype"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-400">
                                    <XIcon className="text-red-500/50 shrink-0 mt-1" size={18} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* New Way */}
                    <div className="p-8 md:p-12 rounded-3xl bg-brand-950/10 border border-brand-900/30 relative mt-12 md:mt-0">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 border border-brand-500 px-4 py-1 rounded-full text-brand-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(20,184,166,0.3)] whitespace-nowrap">
                            Timace Studio v2
                        </div>
                        <ul className="space-y-6 pt-4">
                            {[
                                "Fixed pricing (incentivized speed)",
                                "Async communication only",
                                "100% Code ownership on Day 1",
                                "Live dashboard access",
                                "1 Hour to prototype"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-white">
                                    <CheckIcon className="text-brand-400 shrink-0 mt-1" size={18} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Final Quote/CTA */}
            <div className="max-w-4xl mx-auto text-center">
                <blockquote className="text-3xl md:text-5xl font-bold text-white leading-tight mb-12">
                    "We don't sell hours. <br/>
                    <span className="text-zinc-600">We sell output.</span>"
                </blockquote>
                
                <div className="flex justify-center">
                     <Button className="h-14 px-8 text-base">
                        Start Your Build <ArrowRightIcon className="ml-2" />
                     </Button>
                </div>
            </div>

        </div>
    </div>
  );
};