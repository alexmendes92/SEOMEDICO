import React from 'react';
import { LayoutDashboard, Eye, Languages, Briefcase, BarChart3, Cloud, FlaskConical, SearchCheck } from 'lucide-react';
import { ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelect }) => {
  const menuItems = [
    { id: ToolType.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    { id: ToolType.SITE_AUDITOR, label: 'Site Auditor', icon: SearchCheck },
    { id: ToolType.TEST_LAB, label: 'API Test Lab', icon: FlaskConical },
    { id: ToolType.VISION, label: 'Vision AI', icon: Eye },
    { id: ToolType.LANGUAGE, label: 'Language Lab', icon: Languages },
    { id: ToolType.BUSINESS, label: 'Business Suite', icon: Briefcase },
    { id: ToolType.MARKET, label: 'Market Insights', icon: BarChart3 },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-10 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
        <Cloud className="w-8 h-8 text-blue-500" />
        <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-white">OmniCloud</span>
      </div>
      
      <nav className="flex-1 py-6 space-y-2 px-2 lg:px-4">
        {menuItems.map((item) => {
          const isActive = activeTool === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-lg transition-colors group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="hidden lg:block ml-3 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 hidden lg:block">
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm text-slate-300">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
