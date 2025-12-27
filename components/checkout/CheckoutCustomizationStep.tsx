import React, { useState, useEffect } from 'react';
import { 
  ArrowRightIcon, SparklesIcon, LoaderIcon
} from '../Icons';
import { Button } from '../Button';
import { CheckoutStepsProps } from './CheckoutDetailsStep'; // Reuse props interface
import { getProductSchema, getProductIcon } from './utils';
import { autofillProjectConfig } from '../../services/geminiService';

// ----------------------------------------------------------------------
// Step 2: Customization (Product Configuration, AI Autofill)
// ----------------------------------------------------------------------
export const CheckoutCustomizationStep: React.FC<CheckoutStepsProps> = ({ 
  cart, formData, setFormData, onNext, onBack
}) => {
  const [isAutofilling, setIsAutofilling] = useState(false);

  // Check if we have analysis results from the previous step
  const analysis = formData.analysisResult;

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

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Phase A Output Display */}
        {analysis && (
          <div className="bg-brand-900/10 border border-brand-500/20 rounded-2xl p-6 mb-6">
            <h3 className="text-brand-400 font-bold mb-4 flex items-center gap-2">
              <SparklesIcon size={16} /> AI Architect Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="block text-zinc-500 text-xs uppercase font-bold mb-1">Feasibility</span>
                <span className={`font-medium ${analysis.feasibility === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                   {analysis.feasibility}
                </span>
              </div>
              <div>
                <span className="block text-zinc-500 text-xs uppercase font-bold mb-1">Recommended Stack</span>
                <span className="text-white font-mono text-xs">{analysis.stackRecommendation}</span>
              </div>
              <div>
                <span className="block text-zinc-500 text-xs uppercase font-bold mb-1">Est. Timeline</span>
                <span className="text-white">{analysis.estimatedTimeline}</span>
              </div>
              <div className="md:col-span-3 border-t border-brand-500/10 pt-4 mt-2">
                <span className="block text-zinc-500 text-xs uppercase font-bold mb-1">Agentic DNA Strategy</span>
                <p className="text-zinc-300 italic">"{analysis.agenticInsight}"</p>
              </div>
            </div>
          </div>
        )}

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
                      <div className="scale-75 text-white">{getProductIcon(item)}</div>
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
          <Button variant="ghost" onClick={onBack}>Back</Button>
          <Button onClick={onNext}>
              Next: Payment <ArrowRightIcon className="ml-2" />
          </Button>
        </div>
    </div>
  );
};
