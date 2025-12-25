import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ProcessingState } from './components/ProcessingState';
import { Viewer3D } from './components/Viewer3D';
import { generate3DModelFromImage } from './services/geminiService';
import { AppState, GeneratedModel, ProcessingError } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [modelData, setModelData] = useState<GeneratedModel | null>(null);
  const [error, setError] = useState<ProcessingError | null>(null);

  const handleFileSelect = async (file: File) => {
    setState(AppState.PROCESSING);
    setError(null);
    
    try {
      const apiKey = process.env.API_KEY || '';
      if (!apiKey) {
        throw new Error("API Key is not configured in the environment.");
      }

      const result = await generate3DModelFromImage(file, apiKey);
      setModelData(result);
      setState(AppState.VIEWER);
    } catch (err: any) {
      console.error(err);
      setError({ message: err.message || "Something went wrong during generation." });
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setState(AppState.UPLOAD);
    setModelData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-blue-500/30">
      <Header />
      
      <main className="pt-20 px-4 h-full flex flex-col items-center">
        {state === AppState.UPLOAD && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center mt-12 mb-8 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Turn Images into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">3D Models</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Upload a photo of an object. Gemini 3.0 Pro will analyze its geometry and reconstruct a 3D mesh approximation instantly.
              </p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
        )}

        {state === AppState.PROCESSING && (
          <ProcessingState />
        )}

        {state === AppState.VIEWER && modelData && (
          <Viewer3D 
            objString={modelData.objString} 
            description={modelData.description} 
            onReset={handleReset} 
          />
        )}

        {state === AppState.ERROR && (
          <div className="mt-20 p-8 max-w-lg mx-auto bg-red-950/20 border border-red-900/50 rounded-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
            <p className="text-red-200/80 mb-6">{error?.message}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;