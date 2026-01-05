import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VisionTool from './components/tools/VisionTool';
import LanguageTool from './components/tools/LanguageTool';
import ChartsTool from './components/tools/ChartsTool';
import ApiTestLab from './components/tools/ApiTestLab';
import SiteAuditor from './components/tools/SiteAuditor';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.DASHBOARD:
        return <Dashboard onNavigate={setActiveTool} />;
      case ToolType.TEST_LAB:
        return <ApiTestLab />;
      case ToolType.SITE_AUDITOR:
        return <SiteAuditor />;
      case ToolType.VISION:
        return <VisionTool />;
      case ToolType.LANGUAGE:
        return <LanguageTool />;
      case ToolType.BUSINESS: 
      case ToolType.MARKET:
        return <ChartsTool />;
      default:
        return <Dashboard onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      <Sidebar activeTool={activeTool} onSelect={setActiveTool} />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
