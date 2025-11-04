
import { GoogleGenAI, Type } from "@google/genai";
import type { Evidence, Prediction, RiskAnalysis } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || " " });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    probability: {
      type: Type.NUMBER,
      description: "A value between 0.0 and 1.0 representing the outbreak probability.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "A value between 0.8 and 1.0 representing the model's confidence in its prediction.",
    },
    riskLevel: {
      type: Type.STRING,
      description: "A categorical risk level: 'Low', 'Medium', or 'High'. This is based on the probability.",
    },
    factors: {
      type: Type.OBJECT,
      properties: {
        weather: { type: Type.NUMBER, description: "A numerical score from 0-100 for weather's contribution." },
        density: { type: Type.NUMBER, description: "A numerical score from 0-100 for population density's contribution." },
        sanitation: { type: Type.NUMBER, description: "A numerical score from 0-100 for sanitation's contribution." },
        cases: { type: Type.NUMBER, description: "A numerical score from 0-100 for recent cases' contribution." },
      },
      required: ["weather", "density", "sanitation", "cases"],
    },
  },
  required: ["probability", "confidence", "riskLevel", "factors"],
};

const liveDataSchema = {
    type: Type.OBJECT,
    properties: {
        city: { type: Type.STRING },
        country: { type: Type.STRING },
        weatherCondition: { type: Type.STRING, description: "e.g., 'Humid and Overcast'" },
        humidity: { type: Type.INTEGER, description: "Percentage value from 0 to 100." },
        temperature: { type: Type.INTEGER, description: "Temperature in Celsius." },
        todayCases: { type: Type.INTEGER, description: "Number of new cases today." },
        population: { type: Type.INTEGER, description: "Total population of the city." },
        provider: { type: Type.STRING, description: "A plausible-sounding data provider name, e.g., 'Global Health Data Network'."}
    },
    required: ["city", "country", "weatherCondition", "humidity", "temperature", "todayCases", "population", "provider"],
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise, 2-3 sentence analysis of the overall situation.",
    },
    keyDrivers: {
      type: Type.ARRAY,
      description: "An array of the top 2 most critical factors driving the risk.",
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: "The name of the risk factor (e.g., 'Recent Cases', 'Population Density')." },
          rationale: { type: Type.STRING, description: "A brief, one-sentence explanation of why this factor is critical in this scenario." }
        },
        required: ["factor", "rationale"]
      }
    },
    mitigationStrategies: {
      type: Type.ARRAY,
      description: "A list of two concrete, actionable mitigation strategies.",
      items: { type: Type.STRING }
    }
  },
  required: ["summary", "keyDrivers", "mitigationStrategies"],
};

const evidenceLabels = {
    Weather: ['Clear', 'Mild', 'Humid', 'Adverse'],
    PopulationDensity: ['Low', 'Medium', 'High', 'Very High'],
    Sanitation: ['Poor', 'Moderate', 'Good'],
    RecentCases: ['< 100', '101 - 1k', '1k - 5k', '> 5k'],
};

export const getOutbreakPrediction = async (evidence: Evidence, model: string): Promise<Prediction> => {
    try {
        const prompt = `
        Act as an expert epidemiologist AI. Using a simulated Bayesian network model, analyze the following evidence to predict a disease outbreak. The evidence values are on a scale, with higher numbers indicating greater risk (except for Sanitation, where lower is worse).
        
        Evidence:
        - Weather Conditions: ${evidence.Weather} (${evidenceLabels.Weather[evidence.Weather]})
        - Population Density: ${evidence.PopulationDensity} (${evidenceLabels.PopulationDensity[evidence.PopulationDensity]})
        - Sanitation Level: ${evidence.Sanitation} (${evidenceLabels.Sanitation[evidence.Sanitation]})
        - Recent Cases: ${evidence.RecentCases} (${evidenceLabels.RecentCases[evidence.RecentCases]})
        
        Provide a detailed risk assessment based on these factors.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: predictionSchema,
                temperature: 0.3,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as Prediction;
    } catch (error) {
        console.error("Error fetching outbreak prediction:", error);
        throw new Error("Failed to get prediction from AI. Please check your API key and try again.");
    }
};

export const getLiveData = async (city: string, country: string, model: string) => {
    try {
        const prompt = `
        Act as a live environmental and public health data simulation AI. Generate a realistic, plausible data snapshot for the city of ${city}, ${country}.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: liveDataSchema,
                temperature: 0.8,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result;

    } catch (error) {
        console.error("Error fetching live data:", error);
        throw new Error("Failed to get live data from AI. Please check your API key and try again.");
    }
};

export const getRiskAnalysis = async (prediction: Prediction, evidence: Evidence, model: string): Promise<RiskAnalysis> => {
    try {
         const prompt = `
        Act as an expert public health advisor AI. Your response must be a valid JSON object that adheres to the provided schema.
        The current outbreak risk assessment is as follows:
        - Risk Level: ${prediction.riskLevel}
        - Outbreak Probability: ${(prediction.probability * 100).toFixed(1)}%
        
        The primary contributing factors are:
        - Weather: ${evidenceLabels.Weather[evidence.Weather]}
        - Population Density: ${evidenceLabels.PopulationDensity[evidence.PopulationDensity]}
        - Sanitation: ${evidenceLabels.Sanitation[evidence.Sanitation]}
        - Recent Cases: ${evidenceLabels.RecentCases[evidence.RecentCases]}

        Based on this data, provide a structured risk analysis. Identify the top 2 key drivers and suggest two mitigation strategies.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: analysisSchema,
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error fetching risk analysis:", error);
        throw new Error("Failed to get risk analysis from AI.");
    }
};