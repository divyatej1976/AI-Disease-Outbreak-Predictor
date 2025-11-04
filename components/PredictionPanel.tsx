import React from "react";
import type { Prediction } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AlertCircle } from "lucide-react";

interface PredictionPanelProps {
  prediction: Prediction | null;
}

const FACTOR_COLORS: Record<string, string> = {
  Weather: "#60a5fa", // blue
  Density: "#f59e0b", // amber
  Sanitation: "#34d399", // green
  Cases: "#f87171", // red
};

const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({
  value,
  duration = 700,
  className,
}) => {
  const [display, setDisplay] = React.useState(0);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const start = performance.now();
    const from = display;
    const to = value;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t; // linear; replace with ease if desired
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <div className={className}>{(display * 100).toFixed(1)}%</div>;
};

const PredictionPanel: React.FC<PredictionPanelProps> = ({ prediction }) => {
  // Defensive guard
  if (!prediction) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center text-slate-400">
        <p className="font-medium">No prediction available.</p>
        <p className="text-sm mt-2">Run the model or fetch live data to see the prediction.</p>
      </div>
    );
  }

  // memoized risk color
  const riskColor = React.useMemo(() => {
    const p = prediction.probability;
    if (p > 0.7) return "#f87171"; // red-400
    if (p > 0.4) return "#fbbf24"; // amber-400
    return "#34d399"; // green-400
  }, [prediction.probability]);

  // Network / factor data (readable names)
  const networkData = React.useMemo(
    () => [
      { name: "Weather", contribution: prediction.factors.weather ?? 0 },
      { name: "Density", contribution: prediction.factors.density ?? 0 },
      { name: "Sanitation", contribution: prediction.factors.sanitation ?? 0 },
      { name: "Cases", contribution: prediction.factors.cases ?? 0 },
    ],
    [prediction.factors]
  );

  // top factor for quick explainability
  const topFactor = React.useMemo(() => {
    const sorted = [...networkData].sort((a, b) => b.contribution - a.contribution);
    const top = sorted[0];
    const total = networkData.reduce((s, n) => s + (n.contribution ?? 0), 0) || 1;
    const pct = ((top.contribution / total) * 100) || 0;
    return { name: top.name, pct: pct.toFixed(0), contribution: top.contribution };
  }, [networkData]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold">Outbreak Risk Assessment</h3>

        <div
          className="px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2 border"
          // light translucent background using inline alpha (keeps Tailwind-free color choice)
          style={{
            backgroundColor: `${riskColor}1A`,
            color: riskColor,
            borderColor: `${riskColor}80`,
          }}
          aria-label={`Risk level: ${prediction.riskLevel}`}
        >
          {prediction.riskLevel} Risk
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-slate-900/50 rounded-lg p-6 text-center"
          aria-labelledby="probability-title"
        >
          <div id="probability-title" className="sr-only">
            Outbreak probability
          </div>
          <div className="text-6xl font-bold mb-2" style={{ color: riskColor }}>
            <AnimatedNumber value={prediction.probability} className="inline-block" />
          </div>
          <div className="text-slate-400 mb-4">Outbreak Probability</div>
          <div
            className="w-full h-3 bg-slate-700 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(prediction.probability * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${prediction.probability * 100}%`, backgroundColor: riskColor }}
            />
          </div>

          {/* Top factor summary */}
          <p className="text-sm text-slate-300 mt-4">
            Top influencing factor:{" "}
            <span className="font-semibold text-slate-100">{topFactor.name}</span>{" "}
            (<span className="text-slate-200 font-medium">{topFactor.pct}%</span>)
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-purple-400" />
          <div className="text-3xl font-bold">{(prediction.confidence * 100).toFixed(1)}%</div>
          <div className="text-slate-400 mb-2">Model Confidence</div>

          {/* Confidence note */}
          {prediction.confidence < 0.85 && (
            <div className="mt-3 text-xs text-amber-200/90 bg-amber-900/20 p-2 rounded-md">
              <strong>Low confidence:</strong> Model confidence is below 85%. Consider verifying input
              data.
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Contributing Factors</h4>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={networkData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              cursor={{ fill: "rgba(139,92,246,0.06)" }}
              contentStyle={{
                backgroundColor: "#0f1724",
                border: "1px solid #4c1d95",
                borderRadius: "0.5rem",
                color: "#e2e8f0",
              }}
              formatter={(value: number) => [`${value}`, "Contribution"]}
              labelFormatter={(label) => `Factor: ${label}`}
            />
            <Bar
              dataKey="contribution"
              name="Contribution Score"
              radius={[6, 6, 0, 0]}
            >
              {networkData.map((entry) => {
                const color = FACTOR_COLORS[entry.name] ?? riskColor;
                // using a Cell per bar allows per-bar color
                return (
                  <Cell
                    key={entry.name}
                    fill={color}
                    style={{ transition: "fill 400ms ease, opacity 400ms ease" }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* small legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {networkData.map((n) => (
            <div key={n.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded"
                style={{ backgroundColor: FACTOR_COLORS[n.name] ?? riskColor }}
                aria-hidden
              />
              <span className="text-slate-300">{n.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionPanel;
