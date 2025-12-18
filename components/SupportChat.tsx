import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircleIcon, XIcon, ChevronDownIcon, 
  SparklesIcon, UserIcon, FileTextIcon, ArrowRightIcon, 
  LoaderIcon 
} from './Icons';
import { Button } from './Button';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface SupportChatProps {
  onNavigate: (view: any) => void;
}

type ChatMode = 'menu' | 'ai' | 'human';

export const SupportChat: React.FC<SupportChatProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('menu');
  
  // AI Chat State
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am the Timace AI Assistant. I can help you with questions about our services, pricing, or the build process. How can I help?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Human Message State
  const [humanMessage, setHumanMessage] = useState('');
  const [isSendingHuman, setIsSendingHuman] = useState(false);
  const [humanSent, setHumanSent] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, mode]);

  const handleAiSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { role: 'user' as const, text: inputValue };
    setAiMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsAiTyping(true);

    try {
      const responseText = await getChatResponse(aiMessages.concat(userMsg), inputValue);
      setAiMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleHumanSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanMessage.trim()) return;
    setIsSendingHuman(true);
    // Mock send
    setTimeout(() => {
      setIsSendingHuman(false);
      setHumanSent(true);
      setHumanMessage('');
    }, 1500);
  };

  const resetHumanForm = () => {
    setHumanSent(false);
    setHumanMessage('');
    setMode('menu');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 hover:bg-brand-400 text-black rounded-full shadow-2xl shadow-brand-500/20 flex items-center justify-center z-50 transition-transform hover:scale-105 active:scale-95 animate-fade-in-up"
      >
        <MessageCircleIcon size={24} fill="currentColor" className="text-black" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] max-w-[90vw] h-[600px] max-h-[80vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in-up overflow-hidden">
      
      {/* Header */}
      <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {mode !== 'menu' && (
            <button onClick={() => setMode('menu')} className="text-zinc-500 hover:text-white mr-1">
               <ChevronDownIcon size={20} className="rotate-90" />
            </button>
          )}
          <h3 className="font-bold text-white text-sm">
            {mode === 'menu' ? 'Support Center' : mode === 'ai' ? 'AI Assistant' : 'Studio Team'}
          </h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
          <XIcon size={20} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto bg-zinc-900/50 relative">
        
        {/* MENU MODE */}
        {mode === 'menu' && (
          <div className="p-6 space-y-4">
            <p className="text-zinc-400 text-sm mb-4">How would you like to get help today?</p>
            
            <button onClick={() => setMode('ai')} className="w-full text-left bg-zinc-800/50 hover:bg-zinc-800 p-4 rounded-xl border border-zinc-700/50 hover:border-brand-500/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <SparklesIcon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Ask AI Assistant</h4>
                  <p className="text-zinc-500 text-xs mt-1">Instant answers about pricing, stack, and process.</p>
                </div>
              </div>
            </button>

            <button onClick={() => setMode('human')} className="w-full text-left bg-zinc-800/50 hover:bg-zinc-800 p-4 rounded-xl border border-zinc-700/50 hover:border-brand-500/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Talk to Team</h4>
                  <p className="text-zinc-500 text-xs mt-1">Leave a message for the studio. We reply async.</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => {
                setIsOpen(false);
                onNavigate('support');
              }} 
              className="w-full text-left bg-zinc-800/50 hover:bg-zinc-800 p-4 rounded-xl border border-zinc-700/50 hover:border-brand-500/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <FileTextIcon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Submit Ticket</h4>
                  <p className="text-zinc-500 text-xs mt-1">For technical issues, billing, or complex requests.</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* AI MODE */}
        {mode === 'ai' && (
          <div className="flex flex-col min-h-full">
            <div className="flex-1 p-4 space-y-4">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                     msg.role === 'user' 
                       ? 'bg-brand-600 text-white rounded-tr-none' 
                       : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                   }`}>
                     {msg.text}
                   </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                   <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200"></div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleAiSend} className="p-3 border-t border-zinc-800 bg-zinc-950">
               <div className="relative">
                 <input 
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-brand-500/50"
                   placeholder="Type a message..."
                   value={inputValue}
                   onChange={e => setInputValue(e.target.value)}
                   autoFocus
                 />
                 <button type="submit" disabled={!inputValue.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand-500 hover:text-white disabled:opacity-50">
                   <ArrowRightIcon size={16} />
                 </button>
               </div>
            </form>
          </div>
        )}

        {/* HUMAN MODE */}
        {mode === 'human' && (
          <div className="flex flex-col h-full p-6">
            {!humanSent ? (
              <>
                <div className="flex-1">
                  <p className="text-zinc-400 text-sm mb-6">
                    Our team is currently offline (async workflow). Leave a message and we'll email you back shortly.
                  </p>
                  <form id="human-form" onSubmit={handleHumanSend}>
                    <textarea 
                      className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-brand-500/50 resize-none mb-4"
                      placeholder="How can we help?"
                      value={humanMessage}
                      onChange={e => setHumanMessage(e.target.value)}
                      required
                    />
                  </form>
                </div>
                <Button type="submit" form="human-form" fullWidth disabled={isSendingHuman}>
                  {isSendingHuman ? <><LoaderIcon className="animate-spin" size={14} /> Sending...</> : 'Send Message'}
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                 <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                   <FileTextIcon size={32} />
                 </div>
                 <h4 className="text-white font-bold text-lg mb-2">Message Sent</h4>
                 <p className="text-zinc-500 text-sm mb-6">We'll get back to you via email within a few hours.</p>
                 <Button onClick={resetHumanForm} variant="outline" className="!text-xs">Back to Menu</Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};