import React, { useState, useMemo } from 'react';
import { X, Search, ArrowUpRight, Building2, ExternalLink, GraduationCap } from 'lucide-react';

export interface NustProgram {
  id: string;
  discipline: string;
  category: 'computing' | 'engineering' | 'business' | 'sciences';
  school: string;
  campus: string;
  eligibility: string;
}

export const nustProgramsData: NustProgram[] = [
  {
    id: 'nust-cs',
    discipline: 'BS Computer Science',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Eng / ICS / Pre-Med with Add. Math (Min 60%)',
  },
  {
    id: 'nust-se',
    discipline: 'BS Software Engineering',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Eng / ICS / Pre-Med with Add. Math (Min 60%)',
  },
  {
    id: 'nust-ai',
    discipline: 'BS Artificial Intelligence',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Eng / ICS / Pre-Med with Add. Math (Min 60%)',
  },
  {
    id: 'nust-ds',
    discipline: 'BS Data Science',
    category: 'computing',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Eng / ICS / Pre-Med with Add. Math (Min 60%)',
  },
  {
    id: 'nust-mcs-se',
    discipline: 'BS Software Engineering',
    category: 'computing',
    school: 'MCS',
    campus: 'Rawalpindi',
    eligibility: 'Pre-Engineering / ICS (Min 60%)',
  },
  {
    id: 'nust-ee-seecs',
    discipline: 'Electrical Engineering',
    category: 'engineering',
    school: 'SEECS',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-me-smme',
    discipline: 'Mechanical Engineering',
    category: 'engineering',
    school: 'SMME',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-ce-nice',
    discipline: 'Civil Engineering',
    category: 'engineering',
    school: 'NICE',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-che-scme',
    discipline: 'Chemical Engineering',
    category: 'engineering',
    school: 'SCME',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-mte-smme',
    discipline: 'Mechatronics Engineering',
    category: 'engineering',
    school: 'SMME',
    campus: 'H-12 Islamabad',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-eme-ee',
    discipline: 'Electrical Engineering',
    category: 'engineering',
    school: 'EME College',
    campus: 'Rawalpindi',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-eme-me',
    discipline: 'Mechanical Engineering',
    category: 'engineering',
    school: 'EME College',
    campus: 'Rawalpindi',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-eme-mts',
    discipline: 'Mechatronics Engineering',
    category: 'engineering',
    school: 'EME College',
    campus: 'Rawalpindi',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-eme-ce',
    discipline: 'Computer Engineering',
    category: 'engineering',
    school: 'EME College',
    campus: 'Rawalpindi',
    eligibility: 'Pre-Engineering / ICS (Min 60%)',
  },
  {
    id: 'nust-cae-aero',
    discipline: 'Aerospace Engineering',
    category: 'engineering',
    school: 'CAE',
    campus: 'Risalpur',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-cae-av',
    discipline: 'Avionics Engineering',
    category: 'engineering',
    school: 'CAE',
    campus: 'Risalpur',
    eligibility: 'Pre-Engineering (Min 60%)',
  },
  {
    id: 'nust-bba',
    discipline: 'Bachelor of Business Administration (BBA)',
    category: 'business',
    school: 'NBS',
    campus: 'H-12 Islamabad',
    eligibility: 'FA / FSc / ICS / I.Com (Min 60%)',
  },
  {
    id: 'nust-acfac',
    discipline: 'BS Accounting & Finance',
    category: 'business',
    school: 'NBS',
    campus: 'H-12 Islamabad',
    eligibility: 'FA / FSc / ICS / I.Com (Min 60%)',
  },
  {
    id: 'nust-econ',
    discipline: 'BS Economics',
    category: 'business',
    school: 'S3H',
    campus: 'H-12 Islamabad',
    eligibility: 'FA / FSc / ICS (Min 60%)',
  },
  {
    id: 'nust-psych',
    discipline: 'BS Psychology',
    category: 'business',
    school: 'S3H',
    campus: 'H-12 Islamabad',
    eligibility: 'FA / FSc / ICS (Min 60%)',
  },
  {
    id: 'nust-biotech',
    discipline: 'BS Applied Biosciences / Biotechnology',
    category: 'sciences',
    school: 'ASAB',
    campus: 'H-12 Islamabad',
    eligibility: 'FSc Pre-Medical (Min 60%)',
  },
  {
    id: 'nust-math',
    discipline: 'BS Mathematics',
    category: 'sciences',
    school: 'SNS',
    campus: 'H-12 Islamabad',
    eligibility: 'FSc Pre-Engineering / ICS (Min 60%)',
  },
  {
    id: 'nust-physics',
    discipline: 'BS Physics',
    category: 'sciences',
    school: 'SNS',
    campus: 'H-12 Islamabad',
    eligibility: 'FSc Pre-Engineering (Min 60%)',
  },
];

interface NustFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentAggregate: number;
  onSelectForReverse: (uniId: string, targetAggregate?: number) => void;
}

export const NustFieldsModal: React.FC<NustFieldsModalProps> = ({
  isOpen,
  onClose,
  studentAggregate,
  onSelectForReverse,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrograms = useMemo(() => {
    return nustProgramsData.filter((prog) => {
      const matchCategory = filterCategory === 'all' || prog.category === filterCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        prog.discipline.toLowerCase().includes(q) ||
        prog.school.toLowerCase().includes(q) ||
        prog.campus.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [filterCategory, searchQuery]);

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-800 text-teal-50 flex items-center justify-center shadow-sm shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                  NUST Constituent Schools & Undergraduate Disciplines
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 uppercase">
                  Official Criteria
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Uniform National Seats Merit Formula: <strong>75% NET / SAT + 15% FSc + 10% Matric</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Your NUST Aggregate</span>
              <span className="text-lg font-mono font-extrabold text-teal-800 dark:text-teal-300">
                {studentAggregate > 0 ? `${studentAggregate.toFixed(3)}%` : '—'}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 border-b border-zinc-100 dark:border-zinc-800 text-xs">
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

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search field, school, campus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 w-56"
            />
          </div>
        </div>

        {/* NUST Gap Year Policy & Verification Notice */}
        <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold bg-teal-200 dark:bg-teal-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
              Official Policy: 0% Gap Year Deduction
            </span>
            <span>
              NUST does <strong>not</strong> deduct marks for gap years. Fresh applicants apply with Part-1, while gap-year applicants use full FSc (Part 1+2) on 100% equal footing.
            </span>
          </div>
          <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 shrink-0">
            ✓ Updated for 2025/2026 Cycle
          </span>
        </div>

        {/* Scrollable Horizontal Field Rows */}
        <div className="overflow-y-auto space-y-2 py-2 flex-1 pr-1 text-xs">
          {filteredPrograms.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              No programs match your search or filter.
            </div>
          ) : (
            filteredPrograms.map((prog) => {
              return (
                <div
                  key={prog.id}
                  className="p-3 sm:px-4 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all group"
                >
                  {/* Field & School Column */}
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {prog.discipline}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {prog.school}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {prog.campus} • {prog.eligibility}
                    </p>
                  </div>

                  {/* Aggregate & Actions Column */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-zinc-400 block font-medium uppercase">Your Aggregate</span>
                      <span className="text-base font-extrabold font-mono text-teal-800 dark:text-teal-300">
                        {studentAggregate > 0 ? `${studentAggregate.toFixed(3)}%` : '—'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectForReverse('nust', 75.0);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 shrink-0"
                    >
                      Target Solver <ArrowUpRight className="w-3 h-3" />
                    </button>

                    <a
                      href="https://ugadmissions.nust.edu.pk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                      title="Apply on official NUST Undergraduate Admissions Portal"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-2 shrink-0">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            Admissions for all constituent campuses (H-12 Islamabad, EME, MCS, CAE) are managed through NUST central portal.
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
