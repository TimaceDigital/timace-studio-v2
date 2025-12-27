import React, { useState } from 'react';
import { 
  ArrowRightIcon, TrashIcon
} from './Icons';
import { Button } from './Button';
import { ProductItem, CheckoutFormData, UserProfile } from '../types';
import { CheckoutDetailsStep } from './checkout/CheckoutDetailsStep';
import { CheckoutCustomizationStep } from './checkout/CheckoutCustomizationStep';
import { CheckoutPaymentStep } from './checkout/CheckoutPaymentStep';
import { getProductIcon } from './checkout/utils';

interface CheckoutProps {
  cart: ProductItem[];
  onRemoveItem: (index: number) => void;
  onSuccess: () => void;
  onBack: () => void;
  currentUser: UserProfile | null;
}

type CheckoutStep = 'details' | 'customization' | 'payment';

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

  const totalValue = cart.reduce((acc, item) => acc + (item.priceValue || 0), 0);

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

  const commonProps = {
    cart,
    formData,
    setFormData,
    currentUser,
    onBack: () => {},
    onNext: () => {}
  };

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

            {/* STEPS */}
            {step === 'details' && (
              <CheckoutDetailsStep 
                {...commonProps} 
                onNext={() => setStep('customization')}
              />
            )}

            {step === 'customization' && (
              <CheckoutCustomizationStep 
                {...commonProps}
                onBack={() => setStep('details')}
                onNext={() => setStep('payment')}
              />
            )}

            {step === 'payment' && (
              <CheckoutPaymentStep 
                {...commonProps}
                onBack={() => setStep('customization')}
                onSuccess={onSuccess}
              />
            )}

          </div>
          {/* RIGHT COLUMN: SUMMARY */}
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
                                 <div className="scale-50 text-white">{getProductIcon(item)}</div>
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
