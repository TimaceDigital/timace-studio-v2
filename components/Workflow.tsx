import React from 'react';
import { WorkflowStep } from '../types';

const steps: WorkflowStep[] = [
  {
    step: "01",
    title: "Choose & Order",
    description: "Select your product type and workflow. Submit your vision details directly. No sales calls needed."
  },
  {
    step: "02",
    title: "Live Dashboard",
    description: "Watch your build happen in real-time via your client dashboard. Full visibility, zero mystery."
  },
  {
    step: "03",
    title: "Review & Refine",
    description: "Receive your prototype in 1 hour*. We offer 3 revision rounds to ensure it matches your vision perfectly."
  },
  {
    step: "04",
    title: "Launch",
    description: "Final delivery with full code ownership. Ongoing maintenance available if you need it."
  }
];

export const Workflow: React.FC = () => {
  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-brand-500 font-mono text-sm tracking-wider uppercase mb-2 block">System Mechanics</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">How Timace Works</h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-md text-right md:text-left">
            Choose a solution, enter details, and watch your project come to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((item, index) => (
            <div key={index} className="relative p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
              <div className="text-6xl font-bold text-zinc-800/50 mb-4 font-mono select-none">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-8 h-[1px] bg-zinc-800 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};