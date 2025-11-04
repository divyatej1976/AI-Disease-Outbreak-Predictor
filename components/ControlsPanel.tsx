
import React from 'react';
import type { Evidence, LiveData, AiModel } from '../types';
import { Activity, Brain, Cloud, Users, Droplets, TrendingUp, Globe, Loader2, Info, Zap } from 'lucide-react';
import Card from './ui/Card';

interface ControlsPanelProps {
  evidence: Evidence;
  setEvidence: React.Dispatch<React.SetStateAction<Evidence>>;
  onPredict: () => void;
  loading: boolean;
  evidenceLabels: { [key: string]: string[] };
  city: string;
  setCity: (city: string) => void;
  country: string;
  setCountry: (country: string) => void;
  onFetchLive: () => void;
  loadingLive: boolean;
  liveData: LiveData | null;
  aiModel: AiModel;
  setAiModel: (model: AiModel) => void;
}

const SliderInput: React.FC<{
  label: string; 
  icon: React.ReactNode; 
  value: number; 
  max: number; 
  labels: string[]; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string;
}> = ({label, icon, value, max, labels, onChange, tooltip}) => (
    <div>
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                {icon}
                {label}
                {tooltip && (
                    <div className="relative group flex items-center">
                        <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-950 text-slate-300 text-xs text-left rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
                            {tooltip}
                        </div>
                    </div>
                )}
            </label>
            <span className="text-sm text-purple-400 font-semibold">{labels[value]}</span>
        </div>
        <input type="range" min="0" max={max} value={value} onChange={onChange} className="w-full" />
    </div>
);

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  evidence, setEvidence, onPredict, loading, evidenceLabels,
  city, setCity, country, setCountry, onFetchLive, loadingLive, liveData,
  aiModel, setAiModel
}) => {
  const caseTooltipText = "This model simulates a generic communicable disease. 'Cases' refers to new infections of this hypothetical illness, allowing the AI to assess risk based on epidemiological principles.";

  return (
    <div className="space-y-6">
       <Card title="Cloud AI Configuration" icon={<Brain className="w-5 h-5 text-purple-400" />} subtitle="Select the AI model for analysis. 'Pro' offers deeper insights but is slower.">
          <div className="flex bg-slate-700/80 rounded-lg p-1">
              <button 
                onClick={() => setAiModel('gemini-2.5-flash')} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all text-sm font-semibold ${aiModel === 'gemini-2.5-flash' ? 'bg-purple-600 shadow-md shadow-purple-500/50 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
              >
                  <Activity className="w-4 h-4" /> Flash Model
              </button>
              <button 
                onClick={() => setAiModel('gemini-2.5-pro')} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all text-sm font-semibold ${aiModel === 'gemini-2.5-pro' ? 'bg-purple-600 shadow-md shadow-purple-500/50 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
              >
                  <Zap className="w-4 h-4" /> Pro Model
              </button>
          </div>
      </Card>
      
      <Card title="Location Data" icon={<Globe className="w-5 h-5 text-purple-400" />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">City</label>
            <input
              type="text" value={city} onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/80 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Country</label>
            <input
              type="text" value={country} onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/80 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>
          <button onClick={onFetchLive} disabled={loadingLive || loading} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loadingLive ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
            Fetch Live Data
          </button>
        </div>
        {liveData && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-xs font-semibold text-green-400 text-center">Data Provider: {liveData.provider}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Weather:</span><span className="font-semibold">{liveData.weatherCondition}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Temp / Humidity:</span><span className="font-semibold">{liveData.temperature}°C / {liveData.humidity}%</span></div>
                <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                        Today's Cases
                        <div className="relative group flex items-center">
                            <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-950 text-slate-300 text-xs text-left rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
                                {caseTooltipText}
                            </div>
                        </div>
                    </span>
                    <span className="font-semibold">{liveData.todayCases.toLocaleString()}</span>
                </div>
                <div className="flex justify-between"><span className="text-slate-400">Population:</span><span className="font-semibold">{(liveData.population / 1000000).toFixed(1)}M</span></div>
            </div>
          </div>
        )}
      </Card>

      <Card title="Risk Factors" icon={<Activity className="w-5 h-5 text-purple-400" />} subtitle="Factors simulated from Big Data Analytics of health and environmental data.">
        <div className="space-y-6">
          <SliderInput label="Weather Conditions" icon={<Cloud className="w-4 h-4 text-blue-400" />} value={evidence.Weather} max={3} labels={evidenceLabels.Weather} onChange={(e) => setEvidence({...evidence, Weather: parseInt(e.target.value)})} />
          <SliderInput label="Population Density" icon={<Users className="w-4 h-4 text-green-400" />} value={evidence.PopulationDensity} max={3} labels={evidenceLabels.PopulationDensity} onChange={(e) => setEvidence({...evidence, PopulationDensity: parseInt(e.target.value)})} />
          <SliderInput label="Sanitation Level" icon={<Droplets className="w-4 h-4 text-cyan-400" />} value={evidence.Sanitation} max={2} labels={evidenceLabels.Sanitation} onChange={(e) => setEvidence({...evidence, Sanitation: parseInt(e.target.value)})} />
          <SliderInput 
            label="Recent Cases" 
            icon={<TrendingUp className="w-4 h-4 text-red-400" />} 
            value={evidence.RecentCases} 
            max={3} 
            labels={evidenceLabels.RecentCases} 
            onChange={(e) => setEvidence({...evidence, RecentCases: parseInt(e.target.value)})}
            tooltip={caseTooltipText}
          />
          
          <button onClick={onPredict} disabled={loading || loadingLive} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            Run Prediction
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ControlsPanel;
