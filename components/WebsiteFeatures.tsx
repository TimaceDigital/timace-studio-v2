import React from 'react';
import { Button } from './Button';
import { ArrowRightIcon, CheckCircleIcon } from './Icons';

const featuresRow1 = [
  "Enhanced UX", "Boosted Conversions", "Fast Loading", "SEO Optimized", 
  "Client Dashboard", "Real-Time Updates", "Progress Tracking", "Milestone Tracking"
];

const featuresRow2 = [
  "Transparent Process", "No Meetings Required", "Secure", "User-Friendly",
  "Mobile Responsive", "Accessibility Ready", "Dark Mode Support", "Analytics Integration"
];

export const WebsiteFeatures: React.FC = () => {
  return (
    <section className="py-24 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
        {/* Content */}
        <div className="container mx-auto px-6 mb-16 relative z-10">
           {/* Text Header */}
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div className="max-w-3xl">
                <span className="text-brand-500 font-mono text-sm tracking-wider uppercase mb-3 block">Always Evolving</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Our features are continuously evolving to stay ahead of the curve.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                  We're constantly researching and adding new capabilities to our websites. 
                  When you work with us, you'll always have access to the latest advancements in web technology.
                </p>
              </div>
              <div className="flex-shrink-0">
                 <Button variant="outline" className="group">
                    View FAQ 
                    <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                 </Button>
              </div>
           </div>
        </div>

        {/* Marquee Rows */}
        <div className="flex flex-col gap-6 relative">
            {/* Gradient Masks for fade effect at edges */}
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"></div>

            {/* Row 1 */}
            <div className="flex gap-4 animate-scroll whitespace-nowrap w-max hover:[animation-play-state:paused]">
                {/* Triplicated list to ensure smooth infinite scroll without gaps */}
                {[...featuresRow1, ...featuresRow1, ...featuresRow1].map((feature, i) => (
                    <div key={`r1-${i}`} className="px-6 py-3 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium text-sm flex items-center gap-3 hover:border-brand-500/30 hover:bg-zinc-900 hover:text-white transition-all cursor-default group">
                        <CheckCircleIcon size={16} className="text-brand-500 group-hover:scale-110 transition-transform" />
                        {feature}
                    </div>
                ))}
            </div>

            {/* Row 2 - Slower speed for visual variance */}
             <div className="flex gap-4 animate-scroll whitespace-nowrap w-max hover:[animation-play-state:paused]" style={{ animationDuration: '50s' }}>
                {[...featuresRow2, ...featuresRow2, ...featuresRow2].map((feature, i) => (
                    <div key={`r2-${i}`} className="px-6 py-3 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium text-sm flex items-center gap-3 hover:border-brand-500/30 hover:bg-zinc-900 hover:text-white transition-all cursor-default group">
                         <CheckCircleIcon size={16} className="text-brand-500 group-hover:scale-110 transition-transform" />
                        {feature}
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};