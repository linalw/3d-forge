import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, FileWarning } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateAndPass(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  const validateAndPass = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-20 p-6 animate-fade-in">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-zinc-700 rounded-2xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-900 hover:border-blue-500/50 transition-all duration-300 group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <div className="mb-4 p-4 rounded-full bg-zinc-800 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300">
            <Upload className="w-10 h-10 text-zinc-400 group-hover:text-blue-500" />
          </div>
          <p className="mb-2 text-xl font-medium text-white">
            Drop your image here
          </p>
          <p className="mb-6 text-sm text-zinc-400">
            or click to browse files
          </p>
          <div className="flex gap-4 text-xs text-zinc-500 font-mono">
            <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> JPG, PNG, WEBP</span>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </label>
      
      <div className="mt-8 text-center">
        <h3 className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-4">Sample Objects</h3>
        <div className="flex justify-center gap-4 opacity-50 pointer-events-none grayscale">
           {/* Visual placeholders for aesthetic purposes only, functionally users upload their own */}
           <div className="w-16 h-16 bg-zinc-800 rounded-lg"></div>
           <div className="w-16 h-16 bg-zinc-800 rounded-lg"></div>
           <div className="w-16 h-16 bg-zinc-800 rounded-lg"></div>
        </div>
        <p className="mt-2 text-xs text-zinc-600">Sample selection coming soon</p>
      </div>
    </div>
  );
};