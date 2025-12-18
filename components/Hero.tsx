import React from 'react';
import { ArrowRightIcon, ZapIcon } from './Icons';
import { Button } from './Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-48">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-md text-xs text-brand-300 mb-8 font-mono hover:bg-zinc-900 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="tracking-widest uppercase">READY TO DELIVER</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white leading-[1.1]">
            Idea to Prototype <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-brand-200 to-brand-500 text-glow">
              in 1 Hour.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-fade-in-up-delay">
            Human vision. Agentic execution. Zero agency nonsense.
            <span className="block mt-4 text-sm md:text-base text-zinc-500 font-mono">
              We translate your intent into real products using Gemini 3 Pro & Claude Opus.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay opacity-0" style={{ animationFillMode: 'forwards' }}>
            <Button variant="primary" className="w-full sm:w-auto h-12 px-8 shadow-2xl shadow-brand-500/10">
              Start Your Build
              <ArrowRightIcon size={16} />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 backdrop-blur-sm">
              View Latest Builds
            </Button>
          </div>
        </div>

        {/* Tech Stack Indicators */}
        <div className="mt-24 flex flex-wrap justify-center gap-3 md:gap-4 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.6s' }}>
            {[
                { name: "Gemini 3 Pro", color: "bg-purple-500", shadow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]" },
                { name: "Claude Opus 4.5", color: "bg-blue-500", shadow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" },
                { name: "Stripe Secure", color: "bg-emerald-500", shadow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]" },
                { name: "Async First", color: "bg-brand-500", shadow: "group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]" }
            ].map((tech, i) => (
                <div 
                    key={i} 
                    className={`group relative px-5 py-2.5 rounded-full bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 flex items-center gap-2.5 backdrop-blur-md cursor-default hover:-translate-y-1 ${tech.shadow}`}
                >
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${tech.color} opacity-0 group-hover:opacity-75 transition-opacity duration-300`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${tech.color}`}></span>
                    </span>
                    <span className="text-[10px] md:text-xs font-mono font-medium tracking-wider text-zinc-500 group-hover:text-zinc-200 transition-colors uppercase">
                        {tech.name}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};