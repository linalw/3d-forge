import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const ProcessingState: React.FC = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    "Analyzing image structure...",
    "Detecting object boundaries...",
    "Estimating 3D geometry...",
    "Generating mesh vertices...",
    "Finalizing OBJ format..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">Constructing 3D Model</h2>
      <p className="text-zinc-400 max-w-md mx-auto h-6 transition-all duration-300 ease-in-out">
        {steps[step]}
      </p>
      
      <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
        <Sparkles className="w-3 h-3" />
        <span>Gemini 3.0 Pro Reasoning</span>
      </div>
    </div>
  );
};