import React, { useState } from 'react';
import { 
  Activity, Search, Stethoscope, AlertOctagon, 
  FileText, Microscope, Syringe, ClipboardCheck,
  HeartPulse, ArrowRight, Loader2, AlertTriangle, Cross
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
    setReport(null);
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
      case 'HEALTHY':
      case 'AUTHORITY':
        return 'text-emerald-400 bg-emerald-950/30 border-emerald-800';
      case 'STABLE':
      case 'PROFESSIONAL':
        return 'text-blue-400 bg-blue-950/30 border-blue-800';
      case 'CRITICAL':
      case 'AMATEUR':
        return 'text-red-400 bg-red-950/30 border-red-800';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
               <Stethoscope className="w-10 h-10 text-emerald-400" />
             </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">OrtoAudit AI</h1>
          <p className="text-slate-400 mb-8 text-lg">
            Diagnóstico Clínico Digital para Ortopedistas. Transforme dados em cirurgias de alto valor.
          </p>
          
          <div className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="www.suaclinica.com.br"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
              />
            </div>
            <button 
              onClick={handleAudit}
              disabled={status === ProcessingState.PROCESSING || !url}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === ProcessingState.PROCESSING ? <Loader2 className="animate-spin" /> : "Diagnosticar"}
            </button>
          </div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
      </div>

      {/* Loading State */}
      {status === ProcessingState.PROCESSING && (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-6 animate-fadeIn">
          <div className="relative">
             <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
             <Activity className="w-16 h-16 text-emerald-500 animate-bounce relative z-10" />
          </div>
          <div className="text-center space-y-2">
             <p className="text-xl font-medium text-slate-200">Realizando Triagem Digital...</p>
             <p className="text-sm text-slate-500">Examinando sinais vitais do site, imunidade (segurança) e mobilidade (velocidade).</p>
          </div>
        </div>
      )}

      {/* Report Dashboard */}
      {status === ProcessingState.SUCCESS && report && (
        <div className="space-y-8 animate-slideUp">
          
          {/* Patient Chart (Summary) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>
            <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded uppercase tracking-wider">Prontuário Digital</span>
                     <span className="text-slate-500 text-xs">{new Date().toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-1">{report.doctorName}</h2>
                  <p className="text-emerald-400 font-medium mb-4">{report.specialty}</p>
                  <p className="text-slate-300 leading-relaxed text-lg border-l-4 border-emerald-500 pl-4 italic">
                    "{report.clinicalSummary}"
                  </p>
               </div>
               
               <div className="flex flex-col items-center justify-center bg-slate-900 rounded-xl p-6 border border-slate-800 min-w-[200px]">
                  <span className="text-sm text-slate-400 mb-2 uppercase font-semibold">Saúde Digital</span>
                  <div className="relative flex items-center justify-center">
                     <HeartPulse className={`w-16 h-16 ${report.overallHealth > 70 ? 'text-emerald-500' : report.overallHealth > 40 ? 'text-yellow-500' : 'text-red-500'} animate-pulse`} />
                     <span className="absolute text-xl font-bold text-white">{report.overallHealth}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                     <div className={`h-full ${report.overallHealth > 70 ? 'bg-emerald-500' : report.overallHealth > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${report.overallHealth}%` }}></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SEÇÃO 1: TRIAGEM */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                     <AlertOctagon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Triagem (Performance)</h3>
               </div>
               
               <div className={`inline-block px-3 py-1 rounded text-xs font-bold mb-4 border ${getStatusColor(report.triage.status)}`}>
                  {report.triage.status}
               </div>
               
               <div className="space-y-4">
                  <div>
                     <p className="text-sm text-slate-400 uppercase font-bold mb-1">Diagnóstico</p>
                     <p className="text-lg text-slate-200 font-semibold">{report.triage.diagnosis}</p>
                  </div>
                  <div>
                     <p className="text-sm text-slate-400 uppercase font-bold mb-1">Observação Clínica</p>
                     <p className="text-slate-300 text-sm leading-relaxed">{report.triage.details}</p>
                  </div>
               </div>
            </div>

            {/* SEÇÃO 2: EXAME DE IMAGEM */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                     <Microscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Exame de Imagem</h3>
               </div>

               <div className={`inline-block px-3 py-1 rounded text-xs font-bold mb-4 border ${getStatusColor(report.imaging.status)}`}>
                  {report.imaging.status}
               </div>

               <div className="space-y-4">
                  <div>
                     <p className="text-sm text-slate-400 uppercase font-bold mb-1">Laudo Visual</p>
                     <p className="text-slate-300 text-sm leading-relaxed">{report.imaging.observation}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {report.imaging.detectedTags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* SEÇÃO 3: COMPETITIVIDADE (MARKET X-RAY) */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                     <Cross className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Raio-X do Território</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                     <p className="text-sm text-slate-400 uppercase font-bold mb-2">Concorrência Ativa</p>
                     <p className="text-slate-300 leading-relaxed text-sm">
                        {report.marketXray.competitorComparison}
                     </p>
                  </div>
                  <div className="bg-red-950/20 p-4 rounded-lg border border-red-900/30">
                     <p className="text-sm text-red-400 uppercase font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Perda de Território
                     </p>
                     <p className="text-slate-300 leading-relaxed text-sm">
                        {report.marketXray.lostTerritory}
                     </p>
                  </div>
               </div>
            </div>

            {/* SEÇÃO 4: PRESCRIÇÃO */}
            <div className="md:col-span-2 bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                     <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">A Prescrição</h3>
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800">
                     <p className="text-sm text-emerald-400 uppercase font-bold mb-2 flex items-center gap-2">
                        <Syringe className="w-4 h-4" /> Intervenção Imediata
                     </p>
                     <p className="text-white text-lg font-medium">{report.prescription.immediateAction}</p>
                  </div>

                  <div>
                     <p className="text-sm text-slate-400 uppercase font-bold mb-3">Protocolo de Atração (Ads Headlines)</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {report.prescription.adHeadlines.map((ad, idx) => (
                           <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-700 text-sm text-blue-300 font-medium hover:border-blue-500 transition-colors cursor-default">
                              "{ad}"
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-emerald-900/30 text-center">
                     <p className="text-xl text-slate-200 italic font-serif">
                        "{report.prescription.prognosis}"
                     </p>
                     <button className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-900/50 transition-all flex items-center gap-2 mx-auto">
                        Agendar Cirurgia Digital <ArrowRight className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SiteAuditor;