import React, { useState } from 'react';
import { UniversityCalculationResult, DisciplineCategory } from '../engine/types';
import { Award, ArrowUpRight, AlertTriangle, ExternalLink, MapPin, Building2, Calculator, CheckCircle2, Target } from 'lucide-react';
import { NustFieldsModal } from './NustFieldsModal';

interface UniversityResultsProps {
  results: UniversityCalculationResult[];
  selectedDisciplineCategory: DisciplineCategory | 'all';
  onSelectForReverse: (uniId: string, targetAggregate?: number) => void;
  onOpenAudit: (uniId: string) => void;
  showRomanUrdu: boolean;
}

export const UniversityResults: React.FC<UniversityResultsProps> = ({
  results,
  selectedDisciplineCategory,
  onSelectForReverse,
  onOpenAudit,
  showRomanUrdu,
}) => {
  // Store selected campus per university ID
  const [selectedCampusMap, setSelectedCampusMap] = useState<Record<string, string>>({});
  // Optional global campus filter
  const [globalCampusFilter, setGlobalCampusFilter] = useState<string>('all');
  // State for NUST Fields Detailed Modal
  const [isNustModalOpen, setIsNustModalOpen] = useState<boolean>(false);

  const handleSelectCampus = (uniId: string, campus: string) => {
    setSelectedCampusMap((prev) => ({
      ...prev,
      [uniId]: campus,
    }));
  };

  const handleGlobalCampusChange = (campus: string) => {
    setGlobalCampusFilter(campus);
    if (campus === 'all') return;
    
    // Auto-select matching campus for each university if it exists
    const newMap: Record<string, string> = { ...selectedCampusMap };
    results.forEach((res) => {
      const match = res.university.campuses.find((c) =>
        c.toLowerCase().includes(campus.toLowerCase())
      );
      if (match) {
        newMap[res.university.id] = match;
      }
    });
    setSelectedCampusMap(newMap);
  };

  // Filter universities based on selected discipline category
  // Multi-discipline universities appear in all groups they offer
  const filteredResults = results.filter((res) => {
    const uni = res.university;
    if (selectedDisciplineCategory === 'all') return true;

    // Check if the university supports the chosen category
    if (uni.categories && uni.categories.includes(selectedDisciplineCategory)) {
      return true;
    }
    return uni.disciplineCategory === selectedDisciplineCategory;
  });

  const nustResult = results.find((r) => r.university.id === 'nust') || results.find((r) => r.university.id.startsWith('nust'));

  return (
    <div className="space-y-4">
      {/* Top Header & Campus Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Simultaneous Multi-University Merit Aggregates
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Computed in real-time using official university admission criteria and weighted formulas.
            <span className="ml-1 text-teal-700 dark:text-teal-400 font-medium">
              (Green <span className="underline font-bold">Eligible</span> indicates you meet the minimum legal criteria to apply; your aggregate determines merit rank).
            </span>
          </p>
        </div>

        {/* Global Campus Quick Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" /> Quick Campus:
          </span>
          {[
            { id: 'all', label: 'All Campuses' },
            { id: 'Islamabad', label: 'Islamabad' },
            { id: 'Lahore', label: 'Lahore' },
            { id: 'Karachi', label: 'Karachi' },
            { id: 'Peshawar', label: 'Peshawar' },
            { id: 'Faisalabad', label: 'CFD/Fsd' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleGlobalCampusChange(c.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                globalCampusFilter === c.id
                  ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 font-semibold shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* University Result Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((res) => {
          const uni = res.university;
          const isNust = uni.id === 'nust';
          const currentCampus = selectedCampusMap[uni.id] || uni.campuses[0];

          return (
            <div
              key={uni.id}
              className={`bg-white dark:bg-zinc-900 border ${
                isNust
                  ? 'border-teal-500/80 dark:border-teal-500/60 ring-2 ring-teal-500/10'
                  : 'border-zinc-200 dark:border-zinc-800'
              } rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-teal-400 dark:hover:border-teal-600 transition-all group`}
            >
              <div>
                {/* Header with Title & Eligibility Tag */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {uni.shortName}
                      </h3>
                      {uni.disciplineCategory === 'medical' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase">
                          Medical
                        </span>
                      )}
                      {isNust && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 uppercase">
                          NUST Hub
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 capitalize">
                      {isNust
                        ? 'SEECS, SMME, NICE, NBS, EME, CAE'
                        : `${uni.disciplineCategory} Stream • ${uni.disciplines.slice(0, 3).join(', ')}`}
                    </p>
                  </div>

                  {res.isEligible ? (
                    <span
                      title="Eligible: You satisfy the mandatory minimum legal requirements (PMDC, PEC, or University academic & test cutoffs) to be admitted. Your aggregate determines your rank on the merit list."
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 flex items-center gap-1 shrink-0 cursor-help"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Eligible
                    </span>
                  ) : (
                    <span
                      title={`Ineligible: You do not satisfy the minimum criteria (${res.eligibilityMessage || 'below minimum threshold'}). You cannot be considered regardless of merit.`}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 flex items-center gap-1 shrink-0 cursor-help"
                    >
                      <AlertTriangle className="w-3 h-3" /> Ineligible
                    </span>
                  )}
                </div>

                {/* NUST Multi-Field Info Indicator */}
                {isNust && (
                  <div
                    onClick={() => setIsNustModalOpen(true)}
                    className="my-2.5 p-2.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-teal-900 dark:text-teal-200 hover:bg-teal-100/80 dark:hover:bg-teal-900/40 cursor-pointer transition-all flex items-center justify-between text-xs font-semibold shadow-xs group/nust"
                  >
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Explore 20+ NUST Engineering, CS & Business Fields</span>
                    </span>
                    <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 font-bold">
                      Open Fields <ArrowUpRight className="w-3 h-3 group-hover/nust:translate-x-0.5 group-hover/nust:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                )}

                {/* Campus Selector Pills for Non-NUST Multi-Campus Universities */}
                {!isNust && uni.campuses.length > 1 && (
                  <div className="my-2.5">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" /> Select Campus:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {uni.campuses.map((campus) => (
                        <button
                          key={campus}
                          type="button"
                          onClick={() => handleSelectCampus(uni.id, campus)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            currentCampus === campus
                              ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-xs'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {campus.replace(/ \(.+\)/, '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aggregate Display */}
                <div className="my-3 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl flex items-baseline justify-between border border-zinc-100 dark:border-zinc-800">
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

                {/* Official Formula Badge */}
                <div className="p-2 bg-teal-50/60 dark:bg-teal-950/30 rounded-lg border border-teal-100 dark:border-teal-900/40 mb-3">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-teal-800 dark:text-teal-300">
                    <Calculator className="w-3 h-3" />
                    <span>Official Formula:</span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 mt-0.5">
                    {uni.formulaDisplay}
                  </p>
                </div>

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
                      {res.breakdown.testType === 'sat' ? 'Digital SAT (1600):' : `${uni.testName}:`}
                    </span>
                    <span className="font-mono font-medium text-teal-700 dark:text-teal-300">
                      {res.breakdown.testContribution.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {showRomanUrdu && (
                  <p className="mt-2 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                    💡 Official website button par click karke university portal par apply karein.
                  </p>
                )}
              </div>

              {/* Action Buttons: Formula Source & Direct Official Website Link */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAudit(uni.id)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1"
                  title="View official prospectus formula source"
                >
                  <ExternalLink className="w-3 h-3" />
                  Formula Details
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={uni.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                    title={`Visit official ${uni.shortName} admissions website`}
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  {isNust ? (
                    <button
                      type="button"
                      onClick={() => setIsNustModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>View All Fields</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectForReverse(uni.id, 75.0)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title={`Target score solver for ${uni.shortName}`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Target Solver</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NUST Big Box (Horizontal Fields Rows Modal) */}
      <NustFieldsModal
        isOpen={isNustModalOpen}
        onClose={() => setIsNustModalOpen(false)}
        studentAggregate={nustResult?.aggregate || 0}
        onSelectForReverse={onSelectForReverse}
      />
    </div>
  );
};
