import React from 'react';
import { CheckIcon, CreditCardIcon, ShieldCheckIcon, LockIcon } from './Icons';
import { Button } from './Button';

export const Pricing: React.FC = () => {
  return (
    <div className="pt-48 pb-16 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Transparent Pricing</h1>
          <p className="text-zinc-400 text-lg">
            No hidden fees. No hourly billing surprises. You pay for the output, not the hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          
          {/* Card 1: Standard */}
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors relative">
             <div className="absolute -top-4 left-8 bg-zinc-800 text-white text-xs font-mono uppercase px-3 py-1 rounded-full border border-zinc-700">
               Most Common
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Standard Build</h3>
             <p className="text-zinc-500 text-sm mb-6">For MVPs, Landing Pages, and Tools</p>
             <div className="text-4xl font-bold text-white mb-1"><span className="text-zinc-500 text-2xl font-normal">&lt;</span> €2,000</div>
             <p className="text-zinc-500 text-xs mb-8">Estimated starting price</p>

             <div className="space-y-4 mb-8">
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-brand-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>50% Upfront, 50% on Delivery</span>
               </div>
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-brand-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>1-Hour Prototype Delivery</span>
               </div>
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-brand-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>3 Rounds of Revisions</span>
               </div>
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-brand-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>Full Source Code Ownership</span>
               </div>
             </div>
             <Button fullWidth>Start Project</Button>
          </div>

          {/* Card 2: Enterprise */}
          <div className="p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800 hover:border-zinc-700 transition-colors">
             <h3 className="text-2xl font-bold text-white mb-2">Complex Systems</h3>
             <p className="text-zinc-500 text-sm mb-6">For SaaS Platforms & Large Scale Apps</p>
             <div className="text-4xl font-bold text-white mb-1">Custom</div>
             <p className="text-zinc-500 text-xs mb-8">Fixed price proposal</p>

             <div className="space-y-4 mb-8">
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-purple-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>3-Step Milestone Payments</span>
               </div>
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-purple-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>Deep Agentic Architecture</span>
               </div>
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-purple-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>Dedicated Support Channel</span>
               </div>
               <div className="flex items-start gap-3 text-sm text-zinc-300">
                 <CheckIcon className="text-purple-400 mt-0.5 flex-shrink-0" size={16} />
                 <span>Advanced Integration & Security</span>
               </div>
             </div>
             <Button variant="outline" fullWidth>Request Proposal</Button>
          </div>
        </div>

        {/* Maintenance Section */}
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-zinc-900 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 bg-zinc-900 rounded-full text-brand-400">
            <ShieldCheckIcon size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Continuous Maintenance</h3>
            <p className="text-zinc-400 text-sm">
              We don't abandon you after launch. Optional monthly support packages are available 
              for updates, monitoring, and small feature additions.
            </p>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest mb-2 justify-center md:justify-end">
               <CreditCardIcon size={14} /> Stripe Secure
             </div>
             <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest justify-center md:justify-end">
               <LockIcon size={14} /> No Lock-in
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};