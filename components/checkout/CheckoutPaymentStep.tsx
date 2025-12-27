import React, { useState } from 'react';
import { 
  FileTextIcon, LockIcon, LoaderIcon
} from '../Icons';
import { Button } from '../Button';
import { CheckoutStepsProps } from './CheckoutDetailsStep';
import { createStripeCheckoutSession, createDraftOrder } from '../../services/dashboardService';
import { registerUser } from '../../services/authService';

// ----------------------------------------------------------------------
// Step 3: Payment (Review, Stripe, Proposal Request)
// ----------------------------------------------------------------------
export const CheckoutPaymentStep: React.FC<CheckoutStepsProps & { onSuccess: () => void }> = ({ 
  cart, formData, currentUser, onBack, onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalValue = cart.reduce((acc, item) => acc + (item.priceValue || 0), 0);
  const isHighValue = totalValue > 2000;
  const isCustom = cart.some(i => i.price === 'Custom');
  const showInvoiceOption = isHighValue || isCustom;

  const handlePay = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Account Creation / Validation (Phase C: Pre-Payment Identity)
      if (!currentUser) {
         if (formData.createAccount) {
           if (!formData.contactPassword || formData.contactPassword.length < 6) {
               throw new Error("Please provide a password (min 6 chars) to create your account.");
           }
           try {
               await registerUser(formData.contactEmail, formData.contactPassword);
               // Wait for auth state to settle. 
               // NOTE: In a real app, we should wait for the onAuthStateChanged listener in App.tsx to update 'currentUser'
               // but for this flow, we'll add a small delay and proceed. 
               // The cloud function relies on context.auth.uid, so the client MUST have a valid token.
               await new Promise(resolve => setTimeout(resolve, 1500));
           } catch (e: any) {
               // If user already exists, we might want to try logging them in or show a specific error
               if (e.code === 'auth/email-already-in-use') {
                   throw new Error("An account with this email already exists. Please log in first.");
               }
               throw new Error(`Account creation failed: ${e.message}`);
           }
         } else {
           throw new Error("Please create an account or log in to continue.");
         }
      }

      // 2. Create Draft Order - Sanitize Items
      const sanitizedItems = cart.map(({ icon, ...rest }) => {
         return JSON.parse(JSON.stringify(rest));
      });

      const draftData = {
        items: sanitizedItems,
        configurations: JSON.parse(JSON.stringify(formData.configurations || {})),
        notes: formData.projectDescription || '',
        rawVision: formData.projectDescription,
        type: paymentMethod === 'invoice' ? 'proposal' : 'standard',
        contactName: formData.contactName || currentUser?.displayName || 'Guest',
        contactEmail: formData.contactEmail || currentUser?.email || '',
        totalValue: totalValue,
        blueprintSummary: formData.analysisResult ? JSON.parse(JSON.stringify(formData.analysisResult)) : undefined
      };

      const { orderId } = await createDraftOrder(draftData);

      // 3. Process Payment or Finalize Proposal (Phase D: Payment & Webhook Transition)
      if (paymentMethod === 'card') {
        const { url } = await createStripeCheckoutSession(orderId);
        window.location.href = url;
      } else {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }

    } catch (err: any) {
        setIsProcessing(false);
        setError(err.message || String(err));
        console.error("Checkout Error:", err);
    }
  };

  return (
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
          <Button variant="ghost" onClick={onBack}>Back</Button>
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
  );
};
