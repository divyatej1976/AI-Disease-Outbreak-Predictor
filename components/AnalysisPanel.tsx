
import React from 'react';
import type { Prediction, Evidence, HistoryEntry, RiskAnalysis } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface AnalysisPanelProps {
  prediction: Prediction;
  evidence: Evidence;
  history: HistoryEntry[];
  analysis: RiskAnalysis;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ prediction, evidence, history, analysis }) => {
  
  const radarData = [
    { factor: 'Weather', value: (evidence.Weather / 3) * 100 },
    { factor: 'Density', value: (evidence.PopulationDensity / 3) * 100 },
    { factor: 'Sanitation', value: ((2 - evidence.Sanitation) / 2) * 100 }, // Inverted scale for sanitation
    { factor: 'Cases', value: (evidence.RecentCases / 3) * 100 }
  ];

  return (
    <div className="space-y-6">
       <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
        <h4 className="text-lg font-semibold mb-2">AI-Powered Summary</h4>
        <p className="text-slate-300">{analysis.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-4">
          <h4 className="text-lg font-semibold flex items-center gap-2"><AlertTriangle className="text-amber-400 w-5 h-5"/> Key Risk Drivers</h4>
          {analysis.keyDrivers.map((driver, index) => (
            <div key={index} className="bg-slate-900/50 p-3 rounded-lg">
                <p className="font-semibold text-purple-300">{driver.factor}</p>
                <p className="text-sm text-slate-400">{driver.rationale}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-4">
          <h4 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="text-green-400 w-5 h-5"/> Mitigation Strategies</h4>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            {analysis.mitigationStrategies.map((strat, index) => (
                <li key={index}>{strat}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h4 className="text-lg font-semibold mb-4">Risk Factor Profile</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="factor" stroke="#94a3b8" fontSize={12} />
              <Radar name="Risk Level" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
               <Tooltip
                contentStyle={{ backgroundColor: '#1e2b3b', border: '1px solid #4c1d95', borderRadius: '0.5rem' }}
                formatter={(value: number) => [`${value.toFixed(0)}%`, 'Risk Contribution']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h4 className="text-lg font-semibold mb-4">Prediction History</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #4c1d95', borderRadius: '0.5rem' }}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
              />
              <Area type="monotone" dataKey="probability" stroke="#a855f7" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;