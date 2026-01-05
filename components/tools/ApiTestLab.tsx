import React, { useState } from 'react';
import { 
  ShieldAlert, Eye, Languages, BrainCircuit, LayoutTemplate, 
  BarChart3, Store, MapPin, Gauge, TrendingUp, Search, 
  Type, FileSpreadsheet, Play, Loader2, CheckCircle2, AlertCircle,
  FlaskConical
} from 'lucide-react';
import { simulateApi, performLiveSearch, performMapsQuery, analyzeImage } from '../../services/geminiService';

interface ApiCardProps {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  defaultInput: string;
  inputType: 'text' | 'image';
  handler: (input: string) => Promise<string>;
}

const ApiTestLab: React.FC = () => {
  // State for each API card to track input and results independently
  const [results, setResults] = useState<Record<string, { status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR', output: string }>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const apiList: ApiCardProps[] = [
    { 
      id: 'webrisk', name: 'Web Risk API', icon: ShieldAlert, description: 'Check URLs for malware or phishing.', 
      defaultInput: 'http://malware.testing.google.test/testing/malware/', inputType: 'text',
      handler: (input) => simulateApi('Web Risk API', input)
    },
    { 
      id: 'vision', name: 'Cloud Vision API', icon: Eye, description: 'Analyze image content and objects.', 
      defaultInput: '', inputType: 'image',
      handler: (input) => {
        // Parse data URL if present to get correct mime type
        let mimeType = 'image/jpeg';
        let base64Data = input;

        if (input.startsWith('data:')) {
          const parts = input.split(',');
          // data:image/png;base64,....
          const match = parts[0].match(/:(.*?);/);
          if (match) {
            mimeType = match[1];
          }
          base64Data = parts[1];
        }
        return analyzeImage(base64Data, mimeType, "Analyze this image.");
      }
    },
    { 
      id: 'translate', name: 'Cloud Translation API', icon: Languages, description: 'Translate text between languages.', 
      defaultInput: 'Hello world, welcome to the cloud.', inputType: 'text',
      handler: (input) => simulateApi('Cloud Translation API', `Translate to Spanish: ${input}`)
    },
    { 
      id: 'nlp', name: 'Cloud Natural Language API', icon: BrainCircuit, description: 'Analyze sentiment and entities.', 
      defaultInput: 'Google Cloud Platform provides reliable infrastructure.', inputType: 'text',
      handler: (input) => simulateApi('Cloud Natural Language API', input)
    },
    { 
      id: 'crux', name: 'Chrome UX Report API', icon: LayoutTemplate, description: 'Get user experience metrics for a URL.', 
      defaultInput: 'https://www.google.com', inputType: 'text',
      handler: (input) => simulateApi('Chrome UX Report API', input)
    },
    { 
      id: 'charts', name: 'Google Charts API', icon: BarChart3, description: 'Generate chart configuration data.', 
      defaultInput: 'Monthly sales data for 2024', inputType: 'text',
      handler: (input) => simulateApi('Google Charts API', input)
    },
    { 
      id: 'business', name: 'Business Profile API', icon: Store, description: 'Manage location performance data.', 
      defaultInput: 'Get performance metrics for "Joe\'s Coffee"', inputType: 'text',
      handler: (input) => simulateApi('Business Profile Performance API', input)
    },
    { 
      id: 'places', name: 'Google Places API (New)', icon: MapPin, description: 'Query place information (Grounding).', 
      defaultInput: 'Coffee shops in downtown Seattle', inputType: 'text',
      handler: (input) => performMapsQuery(input)
    },
    { 
      id: 'pagespeed', name: 'PageSpeed Insights API', icon: Gauge, description: 'Analyze page performance scores.', 
      defaultInput: 'https://example.com', inputType: 'text',
      handler: (input) => simulateApi('PageSpeed Insights API', input)
    },
    { 
      id: 'trends', name: 'Google Trends', icon: TrendingUp, description: 'Analyze search interest over time.', 
      defaultInput: 'Artificial Intelligence interest 2024', inputType: 'text',
      handler: (input) => simulateApi('Google Trends', input)
    },
    { 
      id: 'autocomplete', name: 'Google Autocomplete', icon: Type, description: 'Predict completions for input.', 
      defaultInput: 'How to integ', inputType: 'text',
      handler: (input) => simulateApi('Google Places Autocomplete', input)
    },
    { 
      id: 'search', name: 'Custom Search JSON API', icon: Search, description: 'Search the web (Grounding).', 
      defaultInput: 'Latest updates on Gemini API', inputType: 'text',
      handler: (input) => performLiveSearch(input)
    },
    { 
      id: 'ads', name: 'Google Ads Editor', icon: FileSpreadsheet, description: 'Generate CSV format for Ads.', 
      defaultInput: 'Campaign for Summer Sale 2025', inputType: 'text',
      handler: (input) => simulateApi('Google Ads Editor (CSV Export)', input)
    },
    { 
      id: 'qa', name: 'My Business Q&A API', icon: Store, description: 'Answer customer questions.', 
      defaultInput: 'What are your opening hours?', inputType: 'text',
      handler: (input) => simulateApi('My Business Q&A API', input)
    }
  ];

  const handleRunTest = async (apiId: string, handler: (i: string) => Promise<string>, defaultVal: string) => {
    const inputVal = inputs[apiId] ?? defaultVal;
    if (!inputVal && apiId !== 'vision') return; // Vision can start empty to trigger upload prompt if needed, but handled below

    setResults(prev => ({ ...prev, [apiId]: { status: 'LOADING', output: '' } }));
    
    try {
      const output = await handler(inputVal);
      setResults(prev => ({ ...prev, [apiId]: { status: 'SUCCESS', output } }));
    } catch (error) {
      setResults(prev => ({ ...prev, [apiId]: { status: 'ERROR', output: 'API Request Failed' } }));
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store full Data URL so we preserve mime type info
        handleInputChange(id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             <FlaskConical className="text-blue-500 w-8 h-8" /> API Test Lab
          </h1>
          <p className="text-slate-400">
            Unified console to test all installed Google Cloud APIs.
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {apiList.map((api) => {
             const result = results[api.id];
             const currentInput = inputs[api.id] ?? api.defaultInput;
             const isImage = api.inputType === 'image';

             return (
                <div key={api.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col hover:border-slate-700 transition-colors">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-slate-900 rounded-lg">
                         <api.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-slate-200">{api.name}</h3>
                   </div>
                   
                   <p className="text-xs text-slate-500 mb-4 h-8">{api.description}</p>

                   <div className="mb-4 flex-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Input {isImage ? '(Upload)' : '(Text/URL)'}</label>
                      {isImage ? (
                        <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center cursor-pointer hover:bg-slate-900">
                           <input type="file" onChange={(e) => handleFileUpload(api.id, e)} className="hidden" id={`file-${api.id}`} />
                           <label htmlFor={`file-${api.id}`} className="cursor-pointer text-xs text-slate-400 flex flex-col items-center">
                              <Eye className="w-4 h-4 mb-1" />
                              {inputs[api.id] ? 'Image Selected' : 'Select Image'}
                           </label>
                        </div>
                      ) : (
                        <input 
                           type="text" 
                           value={currentInput}
                           onChange={(e) => handleInputChange(api.id, e.target.value)}
                           className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      )}
                   </div>

                   {/* Output Section */}
                   {result && (
                      <div className={`mb-4 rounded-lg p-3 text-xs font-mono overflow-auto max-h-32 custom-scrollbar 
                         ${result.status === 'ERROR' ? 'bg-red-950/30 text-red-300 border border-red-900' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                         {result.status === 'LOADING' ? (
                            <div className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Running...</div>
                         ) : (
                            <div className="whitespace-pre-wrap">{result.output}</div>
                         )}
                      </div>
                   )}

                   <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${
                            !result ? 'bg-slate-600' : 
                            result.status === 'LOADING' ? 'bg-blue-500 animate-pulse' : 
                            result.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'
                         }`} />
                         <span className="text-xs text-slate-400">
                            {!result ? 'Ready' : result.status}
                         </span>
                      </div>
                      <button 
                         onClick={() => handleRunTest(api.id, api.handler, api.defaultInput)}
                         disabled={result?.status === 'LOADING'}
                         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                      >
                         <Play className="w-3 h-3" /> Run Test
                      </button>
                   </div>
                </div>
             );
          })}
       </div>
    </div>
  );
};

export default ApiTestLab;