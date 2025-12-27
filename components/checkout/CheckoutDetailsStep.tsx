import React, { useState, useEffect } from 'react';
import { 
  ArrowRightIcon, LockIcon, 
  TrashIcon, UserIcon, CheckCircleIcon, 
  FileTextIcon, LoaderIcon, SparklesIcon
} from '../Icons';
import { Button } from '../Button';
import { ProductItem, CheckoutFormData, UserProfile, AnalysisResponse } from '../../types';
import { getProductSchema, getProductIcon } from './utils';
import { analyzeProjectIdea } from '../../services/geminiService';

export interface CheckoutStepsProps {
  cart: ProductItem[];
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  currentUser: UserProfile | null;
  onNext: () => void;
  onBack?: () => void;
}

// ----------------------------------------------------------------------
// Step 1: Details (Contact Info, Account Creation, Project Vision)
// ----------------------------------------------------------------------
export const CheckoutDetailsStep: React.FC<CheckoutStepsProps> = ({ 
  formData, setFormData, currentUser, onNext 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Initialize form with current user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        contactName: prev.contactName || currentUser.displayName || '',
        contactEmail: prev.contactEmail || currentUser.email || ''
      }));
    }
  }, [currentUser, setFormData]);
  
  const handleInputChange = (field: keyof CheckoutFormData, value: any) => {
     setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    // Phase A: Intent Capture & Analysis
    if (!formData.projectDescription || formData.projectDescription.length < 10) {
      onNext(); // Just proceed if description is too short (or handle validation)
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result: AnalysisResponse = await analyzeProjectIdea(formData.projectDescription);
      
      setFormData(prev => ({
        ...prev,
        analysisResult: result
      }));
      
      onNext();
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisError("AI Analysis failed. Proceeding without it.");
      // Proceed even if analysis fails, or maybe stop? 
      // Requirement says "The transition... happens across four distinct phases."
      // If phase A fails, we might still want to capture intent. 
      // Let's proceed but maybe log it.
      onNext();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project Context</h2>
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20 text-brand-400 text-xs font-bold">
                <UserIcon size={14} /> Logged in as {currentUser.displayName || currentUser.email}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Your Name</label>
            <input 
              className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none ${currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={formData.contactName}
              onChange={e => handleInputChange('contactName', e.target.value)}
              placeholder="John Doe"
              disabled={!!currentUser}
            />
          </div>
          <div>
            <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Email Address</label>
            <input 
              className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none ${currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={formData.contactEmail}
              onChange={e => handleInputChange('contactEmail', e.target.value)}
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
                <input type="checkbox" className="hidden" checked={formData.createAccount} onChange={e => handleInputChange('createAccount', e.target.checked)} />
                <span className="text-white text-sm font-medium">Create a secure client account</span>
              </label>
              
              {formData.createAccount && (
                <div className="mt-4 animate-fade-in">
                    <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Set Password</label>
                    <input 
                      type="password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none"
                      value={formData.contactPassword}
                      onChange={e => handleInputChange('contactPassword', e.target.value)}
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
            onChange={e => handleInputChange('projectName', e.target.value)}
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
            onChange={e => handleInputChange('projectDescription', e.target.value)}
          />
        </div>

        {analysisError && (
          <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            {analysisError}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} disabled={!formData.contactName || !formData.contactEmail || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <LoaderIcon className="animate-spin mr-2" /> Analyzing Vision...
              </>
            ) : (
              <>
                Next: Refine Vision <ArrowRightIcon className="ml-2" />
              </>
            )}
          </Button>
        </div>
    </div>
  );
};
