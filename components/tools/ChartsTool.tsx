import React, { useState } from 'react';
import { BarChart3, Search, TrendingUp, Download, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateMarketData } from '../../services/geminiService';
import { ChartDataPoint, ProcessingState } from '../../types';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const ChartsTool: React.FC = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setStatus(ProcessingState.PROCESSING);
    try {
      const result = await generateMarketData(query);
      setData(result.data);
      setSummary(result.summary);
      setStatus(ProcessingState.SUCCESS);
    } catch (e) {
      setStatus(ProcessingState.ERROR);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="text-emerald-500" /> Market Insights & Charts
        </h2>
        <p className="text-slate-400 mb-6">
          Simulate Google Trends, Google Ads data, and Business Performance metrics using generative AI.
        </p>

        {/* Search Bar */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="E.g., 'EV sales growth by region 2024' or 'Coffee shop daily footfall'"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={status === ProcessingState.PROCESSING || !query}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {status === ProcessingState.PROCESSING ? <Loader2 className="animate-spin" /> : <TrendingUp />}
            Generate Report
          </button>
        </div>

        {/* Content Area */}
        {status === ProcessingState.SUCCESS && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6 h-[400px]">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Data Visualization</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#cbd5e1' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">AI Summary</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                {summary}
              </p>
              
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Key Metrics</h4>
              <div className="space-y-3">
                {data.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className="font-mono text-emerald-400">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        )}

        {status === ProcessingState.IDLE && (
           <div className="h-64 flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
             <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
             <p>Enter a query to generate realtime market charts.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default ChartsTool;
