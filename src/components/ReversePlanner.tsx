import React, { useState } from 'react';
import { AcademicInput, UniversityConfig, HistoricalMeritRecord } from '../engine/types';
import { solveRequiredTestScore } from '../engine/reverse';
import { Target } from 'lucide-react';

interface ReversePlannerProps {
  input: AcademicInput;
  universities: UniversityConfig[];
  historicalMerits: HistoricalMeritRecord[];
  selectedUniId?: string;
  defaultCutoff?: number;
  showRomanUrdu: boolean;
}

export const ReversePlanner: React.FC<ReversePlannerProps> = ({
  input,
  universities,
  historicalMerits,
  selectedUniId,
  defaultCutoff,
  showRomanUrdu,
}) => {
  const [activeUniId, setActiveUniId] = useState<string>(selectedUniId || 'fast_cs');
  const [customTarget, setCustomTarget] = useState<number>(defaultCutoff || 75.0);
  const [solveForSat, setSolveForSat] = useState<boolean>(input.useSat);

  const selectedUni = universities.find((u) => u.id === activeUniId) || universities[0];

  // Curated cutoff recommendations for this university
  const cutoffsForUni = historicalMerits.filter(
    (h) => h.universityId === activeUniId && typeof h.closingAggregate === 'number' && (h.year === 2024 || h.year === 2025)
  );

  // Compute required score
  const result = solveRequiredTestScore(input, selectedUni, customTarget, solveForSat);

  return (
    <div id="reverse-planner" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Reverse Target Score Solver ("What score do I need?")
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pick your target aggregate or dream program cutoff to calculate the exact test score required to get in.
          </p>
        </div>

        {selectedUni.satSupported && (
          <div className="flex rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSolveForSat(false)}
              className={`px-3 py-1 rounded-md transition-all ${
                !solveForSat
                  ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Solve for {selectedUni.testName}
            </button>
            <button
              type="button"
              onClick={() => setSolveForSat(true)}
              className={`px-3 py-1 rounded-md transition-all ${
                solveForSat
                  ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Solve for SAT (1600)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1: Select University */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            1. Select Target University
          </label>
          <select
            value={activeUniId}
            onChange={(e) => setActiveUniId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-zinc-400">
            Formula: {selectedUni.formulaDisplay}
          </p>
        </div>

        {/* Step 2: Set Target Aggregate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              2. Target Aggregate Cutoff (%)
            </label>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
              {customTarget.toFixed(2)}%
            </span>
          </div>

          <input
            type="number"
            step="0.05"
            min={40}
            max={100}
            value={customTarget || ''}
            onChange={(e) => setCustomTarget(Math.min(100, Math.max(0, Number(e.target.value))))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />

          {/* Quick preset chips */}
          {cutoffsForUni.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cutoffsForUni.slice(0, 3).map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCustomTarget(c.closingAggregate!)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  {c.discipline} ({c.closingAggregate}%)
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 3: Solved Output Card */}
        <div className="p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Required Score
              </span>
              {result.status === 'achievable' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ACHIEVABLE
                </span>
              )}
              {result.status === 'already_achieved' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  SAFE ALREADY
                </span>
              )}
              {result.status === 'impossible' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                  UNACHIEVABLE
                </span>
              )}
            </div>

            <div className="my-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white tabular-nums">
                {result.targetScore}
              </span>
              <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
                {' '}
                / {result.maxScore} marks
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {result.message}
            </p>
          </div>

          {showRomanUrdu && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 pt-2 border-t border-zinc-200 dark:border-zinc-700 mt-2">
              💡 Yeh target hasil karne ke liye entry test ki targeted preparation karein.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
