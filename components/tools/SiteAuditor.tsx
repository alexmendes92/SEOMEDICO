import React, { useState } from 'react';
import { 
  Search, Globe, Shield, Smartphone, Zap, 
  Layout, Code2, Users, PieChart, BadgeCheck, 
  AlertTriangle, CheckCircle, XCircle, ArrowRight, Loader2
} from 'lucide-react';
import { generateSiteAudit } from '../../services/geminiService';
import { AuditReport, ProcessingState } from '../../types';

const SiteAuditor: React.FC = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [report, setReport] = useState<AuditReport | null>(null);

  const handleAudit = async () => {
    if (!url) return;
    setStatus(ProcessingState.PROCESSING);
    setReport(null); // Clear previous result
    try {
      const data = await generateSiteAudit(url);
      setReport(data);
      setStatus(ProcessingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(ProcessingState.ERROR);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Good': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Fair': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Poor': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getIconForTitle = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('seo')) return <Search className="w-5 h-5" />;
    if (t.includes('performance')) return <Zap className="w-5 h-5" />;
    if (t.includes('mobile')) return <Smartphone className="w-5 h-5" />;
    if (t.includes('access')) return <Users className="w-5 h-5" />;
    if (t.includes('ui') || t.includes('design')) return <Layout className="w-5 h-5" />;
    if (t.includes('security')) return <Shield className="w-5 h-5" />;
    if (t.includes('tech')) return <Code2 className="w-5 h-5" />;
    if (t.includes('market') || t.includes('competitor')) return <PieChart className="w-5 h-5" />;
    if (t.includes('social')) return <Globe className="w-5 h-5" />;
    return <BadgeCheck className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">OmniCloud Site Auditor</h1>
          <p className="text-slate-400 mb-8">
            Enter a URL to generate a 360° technical and business analysis report covering SEO, performance, security, and more.
          </p>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="https://example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
              />
            </div>
            <button 
              onClick={handleAudit}
              disabled={status === ProcessingState.PROCESSING || !url}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === ProcessingState.PROCESSING ? <Loader2 className="animate-spin" /> : "Run Audit"}
            </button>
          </div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      </div>

      {/* Loading State */}
      {status === ProcessingState.PROCESSING && (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-4 animate-fadeIn">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-lg font-medium text-slate-300">Crawling and Analyzing Site Architecture...</p>
          <div className="flex gap-2 text-xs text-slate-500">
            <span>• SEO Check</span>
            <span>• Security Scan</span>
            <span>• Market Analysis</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === ProcessingState.ERROR && (
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center text-red-300">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold">Audit Failed</h3>
          <p className="text-sm opacity-80">Could not analyze the requested URL. Please check the address and try again.</p>
        </div>
      )}

      {/* Report Dashboard */}
      {status === ProcessingState.SUCCESS && report && (
        <div className="space-y-6 animate-slideUp">
          {/* Executive Summary Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="64" cy="64" r="60" 
                  stroke={report.overallScore > 80 ? '#10b981' : report.overallScore > 50 ? '#f59e0b' : '#ef4444'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 60} 
                  strokeDashoffset={2 * Math.PI * 60 * (1 - report.overallScore / 100)} 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-bold text-white">{report.overallScore}</span>
                <span className="block text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{report.domain} <span className="text-slate-500 font-normal text-base">Audit Report</span></h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-4">{report.summary}</p>
              <div className="flex gap-4">
                 <div className="px-3 py-1 bg-slate-900 rounded border border-slate-800 text-xs text-slate-400">
                    Generated via OmniCloud Crawler
                 </div>
                 <div className="px-3 py-1 bg-slate-900 rounded border border-slate-800 text-xs text-slate-400">
                    {new Date().toLocaleDateString()}
                 </div>
              </div>
            </div>
          </div>

          {/* 12 Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {report.resources.map((resource, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all hover:shadow-lg group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors text-slate-300`}>
                      {getIconForTitle(resource.title)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm">{resource.title}</h3>
                      <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded border ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-200">{resource.score}</span>
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-400 h-10 line-clamp-2 leading-relaxed">
                    {resource.details}
                  </p>
                  
                  <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
                    <div className="flex items-start gap-2">
                       <ArrowRight className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                       <p className="text-xs text-slate-300 italic">
                         <span className="font-semibold text-blue-400">Fix:</span> {resource.recommendation}
                       </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      resource.score > 80 ? 'bg-emerald-500' : resource.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${resource.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteAuditor;
