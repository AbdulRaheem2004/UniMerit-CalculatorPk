import React from 'react';
import { X, ShieldCheck, ExternalLink, BookCheck, Info, CheckCircle2 } from 'lucide-react';
import { UniversityConfig } from '../engine/types';

interface SourceAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  universities: UniversityConfig[];
  activeUniId?: string;
}

export const SourceAuditModal: React.FC<SourceAuditModalProps> = ({
  isOpen,
  onClose,
  universities,
  activeUniId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Official Formulas & University Admissions Portals
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                100% authenticated criteria verified against published university prospectuses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-start space-x-2 text-teal-900 dark:text-teal-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
            <p>
              Every formula below corresponds directly to the official admission prospectus of each institution, verified and updated till date for the <strong>2025/2026 admissions cycle</strong>. NUST operates a strict 0% gap year deduction policy. Click <strong>"Official Admissions Portal"</strong> on any university to view the live university website and apply.
            </p>
          </div>

          <div className="space-y-3">
            {universities.map((uni) => (
              <div
                key={uni.id}
                className={`p-3.5 rounded-xl border ${
                  activeUniId === uni.id
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40'
                } space-y-2`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <BookCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">
                      {uni.name}
                    </span>
                  </div>
                  <a
                    href={uni.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors self-start sm:self-auto shadow-xs"
                  >
                    <span>Official Admissions Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 font-mono text-[11px] text-zinc-800 dark:text-zinc-200">
                  <span className="text-zinc-400 font-sans block text-[10px] uppercase font-bold">Calculation Formula:</span>
                  {uni.formulaDisplay}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Academic Eligibility: Min <strong>{uni.eligibilityMinAcademicPct}%</strong> in FSc/Matric</span>
                  </div>
                  <div>
                    {uni.satSupported ? (
                      <span className="text-teal-700 dark:text-teal-300">
                        ✓ Digital SAT Accepted ({uni.satMinScore ? `Min ${uni.satMinScore}/1600` : '1600 scale'})
                      </span>
                    ) : (
                      <span className="text-zinc-400">
                        ✗ Digital SAT not accepted for domestic seats
                      </span>
                    )}
                  </div>
                </div>

                {uni.notes && (
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                    {uni.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
