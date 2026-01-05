import React, { useState } from 'react';
import { Languages, MessageSquare, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { processTextAnalysis } from '../../services/geminiService';
import { ProcessingState } from '../../types';

const LanguageTool: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [mode, setMode] = useState<'TRANSLATE' | 'SENTIMENT' | 'QA'>('TRANSLATE');
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);

  const handleAction = async () => {
    if (!inputText.trim()) return;
    setStatus(ProcessingState.PROCESSING);
    try {
      const output = await processTextAnalysis(inputText, mode, targetLang);
      setResult(output);
      setStatus(ProcessingState.SUCCESS);
    } catch (e) {
      setStatus(ProcessingState.ERROR);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Languages className="text-purple-500" /> Language Lab
        </h2>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-950 rounded-lg border border-slate-800 w-fit">
          <button
            onClick={() => setMode('TRANSLATE')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'TRANSLATE' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Translate
          </button>
          <button
            onClick={() => setMode('SENTIMENT')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'SENTIMENT' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            NLP & Sentiment
          </button>
          <button
            onClick={() => setMode('QA')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'QA' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Q&A Bot
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-400">Input Text</label>
              {mode === 'TRANSLATE' && (
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Portuguese">Portuguese</option>
                </select>
              )}
            </div>
            <textarea
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all"
              placeholder={mode === 'TRANSLATE' ? "Enter text to translate..." : "Enter text for analysis..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleAction}
              disabled={status === ProcessingState.PROCESSING || !inputText}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === ProcessingState.PROCESSING ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Run Analysis
                </>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="flex flex-col space-y-4">
            <label className="text-sm font-semibold text-slate-400">AI Output</label>
            <div className="w-full h-64 lg:h-[calc(100%-3rem)] bg-slate-950/50 border border-slate-800 rounded-xl p-6 overflow-y-auto">
              {result ? (
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Result will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageTool;
