import React from 'react';
import { ArrowRight, BrainCircuit, Globe, Zap, ShieldCheck } from 'lucide-react';
import { ToolType } from '../types';

interface DashboardProps {
  onNavigate: (tool: ToolType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const features = [
    {
      title: "Cloud Vision & Risk",
      description: "Analyze images for objects, text (OCR), and safety compliance.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      tool: ToolType.VISION
    },
    {
      title: "Language Intelligence",
      description: "Translation, entity extraction, and sentiment analysis.",
      icon: Globe,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      tool: ToolType.LANGUAGE
    },
    {
      title: "Market Analytics",
      description: "Generate charts, analyze trends, and simulate Ads data.",
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      tool: ToolType.MARKET
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            OmniCloud <span className="text-blue-400">AI Suite</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            A unified interface powered by Gemini 3 Flash to simulate and execute complex Google Cloud API tasks. 
            Access Vision, Translation, NLP, and Business Insights from one dashboard.
          </p>
          <button 
            onClick={() => onNavigate(ToolType.VISION)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
          >
            Start Analyzing <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <BrainCircuit className="absolute right-0 bottom-0 text-slate-800/50 w-96 h-96 -mr-16 -mb-16 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div 
              key={idx}
              onClick={() => onNavigate(feature.tool)}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
              <div className="flex items-center text-sm text-slate-500 group-hover:text-white transition-colors">
                Launch Tool <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <h3 className="font-semibold text-white mb-4">Supported APIs (Simulated)</h3>
           <div className="flex flex-wrap gap-2">
             {["Cloud Vision", "Translation", "Natural Language", "Web Risk", "PageSpeed", "Places", "Charts", "Business Profile"].map(tag => (
               <span key={tag} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                 {tag}
               </span>
             ))}
           </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <h3 className="font-semibold text-white mb-2">System Status</h3>
           <div className="flex justify-between items-center py-2 border-b border-slate-800">
             <span className="text-slate-400 text-sm">Gemini 3 Flash</span>
             <span className="text-emerald-400 text-sm font-mono">Operational</span>
           </div>
           <div className="flex justify-between items-center py-2 border-b border-slate-800">
             <span className="text-slate-400 text-sm">Gemini 2.5 Flash Image</span>
             <span className="text-emerald-400 text-sm font-mono">Operational</span>
           </div>
           <div className="flex justify-between items-center py-2">
             <span className="text-slate-400 text-sm">Latency</span>
             <span className="text-blue-400 text-sm font-mono">~240ms</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
