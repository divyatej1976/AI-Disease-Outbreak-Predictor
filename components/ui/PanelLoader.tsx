
import React from 'react';

interface PanelLoaderProps {
  icon: React.ReactNode;
  text: string;
}

const PanelLoader: React.FC<PanelLoaderProps> = ({ icon, text }) => (
  <div className="flex justify-center items-center h-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 min-h-[400px]">
    <div className="text-center">
      {icon}
      <p className="mt-4 text-slate-300">{text}</p>
    </div>
  </div>
);

export default PanelLoader;
