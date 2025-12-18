import React from 'react';
import { Project } from '../types';
import { ArrowUpRightIcon } from './Icons';

const projects: Project[] = [
  {
    id: "proj_salary_compass",
    title: "Salary Compass",
    category: "Analytics Platform",
    description: "Real-time market salary data visualization.",
    image: "https://picsum.photos/600/400?random=1"
  },
  {
    id: "proj_tech_recruitment",
    title: "Tech Recruitment",
    category: "Hiring Portal",
    description: "Automated candidate matching system.",
    image: "https://picsum.photos/600/400?random=2"
  },
  {
    id: "proj_vat_calc",
    title: "Global VAT Calc",
    category: "FinTech Tool",
    description: "Cross-border tax compliance calculator.",
    image: "https://picsum.photos/600/400?random=3"
  },
  {
    id: "proj_attravio",
    title: "Attravio",
    category: "E-Commerce",
    description: "High-performance headless storefront.",
    image: "https://picsum.photos/600/400?random=4"
  }
];

export const Portfolio: React.FC = () => {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-white">Latest Builds</h2>
        <button className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
          View all projects <ArrowUpRightIcon size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="group relative rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-zinc-800">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 scale-100 group-hover:scale-105"
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <span className="text-brand-400 text-xs font-mono uppercase tracking-widest mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {project.category}
              </span>
              <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
              <p className="text-zinc-400 text-sm max-w-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center mt-12 text-zinc-500 text-sm">
        These aren't just demos. These are real systems built using the Timace workflow.
      </p>
    </section>
  );
};