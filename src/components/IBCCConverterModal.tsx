import React, { useState } from 'react';
import { X, Sparkles, Check, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { calculateIBCCEquivalence, calculateALevelEquivalence, IBCC_GRADE_POINTS } from '../engine/ibcc';

interface IBCCConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (marks1100: number, target: 'matric' | 'fsc', hasFailedSubject: boolean, failureDetails?: string) => void;
  initialTab?: 'olevel' | 'alevel';
}

const DEFAULT_O_LEVEL_SUBJECTS = [
  'English Language',
  'Mathematics',
  'Urdu',
  'Islamiyat',
  'Pakistan Studies',
  'Physics',
  'Chemistry',
  'Biology / Computer Science',
];

const DEFAULT_A_LEVEL_SUBJECTS = [
  'Principal Subject 1 (e.g. Mathematics / Biology)',
  'Principal Subject 2 (e.g. Physics)',
  'Principal Subject 3 (e.g. Chemistry / Computer Science)',
];

export const IBCCConverterModal: React.FC<IBCCConverterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialTab = 'olevel',
}) => {
  const [activeTab, setActiveTab] = useState<'olevel' | 'alevel'>(initialTab);
  const [oGrades, setOGrades] = useState<string[]>(['A*', 'A*', 'A*', 'A', 'A', 'B', 'B', 'A']);
  const [aGrades, setAGrades] = useState<string[]>(['A*', 'A', 'B']);

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

  const currentGrades = activeTab === 'olevel' ? oGrades : aGrades;
  const currentSubjects = activeTab === 'olevel' ? DEFAULT_O_LEVEL_SUBJECTS : DEFAULT_A_LEVEL_SUBJECTS;
  const result = activeTab === 'olevel'
    ? calculateIBCCEquivalence(oGrades, DEFAULT_O_LEVEL_SUBJECTS)
    : calculateALevelEquivalence(aGrades, DEFAULT_A_LEVEL_SUBJECTS);

  const handleGradeChange = (index: number, newGrade: string) => {
    if (activeTab === 'olevel') {
      const updated = [...oGrades];
      updated[index] = newGrade;
      setOGrades(updated);
    } else {
      const updated = [...aGrades];
      updated[index] = newGrade;
      setAGrades(updated);
    }
  };

  const handleApply = () => {
    onApply(
      result.obtainedMarks,
      activeTab === 'olevel' ? 'matric' : 'fsc',
      result.hasFailedSubject,
      result.ineligibilityReason
    );
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                IBCC Equivalence Grade Converter
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official IBCC formula converting Cambridge grades to 1100 marks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: O-Level vs A-Level */}
        <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setActiveTab('olevel')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'olevel'
                ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            O-Level / IGCSE (8 Subjects - SSC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('alevel')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'alevel'
                ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            A-Level (3 Principal Subjects - HSSC)
          </button>
        </div>

        {/* Failed Grade Alert Banner (When any subject has 'U') */}
        {result.hasFailedSubject ? (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border-2 border-rose-300 dark:border-rose-800 flex items-start space-x-2.5 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-950 dark:text-rose-100 text-xs flex items-center gap-1">
                <span>IBCC Ineligibility Alert: Failed Grade ('U') Detected</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                You have marked Grade <strong>'U' (Fail)</strong> in: <strong>{result.failedSubjects.join(', ')}</strong>.
              </p>
              <p className="text-[11px] font-semibold text-rose-800 dark:text-rose-300">
                Under official IBCC Regulations (Clause 3.2), an Equivalence Certificate CANNOT be issued if any single subject is failed. Pakistani universities strictly require passed IBCC equivalence for admission eligibility.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800/60 flex items-start space-x-2 text-xs text-teal-900 dark:text-teal-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
            <p>
              {activeTab === 'olevel' ? (
                <span>
                  Pakistani national students require <strong>8 subjects</strong> (5 compulsory + 3 science/electives). Grade scale: A*=90, A=85, B=75, C=65, D=55, E=45. Minimum passing grade is E.
                </span>
              ) : (
                <span>
                  A-Level requires minimum <strong>3 full credit subjects</strong>. Grade scale: A*=90, A=85, B=75, C=65, D=55, E=45. Passing in all 3 subjects is mandatory.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Subjects & Grade Selectors */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {currentSubjects.map((subject, idx) => {
            const grade = currentGrades[idx];
            const isFailed = grade === 'U' || grade === 'F';
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  isFailed
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-100 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                  {isFailed && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  <span className={`font-medium truncate ${isFailed ? 'text-rose-950 dark:text-rose-200 font-bold' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {idx + 1}. {subject}
                  </span>
                </div>

                <select
                  value={grade}
                  onChange={(e) => handleGradeChange(idx, e.target.value)}
                  className={`px-2.5 py-1 rounded border font-mono font-bold text-xs focus:outline-none focus:ring-1 ${
                    isFailed
                      ? 'border-rose-400 bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-100 focus:ring-rose-500'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 focus:ring-teal-600'
                  }`}
                >
                  {Object.keys(IBCC_GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>
                      {g} {g === 'U' ? '(Fail - 0 pts)' : `(${IBCC_GRADE_POINTS[g]} pts)`}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* Calculation Summary Card */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          result.hasFailedSubject
            ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
        }`}>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
              {result.hasFailedSubject ? 'Hypothetical Marks (Equivalence Denied)' : 'Equivalent Marks'}
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className={`text-2xl font-extrabold font-mono ${result.hasFailedSubject ? 'text-rose-700 dark:text-rose-400 line-through' : 'text-zinc-900 dark:text-white'}`}>
                {result.obtainedMarks}
              </span>
              <span className="text-xs font-mono text-zinc-500">/ 1100</span>
            </div>
            {result.hasFailedSubject && (
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block mt-0.5">
                ❌ Certificate Ineligible
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
              IBCC Status
            </span>
            <div className={`text-xs font-bold mt-1 px-2.5 py-1 rounded-md inline-block ${
              result.hasFailedSubject
                ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {result.hasFailedSubject ? '❌ Ineligible (Failed)' : `✅ Eligible (${result.percentage.toFixed(2)}%)`}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer ${
              result.hasFailedSubject
                ? 'bg-rose-700 hover:bg-rose-800 text-white'
                : 'bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 text-white'
            }`}
          >
            {result.hasFailedSubject ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Apply (Flag Ineligible Profile)</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Apply to {activeTab === 'olevel' ? 'Matric' : 'FSc'} Marks ({result.obtainedMarks}/1100)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
