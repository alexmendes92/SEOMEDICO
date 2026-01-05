import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, ScanEye } from 'lucide-react';
import { analyzeImage } from '../../services/geminiService';
import { ProcessingState } from '../../types';

const VisionTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        // Strip prefix for API but keep mime type for the call
        const base64Data = base64.split(',')[1];
        processImage(base64Data, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Data: string, mimeType: string) => {
    setStatus(ProcessingState.PROCESSING);
    try {
      const analysis = await analyzeImage(base64Data, mimeType, "Identify objects, read any text, and assess image safety (Web Risk).");
      setResult(analysis);
      setStatus(ProcessingState.SUCCESS);
    } catch (e) {
      setResult("Error analyzing image.");
      setStatus(ProcessingState.ERROR);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <ScanEye className="text-blue-500" /> Cloud Vision & Web Risk
        </h2>
        <p className="text-slate-400 mb-6">
          Upload an image to perform object detection, optical character recognition (OCR), and safety verification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all
                ${image ? 'border-blue-500/50 bg-slate-800/30' : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800/50'}
              `}
            >
              {image ? (
                <img src={image} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="text-blue-400" />
                  </div>
                  <p className="text-slate-300 font-medium">Click to upload image</p>
                  <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG</p>
                </div>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col min-h-[16rem]">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Analysis Report
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {status === ProcessingState.PROCESSING ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p>Analyzing pixels...</p>
                </div>
              ) : status === ProcessingState.SUCCESS ? (
                <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                  {result}
                </div>
              ) : status === ProcessingState.IDLE ? (
                <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                  Waiting for image input...
                </div>
              ) : (
                <div className="text-red-400">Analysis failed. Please try again.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionTool;