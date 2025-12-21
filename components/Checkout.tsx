import React, { useState, useEffect } from 'react';
import { 
  ArrowRightIcon, CheckCircleIcon, CreditCardIcon, 
  FileTextIcon, LockIcon, SparklesIcon, TrashIcon, 
  UploadIcon, UserIcon, PlusIcon, LoaderIcon, ShieldCheckIcon,
  SettingsIcon, LayoutIcon, DatabaseIcon, ZapIcon
} from './Icons';
import { Button } from './Button';
import { ProductItem, AiSuggestion, CheckoutFormData, Order, UserProfile } from '../types';
import { generateCheckoutSuggestions, autofillProjectConfig } from '../services/geminiService';
import { registerUser } from '../services/authService';
import { createStripeCheckoutSession } from '../services/dashboardService';

interface CheckoutProps {
  cart: ProductItem[];
  onRemoveItem: (index: number) => void;
  onSuccess: () => void;
  onBack: () => void;
  currentUser: UserProfile | null;
}

type CheckoutStep = 'details' | 'customization' | 'payment';

// --- Configuration Schema Definition ---
type FieldType = 'select' | 'color' | 'radio';

interface ConfigField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  helperText?: string;
}

const CONFIG_SCHEMAS: Record<string, ConfigField[]> = {
  'marketing': [
    { 
      id: 'aesthetic', 
      label: 'Visual Aesthetic', 
      type: 'select', 
      options: ['Minimal & Clean', 'Brutalist & Bold', 'Corporate & Trust', 'Playful & Vibrant', 'Dark Mode / Cyberpunk', 'Luxury & Serif'],
      helperText: 'Sets the mood board for the agentic designer.'
    },
    { 
      id: 'typography', 
      label: 'Typography Style', 
      type: 'select', 
      options: ['Sans Serif (Inter/Geist)', 'Serif (Playfair/Merriweather)', 'Monospace (JetBrains/Fira)', 'Mixed'],
    },
    { 
      id: 'primary_color', 
      label: 'Primary Brand Color', 
      type: 'select', 
      options: ['Blue', 'Green', 'Purple', 'Orange', 'Red', 'Black/White', 'Yellow', 'Teal']
    }
  ],
  'saas': [
    { 
      id: 'auth_provider', 
      label: 'Authentication Provider', 
      type: 'radio', 
      options: ['Supabase Auth', 'Firebase Auth', 'Clerk', 'NextAuth', 'None'],
      helperText: 'We will scaffold the user tables and login flows.'
    },
    { 
      id: 'database', 
      label: 'Database Preference', 
      type: 'select', 
      options: ['PostgreSQL (Supabase)', 'Firestore (Firebase)', 'MongoDB', 'MySQL'],
    },
    { 
      id: 'payments', 
      label: 'Payment Gateway', 
      type: 'radio', 
      options: ['Stripe', 'LemonSqueezy', 'None'],
    },
    { 
      id: 'aesthetic', 
      label: 'Dashboard Style', 
      type: 'select', 
      options: ['Sidebar Navigation', 'Top Bar Navigation', 'Dense Data Grid', 'Card Based'],
    }
  ],
  'generic': [
    { 
      id: 'delivery_format', 
      label: 'Delivery Format', 
      type: 'select', 
      options: ['GitHub Repository', 'Zip Archive', 'Vercel Deploy Invite'],
    }
  ]
};

const getProductSchema = (product: ProductItem): ConfigField[] => {
  if (product.category.toLowerCase().includes('full builds') || product.name.toLowerCase().includes('prototype')) {
     if (product.name.toLowerCase().includes('marketing') || product.name.toLowerCase().includes('landing')) {
       return CONFIG_SCHEMAS['marketing'];
     }
     return CONFIG_SCHEMAS['saas'];
  }
  return CONFIG_SCHEMAS['generic'];
};

export const Checkout: React.FC<CheckoutProps> = ({ cart, onRemoveItem, onSuccess, onBack, currentUser }) => {
  const [step, setStep] = useState<CheckoutStep>('details');
  const [formData, setFormData] = useState<CheckoutFormData>({
    contactEmail: currentUser?.email || '',
    contactName: currentUser?.displayName || '',
    contactPassword: '',
    createAccount: !currentUser, // Default to true if no user
    projectName: '',
    projectDescription: '',
    files: [],
    configurations: {}
  });
  
  // AI State
  const [isAutofilling, setIsAutofilling] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalValue = cart.reduce((acc, item) => acc + (item.priceValue || 0), 0);
  const isHighValue = totalValue > 2000;
  const isCustom = cart.some(i => i.price === 'Custom');
  const showInvoiceOption = isHighValue || isCustom;

  // Handlers
  const handleConfigChange = (itemIndex: number, fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      configurations: {
        ...prev.configurations,
        [itemIndex]: {
          ...(prev.configurations[itemIndex] || {}),
          [fieldId]: value
        }
      }
    }));
  };

  const handleAutofill = async () => {
    if (!formData.projectDescription) return;
    setIsAutofilling(true);
    
    const itemsToConfigure = cart.map((item, index) => ({
      index,
      name: item.name,
      type: item.category,
      availableFields: getProductSchema(item).map(f => f.id)
    }));

    try {
      const results = await autofillProjectConfig(itemsToConfigure, formData.projectDescription);
      
      const newConfigs = { ...formData.configurations };
      results.forEach(res => {
        newConfigs[res.itemId] = {
           ...(newConfigs[res.itemId] || {}),
           ...res.config
        };
      });

      setFormData(prev => ({
        ...prev,
        configurations: newConfigs
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAutofilling(false);
    }
  };

  const handlePay = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      if (!currentUser) {
         if (formData.createAccount) {
           if (!formData.contactPassword || formData.contactPassword.length < 6) {
               throw new Error("Please provide a password (min 6 chars) to create your account.");
           }
           try {
               await registerUser(formData.contactEmail, formData.contactPassword);
           } catch (e: any) {
               throw new Error(`Account creation failed: ${e.message}`);
           }
         } else {
           throw new Error("Please create an account or log in to continue.");
         }
      }

      if (paymentMethod === 'card') {
        const product = cart[0]; // Assuming single item cart for simplicity
        const { url } = await createStripeCheckoutSession(product, formData.configurations);
        window.location.href = url;
      } else {
        // Handle invoice/proposal request - this part remains the same
      }

    } catch (err: any) {
        setIsProcessing(false);
        setError(err.message);
    }
  };

  const steps = [
    { id: 'details', label: '1. Vision' },
    { id: 'customization', label: '2. Refine' },
    { id: 'payment', label: '3. Execution' }
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 text-center">
        <h2 className="text-2xl text-white font-bold mb-4">Your cart is empty</h2>
        <Button onClick={onBack}>Browse Services</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20 animate-fade-in">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <button onClick={onBack} className="text-zinc-500 hover:text-white text-sm mb-8 flex items-center gap-2">
           <ArrowRightIcon className="rotate-180" size={14} /> Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: WIZARD */}
          <div className="lg:col-span-2">
            
            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-6">
               {steps.map((s, idx) => (
                 <div key={s.id} className="flex items-center gap-3">
                    <div className={`text-sm font-bold ${step === s.id ? 'text-brand-400' : 'text-zinc-600'}`}>
                      {s.label}
                    </div>
                    {idx < steps.length - 1 && <div className="text-zinc-800">/</div>}
                 </div>
               ))}
            </div>

            {/* STEP 1: DETAILS */}
            {step === 'details' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Project Context</h2>
                    {currentUser && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20 text-brand-400 text-xs font-bold">
                         <UserIcon size={14} /> Logged in as {currentUser.displayName}
                      </div>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Your Name</label>
                      <input 
                        className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none ${currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                        value={formData.contactName}
                        onChange={e => setFormData({...formData, contactName: e.target.value})}
                        placeholder="John Doe"
                        disabled={!!currentUser}
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Email Address</label>
                      <input 
                        className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none ${currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                        value={formData.contactEmail}
                        onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                        placeholder="john@example.com"
                        type="email"
                        disabled={!!currentUser}
                      />
                    </div>
                 </div>

                 {!currentUser && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 transition-all">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.createAccount ? 'bg-brand-500 border-brand-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                             {formData.createAccount && <CheckCircleIcon size={14} className="text-black" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={formData.createAccount} onChange={e => setFormData({...formData, createAccount: e.target.checked})} />
                          <span className="text-white text-sm font-medium">Create a secure client account</span>
                       </label>
                       
                       {formData.createAccount && (
                          <div className="mt-4 animate-fade-in">
                             <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Set Password</label>
                             <input 
                               type="password"
                               className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none"
                               value={formData.contactPassword}
                               onChange={e => setFormData({...formData, contactPassword: e.target.value})}
                               placeholder="Min. 6 characters"
                             />
                             <p className="text-zinc-500 text-xs mt-2">You will use this to access your dashboard later.</p>
                          </div>
                       )}
                    </div>
                 )}

                 <div>
                    <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Project Name</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none"
                      value={formData.projectName}
                      onChange={e => setFormData({...formData, projectName: e.target.value})}
                      placeholder="e.g. Acme Dashboard v2"
                    />
                 </div>

                 <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mt-4">
                    <div className="flex justify-between items-center mb-4">
                       <label className="block text-zinc-500 text-xs uppercase font-bold">Project Vision / Notes</label>
                       {formData.projectDescription.length > 10 && (
                          <div className="flex gap-2">
                             <span className="text-xs text-zinc-600 self-center hidden sm:block">AI will analyze this for the next step</span>
                          </div>
                       )}
                    </div>
                    <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none min-h-[120px] resize-none"
                      placeholder="Describe what you want to build. E.g. 'A sleek, dark-mode landing page for a Web3 startup. Needs to feel futuristic, use neon green accents, and have a countdown timer.'"
                      value={formData.projectDescription}
                      onChange={e => setFormData({...formData, projectDescription: e.target.value})}
                    />
                 </div>

                 <div className="flex justify-end pt-4">
                    <Button onClick={() => setStep('customization')} disabled={!formData.contactName || !formData.contactEmail}>
                      Next: Refine Vision <ArrowRightIcon className="ml-2" />
                    </Button>
                 </div>
              </div>
            )}

            {/* STEP 2: CUSTOMIZATION & AI */}
            {step === 'customization' && (
              <div className="space-y-8 animate-fade-in">
                 <div className="flex justify-between items-end">
                   <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Configure Build</h2>
                      <p className="text-zinc-400 text-sm">Define the technical and visual DNA of your products.</p>
                   </div>
                   <Button 
                     variant="secondary" 
                     className="!py-2 !text-xs !bg-brand-500/10 !text-brand-400 !border-brand-500/20 hover:!bg-brand-500/20 border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                     onClick={handleAutofill}
                     disabled={isAutofilling || !formData.projectDescription}
                   >
                     {isAutofilling ? <LoaderIcon className="animate-spin" size={14} /> : <SparklesIcon size={14} />}
                     {isAutofilling ? 'Configuring...' : 'Auto-Configure with AI'}
                   </Button>
                 </div>

                 {/* DYNAMIC PRODUCT FORMS */}
                 <div className="space-y-6">
                   {cart.map((item, index) => {
                     const schema = getProductSchema(item);
                     const configState = formData.configurations[index] || {};

                     return (
                       <div key={`${item.id}-${index}`} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                          <div className="bg-zinc-900/80 p-4 border-b border-zinc-800 flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                                <div className="scale-75 text-white">{item.icon}</div>
                             </div>
                             <span className="font-bold text-white text-sm">{item.name}</span>
                             <span className="text-[10px] text-zinc-500 uppercase tracking-widest ml-auto font-mono">Config #{index + 1}</span>
                          </div>
                          
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                             {schema.map(field => (
                               <div key={field.id} className={field.type === 'radio' ? 'md:col-span-2' : ''}>
                                  <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">
                                    {field.label}
                                  </label>
                                  
                                  {field.type === 'select' && (
                                    <div className="relative">
                                      <select 
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white appearance-none focus:border-brand-500/50 focus:outline-none transition-colors"
                                        value={configState[field.id] || ''}
                                        onChange={(e) => handleConfigChange(index, field.id, e.target.value)}
                                      >
                                        <option value="" disabled>Select option...</option>
                                        {field.options?.map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      </div>
                                    </div>
                                  )}

                                  {field.type === 'radio' && (
                                    <div className="flex flex-wrap gap-2">
                                      {field.options?.map(opt => (
                                        <button
                                          key={opt}
                                          onClick={() => handleConfigChange(index, field.id, opt)}
                                          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                                            configState[field.id] === opt 
                                              ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' 
                                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {field.helperText && (
                                    <p className="text-[10px] text-zinc-600 mt-1.5">{field.helperText}</p>
                                  )}
                               </div>
                             ))}
                          </div>
                       </div>
                     );
                   })}
                 </div>

                 <div className="flex justify-between pt-8 border-t border-zinc-900">
                    <Button variant="ghost" onClick={() => setStep('details')}>Back</Button>
                    <Button onClick={() => setStep('payment')}>
                       Next: Payment <ArrowRightIcon className="ml-2" />
                    </Button>
                 </div>
              </div>
            )}

            {/* STEP 3: PAYMENT / EXECUTION */}
            {step === 'payment' && (
              <div className="space-y-8 animate-fade-in">
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Finalize Execution</h2>
                    <p className="text-zinc-400 text-sm">Review your order and initialize the build sequence.</p>
                 </div>

                 {showInvoiceOption && (
                   <div className="flex gap-4 p-1 bg-zinc-900 rounded-xl border border-zinc-800 inline-flex">
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${paymentMethod === 'card' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Card Payment
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('invoice')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${paymentMethod === 'invoice' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Request Proposal
                      </button>
                   </div>
                 )}

                 {paymentMethod === 'card' ? (
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-6 text-center">
                        <h3 className="font-bold text-white">Redirecting to Stripe</h3>
                        <p className="text-zinc-400 text-sm max-w-md mx-auto">You will be redirected to a secure Stripe page to complete your payment.</p>
                        <LoaderIcon className="animate-spin mx-auto text-brand-400" size={24}/>
                    </div>
                 ) : (
                   <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                         <FileTextIcon size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Request Formal Proposal</h3>
                      <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
                        For enterprise or custom builds, we will review your notes and send a detailed PDF proposal and invoice within 2 hours.
                      </p>
                   </div>
                 )}
                 
                 {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center">
                       {error}
                    </div>
                 )}

                 <div className="flex justify-between pt-4 border-t border-zinc-900">
                    <Button variant="ghost" onClick={() => setStep('customization')}>Back</Button>
                    <Button onClick={handlePay} disabled={isProcessing} className="min-w-[200px]">
                       {isProcessing ? <LoaderIcon className="animate-spin" /> : <LockIcon size={16} />}
                       {isProcessing 
                         ? 'Processing...' 
                         : paymentMethod === 'card' 
                           ? `Pay €${totalValue.toLocaleString()}` 
                           : 'Submit Request'}
                    </Button>
                 </div>
              </div>
            )}

          </div>
          {/* ... Right Column Same as Before ... */}
          <div className="lg:col-span-1">
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sticky top-32">
                <h3 className="text-white font-bold mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                   {cart.map((item, idx) => {
                      const configs = formData.configurations[idx];
                      return (
                        <div key={idx} className="flex flex-col border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                           <div className="flex gap-4">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                                 <div className="scale-50 text-white">{item.icon}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                                 <p className="text-zinc-500 text-xs">{item.category}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className="text-white text-sm font-mono">{item.price}</span>
                                 <button onClick={() => onRemoveItem(idx)} className="text-zinc-600 hover:text-red-400 mt-1">
                                    <TrashIcon size={12} />
                                 </button>
                              </div>
                           </div>
                           {configs && Object.keys(configs).length > 0 && (
                             <div className="mt-2 ml-16 flex flex-wrap gap-1">
                               {Object.values(configs).map((val, i) => (
                                 val && <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">{val}</span>
                               ))}
                             </div>
                           )}
                        </div>
                      );
                   })}
                </div>
                {/* Total */}
                <div className="border-t border-zinc-800 pt-4 space-y-2 mb-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="text-zinc-300">€{totalValue.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Tax (VAT 0%)</span>
                      <span className="text-zinc-300">€0</span>
                   </div>
                   <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
                      <span className="text-white">Total</span>
                      <span className="text-brand-400">€{totalValue.toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};