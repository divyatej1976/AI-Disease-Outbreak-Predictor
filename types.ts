import type { LucideIcon } from 'lucide-react';

export type AiModel = 'gemini-2.5-flash' | 'gemini-2.5-pro';

export interface Evidence {
  Weather: number;
  PopulationDensity: number;
  Sanitation: number;
  RecentCases: number;
}

export interface Prediction {
  probability: number;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  factors: {
    weather: number;
    density: number;
    sanitation: number;
    cases: number;
  };
}

export interface LiveData {
  city: string;
  country: string;
  weatherCondition: string;
  humidity: number;
  temperature: number;
  todayCases: number;
  population: number;
  provider: string;
}

export interface HistoryEntry {
  timestamp: string;
  probability: number;
  evidence: Evidence;
}

export interface RiskAnalysis {
  summary: string;
  keyDrivers: Array<{ factor: string; rationale: string; }>;
  mitigationStrategies: string[];
}


export enum Tab {
  Predict = 'predict',
  Analysis = 'analysis',
}

export interface TabItem {
  id: Tab;
  label: string;
  // FIX: Replaced 'Icon' with 'LucideIcon' to resolve a TypeScript error where 'Icon' was being interpreted as a value instead of a type.
  icon: LucideIcon;
}