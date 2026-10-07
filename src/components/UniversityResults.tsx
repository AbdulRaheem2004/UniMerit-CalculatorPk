import React from 'react';
import { UniversityCalculationResult, HistoricalMeritRecord } from '../engine/types';
import { Award, ArrowUpRight, AlertTriangle, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface UniversityResultsProps {
  results: UniversityCalculationResult[];
  historicalMerits: HistoricalMeritRecord[];
  onSelectForReverse: (uniId: string, cutoffAggregate?: number) => void;
  onOpenAudit: (uniId: string) => void;
  showRomanUrdu: boolean;
}

export const UniversityResults: React.FC<UniversityResultsProps> = ({
  results,
  historicalMerits,
  onSelectForReverse,
  onOpenAudit,
  showRomanUrdu,
}) => {
  // Find latest benchmark for each university (2024 BS CS or key discipline)
  const getLatestCutoff = (uniId: string) => {
    return historicalMerits.find(
      (h) => h.universityId === uniId && (h.year === 2024 || h.year === 2025) && typeof h.closingAggregate === 'number'
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Simultaneous Multi-University Merit Aggregates
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time projection based on verified official admission prospectus formulas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((res) => {
          const uni = res.university;
          const latestCutoffRecord = getLatestCutoff(uni.id);
          const cutoff = latestCutoffRecord?.closingAggregate;

          // Determine Probability Zone against latest cutoff
          let zoneBadge = null;
          if (cutoff) {
            const diff = res.aggregate - cutoff;
            if (diff >= 1.5) {
              zoneBadge = (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Safe Zone (+{diff.toFixed(1)}%)
                </span>
              );
            } else if (diff >= -1.5) {
              zoneBadge = (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Borderline ({diff >= 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`})
                </span>
              );
            } else {
              zoneBadge = (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> High Risk ({diff.toFixed(1)}%)
                </span>
              );
            }
          }

          return (
            <div
              key={uni.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {uni.shortName}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {uni.campuses[0]}
                    </p>
                  </div>
                  {zoneBadge}
                </div>

                {/* Aggregate Display */}
                <div className="my-3 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl flex items-baseline justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Your Aggregate
                  </span>
                  <span className="text-2xl font-extrabold font-mono tracking-tight text-teal-800 dark:text-teal-300 tabular-nums">
                    {res.aggregate > 0 ? `${res.aggregate.toFixed(3)}%` : '—'}
                  </span>
                </div>

                {/* Eligibility Warning */}
                {!res.isEligible && (
                  <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[11px] text-red-700 dark:text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{res.eligibilityMessage}</span>
                  </div>
                )}

                {/* Mathematical Contribution Breakdown */}
                <div className="space-y-1.5 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Matric Contribution:</span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                      {res.breakdown.matricContribution.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>FSc / Inter Contribution:</span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                      {res.breakdown.fscContribution.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      {res.breakdown.testType === 'sat' ? 'Digital SAT (1600):' : 'Entry Test:'}
                    </span>
                    <span className="font-mono font-medium text-teal-700 dark:text-teal-300">
                      {res.breakdown.testContribution.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Benchmark Reference */}
                {cutoff && (
                  <div className="mt-3 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                    <span>2024 Closing Cutoff ({latestCutoffRecord?.discipline}):</span>
                    <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                      {cutoff.toFixed(2)}%
                    </span>
                  </div>
                )}

                {showRomanUrdu && (
                  <p className="mt-2 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                    💡 Target score jannay ke liye 'Solve Target Score' par click karein.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAudit(uni.id)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1"
                  title="View official prospectus formula source"
                >
                  <ExternalLink className="w-3 h-3" />
                  Formula Source
                </button>

                <button
                  type="button"
                  onClick={() => onSelectForReverse(uni.id, cutoff)}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200 flex items-center gap-1"
                >
                  Solve Target Score
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
