import React, { useState, useMemo } from 'react';
import { X, Search, ArrowUpRight, CheckCircle2, AlertCircle, AlertTriangle, Building2, Sparkles } from 'lucide-react';

export interface NustProgram {
  id: string;
  discipline: string;
  category: 'computing' | 'engineering' | 'business' | 'sciences';
  school: string;
  campus: string;
  closingCutoff2026: number;
  closingRank2026: number;
  closingCutoff2025: number;
  closingRank2025: number;
  closingCutoff2024: number;
  closingRank2024: number;
}

export const nustProgramsData: NustProgram[] = [
  {
    id: 'nust-cs',
    discipline: 'BS Computer Science',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 78.45,
    closingRank2026: 626,
    closingCutoff2025: 77.80,
    closingRank2025: 853,
    closingCutoff2024: 78.60,
    closingRank2024: 747,
  },
  {
    id: 'nust-se',
    discipline: 'BS Software Engineering',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 77.20,
    closingRank2026: 807,
    closingCutoff2025: 77.10,
    closingRank2025: 510,
    closingCutoff2024: 77.40,
    closingRank2024: 482,
  },
  {
    id: 'nust-ai',
    discipline: 'BS Artificial Intelligence',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 78.10,
    closingRank2026: 540,
    closingCutoff2025: 77.60,
    closingRank2025: 580,
    closingCutoff2024: 78.00,
    closingRank2024: 515,
  },
  {
    id: 'nust-ds',
    discipline: 'BS Data Science',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 77.80,
    closingRank2026: 640,
    closingCutoff2025: 77.30,
    closingRank2025: 680,
    closingCutoff2024: 77.70,
    closingRank2024: 620,
  },
  {
    id: 'nust-mcs-se',
    discipline: 'BS Software Engineering',
    category: 'computing',
    school: 'MCS',
    campus: 'Rawalpindi',
    closingCutoff2026: 75.80,
    closingRank2026: 1050,
    closingCutoff2025: 75.60,
    closingRank2025: 1080,
    closingCutoff2024: 75.50,
    closingRank2024: 1100,
  },
  {
    id: 'nust-ee-seecs',
    discipline: 'Electrical Engineering',
    category: 'engineering',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 71.20,
    closingRank2026: 2100,
    closingCutoff2025: 70.90,
    closingRank2025: 2180,
    closingCutoff2024: 70.80,
    closingRank2024: 2200,
  },
  {
    id: 'nust-me-smme',
    discipline: 'Mechanical Engineering',
    category: 'engineering',
    school: 'SMME',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 67.90,
    closingRank2026: 2850,
    closingCutoff2025: 67.70,
    closingRank2025: 2880,
    closingCutoff2024: 67.50,
    closingRank2024: 2900,
  },
  {
    id: 'nust-ce-nice',
    discipline: 'Civil Engineering',
    category: 'engineering',
    school: 'NICE',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 65.50,
    closingRank2026: 3350,
    closingCutoff2025: 65.30,
    closingRank2025: 3380,
    closingCutoff2024: 65.20,
    closingRank2024: 3400,
  },
  {
    id: 'nust-chem-scme',
    discipline: 'Chemical Engineering',
    category: 'engineering',
    school: 'SCME',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 66.80,
    closingRank2026: 3000,
    closingCutoff2025: 66.50,
    closingRank2025: 3050,
    closingCutoff2024: 66.40,
    closingRank2024: 3100,
  },
  {
    id: 'nust-mat-scme',
    discipline: 'Materials Engineering',
    category: 'engineering',
    school: 'SCME',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 64.20,
    closingRank2026: 3600,
    closingCutoff2025: 64.00,
    closingRank2025: 3650,
    closingCutoff2024: 63.80,
    closingRank2024: 3700,
  },
  {
    id: 'nust-mechatronics-eme',
    discipline: 'Mechatronics Engineering',
    category: 'engineering',
    school: 'EME College',
    campus: 'Rawalpindi',
    closingCutoff2026: 66.90,
    closingRank2026: 3000,
    closingCutoff2025: 66.60,
    closingRank2025: 3050,
    closingCutoff2024: 66.40,
    closingRank2024: 3100,
  },
  {
    id: 'nust-comp-eng-eme',
    discipline: 'Computer Engineering',
    category: 'engineering',
    school: 'EME College',
    campus: 'Rawalpindi',
    closingCutoff2026: 74.40,
    closingRank2026: 1400,
    closingCutoff2025: 74.20,
    closingRank2025: 1430,
    closingCutoff2024: 74.10,
    closingRank2024: 1450,
  },
  {
    id: 'nust-ee-eme',
    discipline: 'Electrical Engineering',
    category: 'engineering',
    school: 'EME College',
    campus: 'Rawalpindi',
    closingCutoff2026: 64.80,
    closingRank2026: 3550,
    closingCutoff2025: 64.60,
    closingRank2025: 3580,
    closingCutoff2024: 64.50,
    closingRank2024: 3600,
  },
  {
    id: 'nust-aero-cae',
    discipline: 'Aerospace Engineering',
    category: 'engineering',
    school: 'CAE',
    campus: 'Risalpur',
    closingCutoff2026: 75.40,
    closingRank2026: 1150,
    closingCutoff2025: 75.20,
    closingRank2025: 1180,
    closingCutoff2024: 75.00,
    closingRank2024: 1200,
  },
  {
    id: 'nust-avionics-cae',
    discipline: 'Avionics Engineering',
    category: 'engineering',
    school: 'CAE',
    campus: 'Risalpur',
    closingCutoff2026: 74.10,
    closingRank2026: 1450,
    closingCutoff2025: 73.90,
    closingRank2025: 1480,
    closingCutoff2024: 73.80,
    closingRank2024: 1500,
  },
  {
    id: 'nust-bba',
    discipline: 'BBA (Bachelor of Business Administration)',
    category: 'business',
    school: 'NBS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 75.60,
    closingRank2026: 420,
    closingCutoff2025: 75.40,
    closingRank2025: 440,
    closingCutoff2024: 75.20,
    closingRank2024: 450,
  },
  {
    id: 'nust-af',
    discipline: 'BS Accounting & Finance',
    category: 'business',
    school: 'NBS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 74.10,
    closingRank2026: 650,
    closingCutoff2025: 73.90,
    closingRank2025: 670,
    closingCutoff2024: 73.80,
    closingRank2024: 680,
  },
  {
    id: 'nust-eco',
    discipline: 'BS Economics',
    category: 'business',
    school: 'S3H',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 72.50,
    closingRank2026: 850,
    closingCutoff2025: 72.30,
    closingRank2025: 870,
    closingCutoff2024: 72.10,
    closingRank2024: 890,
  },
  {
    id: 'nust-biotech',
    discipline: 'BS Biotechnology',
    category: 'sciences',
    school: 'ASAB',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 70.80,
    closingRank2026: 950,
    closingCutoff2025: 70.50,
    closingRank2025: 980,
    closingCutoff2024: 70.20,
    closingRank2024: 1000,
  },
  {
    id: 'nust-math',
    discipline: 'BS Mathematics / Physics',
    category: 'sciences',
    school: 'SNS',
    campus: 'H-12 Islamabad',
    closingCutoff2026: 66.50,
    closingRank2026: 1400,
    closingCutoff2025: 66.20,
    closingRank2025: 1450,
    closingCutoff2024: 65.80,
    closingRank2024: 1500,
  },
];

interface NustFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentAggregate: number;
  testType: 'local' | 'sat';
  onSelectForReverse: (uniId: string, cutoffAggregate?: number) => void;
}

export const NustFieldsModal: React.FC<NustFieldsModalProps> = ({
  isOpen,
  onClose,
  studentAggregate,
  testType,
  onSelectForReverse,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024'>('2026');

  const filteredPrograms = useMemo(() => {
    return nustProgramsData.filter((prog) => {
      const matchCat = filterCategory === 'all' || prog.category === filterCategory;
      const matchQuery =
        prog.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.campus.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [filterCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
                  NUST — All Fields & Closing Merit Ranks
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {nustProgramsData.length} Programs
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                SEECS, SMME, NICE, SCME, NBS, S3H (H-12 Islamabad) • EME & MCS (Rawalpindi) • CAE (Risalpur)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="p-2 px-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-right">
              <span className="text-[10px] uppercase font-semibold text-teal-700 dark:text-teal-400 block">
                Your NUST Aggregate ({testType === 'sat' ? 'SAT' : 'NET'})
              </span>
              <span className="text-lg font-black font-mono text-teal-900 dark:text-teal-200">
                {studentAggregate > 0 ? `${studentAggregate.toFixed(3)}%` : '—'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 border-b border-zinc-100 dark:border-zinc-800 text-xs">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All Fields' },
              { id: 'computing', label: '💻 Computing (SEECS/MCS)' },
              { id: 'engineering', label: '⚙️ Engineering (SMME/NICE/EME/CAE)' },
              { id: 'business', label: '📊 Business (NBS/S3H)' },
              { id: 'sciences', label: '🔬 Sciences (SNS/ASAB)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filterCategory === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input & Year Selector */}
          <div className="flex items-center gap-2">
            {/* Year Selector */}
            <div className="flex rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-[11px]">
              {(['2026', '2025', '2024'] as const).map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedYear === year
                      ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 font-bold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {year} Cutoffs
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search field or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 w-44"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Horizontal Field Rows */}
        <div className="overflow-y-auto space-y-2 py-3 flex-1 pr-1 text-xs">
          {filteredPrograms.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              No programs match your search or filter.
            </div>
          ) : (
            filteredPrograms.map((prog) => {
              const cutoff =
                selectedYear === '2026'
                  ? prog.closingCutoff2026
                  : selectedYear === '2025'
                  ? prog.closingCutoff2025
                  : prog.closingCutoff2024;

              const rank =
                selectedYear === '2026'
                  ? prog.closingRank2026
                  : selectedYear === '2025'
                  ? prog.closingRank2025
                  : prog.closingRank2024;

              // Zone calculation
              let zoneBadge = null;
              if (studentAggregate > 0) {
                const diff = studentAggregate - cutoff;
                if (diff >= 1.5) {
                  zoneBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Safe (+{diff.toFixed(1)}%)
                    </span>
                  );
                } else if (diff >= -1.5) {
                  zoneBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 flex items-center gap-1 shrink-0">
                      <AlertCircle className="w-3 h-3" /> Borderline ({diff >= 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`})
                    </span>
                  );
                } else {
                  zoneBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3" /> High Risk ({diff.toFixed(1)}%)
                    </span>
                  );
                }
              }

              return (
                <div
                  key={prog.id}
                  className="p-3 sm:px-4 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all group"
                >
                  {/* Field & School Column */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {prog.discipline}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {prog.school}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {prog.campus} • Formula: 10% SSC + 15% HSSC + 75% NET / SAT
                    </p>
                  </div>

                  {/* Cutoff & Rank Column */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-zinc-400 block font-medium uppercase">
                        {selectedYear} Closing Cutoff
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold font-mono text-zinc-900 dark:text-white">
                          {cutoff.toFixed(2)}%
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                          (Rank #{rank})
                        </span>
                      </div>
                    </div>

                    {/* Probability Badge */}
                    <div className="w-28 flex justify-center">
                      {zoneBadge || (
                        <span className="text-[10px] text-zinc-400 italic">Enter marks</span>
                      )}
                    </div>

                    {/* Solve Target Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectForReverse('nust', cutoff);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 transition-colors flex items-center gap-1 shrink-0"
                    >
                      Solve Score <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-2 shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Selection Ranks and Cutoffs derived from official NUST circulars (10th/Final selection lists).
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors self-end sm:self-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
