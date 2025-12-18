import React from 'react';
import { ZapIcon, EyeIcon, LayoutIcon, LockIcon, MessageSquareIcon, TerminalIcon } from './Icons';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "1-Hour Prototype",
    description: "Speed is not a gimmick. It is the result of a refined system. Idea to functional MVP in record time.",
    icon: <ZapIcon />
  },
  {
    title: "Human Vision First",
    description: "Your vision is the source. AI is simply the amplifier. We translate intent into conscious design.",
    icon: <EyeIcon />
  },
  {
    title: "No Agency Nonsense",
    description: "No meetings. No onboarding calls. No gatekeeping. Just execution and clarity.",
    icon: <MessageSquareIcon />
  },
  {
    title: "Design Integrity",
    description: "Curated icon packs, component libraries, and structures aligned with your business, not templates.",
    icon: <LayoutIcon />
  },
  {
    title: "Total Independence",
    description: "Full access to code, assets, and logic. The more independent you are, the better.",
    icon: <TerminalIcon />
  },
  {
    title: "Fixed Pricing",
    description: "Transparent costs. 50/50 payment split for projects under €2,000. Secure via Stripe.",
    icon: <LockIcon />
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            Not an agency. <br />
            <span className="text-zinc-600">A productized studio.</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            We operate as a streamlined, asynchronous machine. We cut out the fluff 
            to focus entirely on what matters: shipping your product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 hover:border-white/10 transition-all duration-500 flex flex-col"
            >
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-zinc-700 transition-all duration-500 shadow-2xl">
                   {/* Clone element to enforce size and stroke */}
                   {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 24, strokeWidth: 1.5 })}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform duration-500">
                {feature.title}
              </h3>
              
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors duration-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};