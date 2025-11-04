
import React, { useState, useEffect, useCallback } from 'react';
import type { Evidence, Prediction, LiveData, HistoryEntry, TabItem, AiModel, RiskAnalysis } from './types';
import { Tab } from './types';
import { getOutbreakPrediction, getLiveData, getRiskAnalysis } from './services/geminiService';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import PredictionPanel from './components/PredictionPanel';
import AnalysisPanel from './components/AnalysisPanel';
import { Activity, TrendingUp, Brain, Loader2 } from 'lucide-react';
import TabNavigation from './components/TabNavigation';
import PanelLoader from './components/ui/PanelLoader';

const initialEvidence: Evidence = {
  Weather: 2,
  PopulationDensity: 2,
  Sanitation: 1,
  RecentCases: 1
};

const TABS: TabItem[] = [
  { id: Tab.Predict, label: 'Prediction', icon: Activity },
  { id: 'analysis' as Tab, label: 'Analysis', icon: TrendingUp }
];


const App: React.FC = () => {
  const [evidence, setEvidence] = useState<Evidence>(initialEvidence);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [aiModel, setAiModel] = useState<AiModel>('gemini-2.5-flash');
  
  const [loading, setLoading] = useState<{ predict: boolean; live: boolean; analysis: boolean }>({ predict: true, live: false, analysis: true });
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Predict);
  const [cityInput, setCityInput] = useState('Delhi');
  const [countryInput, setCountryInput] = useState('India');

  const handlePredict = useCallback(async (currentEvidence: Evidence, model: AiModel) => {
    setLoading(prev => ({ ...prev, predict: true, analysis: true }));
    setError(null);
    try {
      const result = await getOutbreakPrediction(currentEvidence, model);
      setPrediction(result);
      
      const newEntry: HistoryEntry = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        probability: result.probability,
        evidence: { ...currentEvidence }
      };
      setHistory(prev => [...prev.slice(-9), newEntry]);

      // Fetch analysis after getting prediction
      const analysisResult = await getRiskAnalysis(result, currentEvidence, model);
      setAnalysis(analysisResult);

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setPrediction(null);
      setAnalysis(null);
    } finally {
      setLoading(prev => ({ ...prev, predict: false, analysis: false }));
    }
  }, []);

  useEffect(() => {
    handlePredict(evidence, aiModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Re-run prediction when model changes
    if(prediction) {
        handlePredict(evidence, aiModel);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiModel]);

  const handleLiveData = async () => {
    setLoading(prev => ({ ...prev, live: true }));
    setError(null);
    try {
      const result = await getLiveData(cityInput, countryInput, aiModel);
      setLiveData(result);
      
      // More nuanced weather mapping
      const condition = result.weatherCondition.toLowerCase();
      const newWeather = (condition.includes('rain') || condition.includes('storm')) ? 3 // Adverse
        : (result.humidity > 75 || result.temperature > 30) ? 2 // Humid
        : (result.humidity < 40 && result.temperature > 10 && result.temperature < 25 && (condition.includes('clear') || condition.includes('sunny'))) ? 0 // Clear
        : 1; // Mild

      // Map live data to evidence scale
      const newEvidence: Evidence = {
        Weather: newWeather,
        PopulationDensity: result.population > 20000000 ? 3 : result.population > 5000000 ? 2 : 1,
        Sanitation: 1, // Defaulting as this is hard to get from live data
        RecentCases: result.todayCases > 5000 ? 3 : result.todayCases > 1000 ? 2 : result.todayCases > 100 ? 1 : 0
      };
      setEvidence(newEvidence);
      await handlePredict(newEvidence, aiModel); // Run prediction with new evidence
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(prev => ({ ...prev, live: false }));
    }
  };

  const evidenceLabels = {
    Weather: ['Clear', 'Mild', 'Humid', 'Adverse'],
    PopulationDensity: ['Low', 'Medium', 'High', 'Very High'],
    Sanitation: ['Poor', 'Moderate', 'Good'],
    RecentCases: ['< 100', '101 - 1k', '1k - 5k', '> 5k']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />
        <TabNavigation tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg my-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <ControlsPanel
              evidence={evidence}
              setEvidence={setEvidence}
              onPredict={() => handlePredict(evidence, aiModel)}
              loading={loading.predict}
              evidenceLabels={evidenceLabels}
              city={cityInput}
              setCity={setCityInput}
              country={countryInput}
              setCountry={setCountryInput}
              onFetchLive={handleLiveData}
              loadingLive={loading.live}
              liveData={liveData}
              aiModel={aiModel}
              setAiModel={setAiModel}
            />
          </div>

          <div className="lg:col-span-2">
            {activeTab === Tab.Predict && (
              loading.predict ? (
                <PanelLoader 
                  icon={<Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />}
                  text="AI is analyzing the data..."
                />
              ) : prediction && <PredictionPanel prediction={prediction} />
            )}
            {activeTab === Tab.Analysis && (
              loading.analysis ? (
                <PanelLoader
                  icon={<Brain className="w-12 h-12 text-purple-400 animate-pulse mx-auto" />}
                  text="Generating AI-powered analysis..."
                />
              ) : prediction && analysis && <AnalysisPanel prediction={prediction} evidence={evidence} history={history} analysis={analysis} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
