import React, { useState } from 'react';
import { PlusIcon } from './Icons';

const faqData = [
  {
    question: "Is Timace Studio an agency?",
    answer: (
      <>
        <p className="font-bold text-white mb-2">No.</p>
        <p>Timace Studio is an async, productized development studio.</p>
        <p>There are no meetings, no retainers by default, and no hourly billing games.</p>
        <p className="mt-2">You choose a solution, submit context, pay, and execution starts.</p>
      </>
    )
  },
  {
    question: "Who is this for?",
    answer: (
      <>
        <p>People who already operate something.</p>
        <p className="mt-2">Founders, consultants, and operators who:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
          <li>value speed over ceremony</li>
          <li>understand opportunity cost</li>
          <li>want answers, not prolonged processes</li>
        </ul>
        <p className="mt-4 p-3 bg-zinc-900/80 border-l-2 border-brand-500 text-sm italic">If you’re still exploring ideas casually or need heavy guidance, this probably isn’t the right fit.</p>
      </>
    )
  },
  {
    question: "Who is this not for?",
    answer: (
      <>
        <p>This is not for:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
          <li>beginners learning to build</li>
          <li>people looking for the cheapest option</li>
          <li>teams that want long discovery phases</li>
          <li>anyone who needs convincing that speed matters</li>
        </ul>
        <p className="mt-2 text-white font-medium">We’re optimized for execution, not education.</p>
      </>
    )
  },
  {
    question: "What do I actually receive?",
    answer: (
      <>
        <p className="font-bold text-white mb-2">A real outcome.</p>
        <p>Depending on what you choose:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
          <li>a clickable prototype</li>
          <li>a functional MVP</li>
          <li>a production-ready foundation</li>
        </ul>
        <p className="mt-2">All source code and assets are included.</p>
      </>
    )
  },
  {
    question: "How fast is “1 hour” really?",
    answer: (
      <>
        <p>For Rapid Prototypes, delivery happens within one focused execution window.</p>
        <p className="mt-2">The goal isn’t polish, it’s clarity.</p>
        <p>You get something real to react to the same day.</p>
      </>
    )
  },
  {
    question: "Do you use AI to design everything?",
    answer: (
      <>
        <p className="font-bold text-white mb-2">No.</p>
        <p>AI is used as an execution layer, not a decision-maker.</p>
        <p>Design, structure, and direction are human-led.</p>
        <p className="mt-2">We consciously avoid generic “AI-looking” output.</p>
      </>
    )
  },
  {
    question: "How many revisions do I get?",
    answer: (
      <>
        <p>Three revision rounds are included.</p>
        <p className="mt-2">If you need ongoing iteration, maintenance is available as a monthly option.</p>
        <p>We don’t disappear after delivery.</p>
      </>
    )
  },
  {
    question: "How does payment work?",
    answer: (
      <>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>Projects under €2,000 → 50% to start, 50% on delivery</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>Larger projects → 3-step milestone structure</span>
          </li>
        </ul>
        <p>Payments are handled securely via Stripe.</p>
        <p className="font-bold text-white mt-1">Clean pricing. Clean accounting.</p>
      </>
    )
  },
  {
    question: "About Timace Studio",
    answer: (
      <div className="space-y-4">
        <div>
          <p>Timace Studio was created as a reaction.</p>
          <p className="mt-1 text-zinc-500 text-sm uppercase tracking-wide font-bold">A reaction to:</p>
          <ul className="list-none mt-2 space-y-1 text-zinc-400 pl-4 border-l border-zinc-800">
            <li>slow agencies</li>
            <li>bloated processes</li>
            <li>endless discovery phases</li>
            <li>unnecessary meetings</li>
            <li>artificial complexity designed to increase billing</li>
          </ul>
        </div>
        
        <div>
          <p className="text-white font-bold">We wanted a different model.</p>
          <p className="mt-1 text-zinc-500 text-sm uppercase tracking-wide font-bold">One where:</p>
          <ul className="list-none mt-2 space-y-1 text-zinc-400 pl-4 border-l border-brand-500/50">
              <li>speed is the default</li>
              <li>pricing is clear</li>
              <li>execution is visible</li>
              <li>independence is encouraged</li>
              <li>and results matter more than rituals</li>
          </ul>
        </div>

        <div className="pt-2">
            <p>Timace Studio is not trying to replace agencies.</p>
            <p>It exists for people who are already done with them.</p>
            <p className="mt-3 text-brand-400 font-medium italic">If that resonates, you’ll feel it immediately.</p>
        </div>
      </div>
    )
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 bg-zinc-950 border-t border-zinc-900 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-zinc-900/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
                Clarification Protocol
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                Written to Filter, <br/>
                <span className="text-zinc-700">Not Convince.</span>
            </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
                key={index} 
                className={`group border rounded-3xl transition-all duration-300 overflow-hidden ${
                    openIndex === index 
                        ? 'bg-zinc-900/40 border-zinc-700 shadow-2xl shadow-black/50' 
                        : 'bg-transparent border-zinc-800 hover:border-zinc-700'
                }`}
            >
              <button 
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors ${openIndex === index ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {item.question}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 ${
                    openIndex === index 
                        ? 'bg-brand-500 border-brand-500 text-black rotate-[135deg]' 
                        : 'bg-transparent border-zinc-800 text-zinc-500 group-hover:border-zinc-600 group-hover:text-white'
                }`}>
                    <PlusIcon size={20} />
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-6 md:p-8 pt-0 text-zinc-400 leading-relaxed text-base md:text-lg">
                    <div className="pt-6 border-t border-zinc-800/50">
                       {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};