import React from 'react';
import { Box, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-2 rounded-lg">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Gemini 3D Forge
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-zinc-400">
          <div className="hidden md:flex items-center space-x-1">
            <Layers className="w-4 h-4" />
            <span>Image-to-Mesh Generator</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-500">
            Powered by Gemini 3.0 Pro
          </div>
        </div>
      </div>
    </header>
  );
};