import React from 'react';
import { 
  GlobeIcon, RocketIcon, CpuIcon, LayoutIcon, 
  SparklesIcon, RefreshCwIcon, SearchIcon, ArrowRightIcon, ServerIcon
} from './Icons';
import { Button } from './Button';

interface PossibilitiesProps {
  onCtaClick: () => void;
}

const categories = [
  {
    title: "Marketing & Growth Surfaces",
    desc: "What most people expect — but done properly.",
    items: ["Marketing websites", "Landing pages & campaign pages", "SEO-driven page systems", "Programmatic content pages", "Conversion-focused microsites", "Multi-language sites"],
    icon: <GlobeIcon size={32} />
  },
  {
    title: "Product & MVP Builds",
    desc: "From idea to something real, fast.",
    items: ["MVPs and prototypes", "Web apps", "SaaS dashboards", "Admin panels", "User authentication systems", "Subscription & payment flows"],
    icon: <RocketIcon size={32} />
  },
  {
    title: "Tools & Calculators",
    desc: "High-intent, high-value utilities.",
    items: ["SEO tools", "Calculators (salary, pricing, ROI)", "Decision tools", "Configurators", "Internal utilities", "Public lead-generation tools"],
    icon: <CpuIcon size={32} />
  },
  {
    title: "Internal Systems",
    desc: "Where you really differentiate.",
    items: ["Custom internal dashboards", "CRM-like systems", "Client portals", "Project & workflow tools", "Reporting dashboards", "Knowledge bases"],
    icon: <LayoutIcon size={32} />
  },
  {
    title: "API & System Integrations",
    desc: "The glue between everything.",
    items: ["Salesforce integrations", "CMS integrations", "Payment providers (Stripe)", "Databases & internal APIs", "Data syncing", "Custom backend logic"],
    icon: <ServerIcon size={32} />
  },
  {
    title: "AI-Powered Experiences",
    desc: "Without the hype.",
    items: ["AI-assisted tools", "Intelligent search & filtering", "Content generation workflows", "Data analysis & summarization", "Agentic execution pipelines", "AI embedded products"],
    icon: <SparklesIcon size={32} />
  },
  {
    title: "Design & Frontend Systems",
    desc: "Human-led, intentional.",
    items: ["Design systems", "Component libraries", "Custom UI kits", "High-fidelity interfaces", "Mobile-first experiences", "Accessibility-conscious design"],
    icon: <LayoutIcon size={32} />
  },
  {
    title: "Automation & Workflows",
    desc: "Making things disappear.",
    items: ["Internal automations", "No-code to custom migrations", "Process optimization", "Background jobs & schedulers", "Notifications & alerts"],
    icon: <RefreshCwIcon size={32} />
  },
  {
    title: "Experiments & One-offs",
    desc: "Because not everything is a product.",
    items: ["Proofs of concept", "Experiments", "Internal tools", "Temporary systems", "Idea validation builds"],
    icon: <SearchIcon size={32} />
  }
];

export const Possibilities: React.FC<PossibilitiesProps> = ({ onCtaClick }) => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950 animate-fade-in">
        <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-24">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-6">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                   Capabilities Manifest
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                    What can we build?
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light">
                    We don’t sell packages of features. We build what makes sense for your intent.
                    <span className="text-white block mt-2">If you can describe it, we can build it.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
                {categories.map((cat, i) => (
                    <div key={i} className="group p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col">
                        <div className="mb-6 text-brand-400 group-hover:scale-110 transition-transform duration-500 origin-left">
                            {React.cloneElement(cat.icon as React.ReactElement, { strokeWidth: 1.5 })}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                        <p className="text-zinc-500 text-sm mb-8 font-medium">{cat.desc}</p>
                        
                        <ul className="space-y-3 border-t border-zinc-800/50 pt-6 mt-auto">
                            {cat.items.map((item, idx) => (
                                <li key={idx} className="text-zinc-400 text-sm flex items-start gap-3 group-hover:text-zinc-300 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1.5 shrink-0 group-hover:bg-brand-500 transition-colors"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 md:p-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-500/20 transition-colors duration-500"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 relative z-10 leading-tight">
                    If it can be described clearly,<br className="hidden md:block"/>
                    it can be built — <span className="text-zinc-500">and evolved.</span>
                </h2>
                <div className="flex justify-center relative z-10">
                     <Button onClick={onCtaClick} className="h-14 px-10 text-base shadow-2xl shadow-brand-500/20">
                        Start Your Project <ArrowRightIcon className="ml-2" />
                     </Button>
                </div>
            </div>
        </div>
    </div>
  );
};