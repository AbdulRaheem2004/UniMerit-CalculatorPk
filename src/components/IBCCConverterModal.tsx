import React, { useState } from 'react';
import { X, Sparkles, Check, Info } from 'lucide-react';
import { calculateIBCCEquivalence, IBCC_GRADE_POINTS } from '../engine/ibcc';

interface IBCCConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (marks1100: number) => void;
}

const DEFAULT_SUBJECTS = [
  'English Language',
  'Mathematics',
  'Urdu',
  'Islamiyat',
  'Pakistan Studies',
  'Physics',
  'Chemistry',
  'Biology / Computer Science',
];

export const IBCCConverterModal: React.FC<IBCCConverterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [grades, setGrades] = useState<string[]>(['A*', 'A*', 'A*', 'A', 'A', 'B', 'B', 'A']);

  if (!isOpen) return null;

  const result = calculateIBCCEquivalence(grades);

  const handleGradeChange = (index: number, newGrade: string) => {
    const updated = [...grades];
    updated[index] = newGrade;
    setGrades(updated);
  };

  const handleApply = () => {
    onApply(result.obtainedMarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                IBCC O-Level Grade Converter
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official conversion formula to 1100 Pakistani marks.
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

        {/* Info Banner */}
        <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800/60 flex items-start space-x-2 text-xs text-teal-900 dark:text-teal-200">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
          <p>
            Pakistani national students require <strong>8 subjects</strong> (5 compulsory + 3 science/electives). Grade scale: A*=90, A=85, B=75, C=65, D=55, E=45.
          </p>
        </div>

        {/* Subjects & Grade Selectors */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {DEFAULT_SUBJECTS.map((subject, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs"
            >
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {idx + 1}. {subject}
              </span>

              <select
                value={grades[idx]}
                onChange={(e) => handleGradeChange(idx, e.target.value)}
                className="px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold text-teal-800 dark:text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {Object.keys(IBCC_GRADE_POINTS).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade} ({IBCC_GRADE_POINTS[grade]} pts)
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Calculation Summary Card */}
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
              Equivalent Marks
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white">
                {result.obtainedMarks}
              </span>
              <span className="text-xs font-mono text-zinc-500">/ 1100</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
              IBCC Percentage
            </span>
            <div className="text-xl font-bold font-mono text-teal-700 dark:text-teal-300 mt-0.5">
              {result.percentage.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Matric Marks ({result.obtainedMarks}/1100)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
