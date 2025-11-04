
import React from 'react';
import type { TabItem } from '../types';
import type { Tab } from '../types';

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <nav className="flex gap-2 bg-slate-800/50 p-2 rounded-lg backdrop-blur-sm max-w-md mx-auto">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all text-sm font-semibold ${
              activeTab === tab.id
                ? 'bg-purple-600 shadow-lg shadow-purple-500/50 text-white'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default TabNavigation;
