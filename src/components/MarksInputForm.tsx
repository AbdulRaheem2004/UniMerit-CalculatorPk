import React from 'react';
import { AcademicInput, UniversityConfig } from '../engine/types';
import { Calculator, Sparkles } from 'lucide-react';

interface MarksInputFormProps {
  input: AcademicInput;
  onChange: (updated: AcademicInput) => void;
  universities: UniversityConfig[];
  onOpenIBCC: () => void;
  showRomanUrdu: boolean;
}

export const MarksInputForm: React.FC<MarksInputFormProps> = ({
  input,
  onChange,
  universities,
  onOpenIBCC,
  showRomanUrdu,
}) => {
  const updateField = <K extends keyof AcademicInput>(field: K, value: AcademicInput[K]) => {
    onChange({
      ...input,
      [field]: value,
    });
  };

  const updateTestScore = (uniId: string, score: number) => {
    onChange({
      ...input,
      entryTestScores: {
        ...input.entryTestScores,
        [uniId]: score,
      },
    });
  };

  const matricError = input.matricObtained > input.matricTotal ? 'Obtained marks cannot exceed total' : null;
  const fscError = input.fscObtained > input.fscTotal ? 'Obtained marks cannot exceed total' : null;
  const satError = input.useSat && (input.satScore > 1600 || input.satScore < 400) && input.satScore > 0
    ? 'SAT score is typically between 400 and 1600'
    : null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Academic & Test Scores
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Enter your credentials once to see exact merit across all universities simultaneously.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* Matric / O-Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <span>1. Matric / SSC / O-Level</span>
            </label>
            <button
              type="button"
              onClick={onOpenIBCC}
              className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              O-Level IBCC Helper
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium">Obtained</span>
              <input
                type="number"
                min={0}
                max={input.matricTotal}
                value={input.matricObtained || ''}
                onChange={(e) => updateField('matricObtained', Math.max(0, Number(e.target.value)))}
                placeholder="e.g. 980"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-zinc-50 dark:bg-zinc-800 font-mono ${
                  matricError ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                } focus:outline-none focus:ring-2 focus:ring-teal-600`}
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium">Total</span>
              <input
                type="number"
                min={1}
                value={input.matricTotal || ''}
                onChange={(e) => updateField('matricTotal', Math.max(1, Number(e.target.value)))}
                placeholder="1100"
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
          {matricError && <p className="text-[11px] text-red-500">{matricError}</p>}
          {showRomanUrdu && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
              💡 Matric certificate ke kul aur hasil karda number likhein. O-Level students IBCC equivalence marks dalein.
            </p>
          )}
        </div>

        {/* Intermediate / FSc / A-Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              2. Intermediate / FSc / ICS / A-Level
            </label>
            <div className="flex items-center space-x-1 text-[10px]">
              <button
                type="button"
                onClick={() => updateField('fscTotal', 1100)}
                className={`px-2 py-0.5 rounded font-medium border ${
                  input.fscTotal === 1100
                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                Full (1100)
              </button>
              <button
                type="button"
                onClick={() => updateField('fscTotal', 520)}
                className={`px-2 py-0.5 rounded font-medium border ${
                  input.fscTotal === 520
                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                Part-1 (520)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium">Obtained</span>
              <input
                type="number"
                min={0}
                max={input.fscTotal}
                value={input.fscObtained || ''}
                onChange={(e) => updateField('fscObtained', Math.max(0, Number(e.target.value)))}
                placeholder="e.g. 920"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-zinc-50 dark:bg-zinc-800 font-mono ${
                  fscError ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                } focus:outline-none focus:ring-2 focus:ring-teal-600`}
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium">Total</span>
              <input
                type="number"
                min={1}
                value={input.fscTotal || ''}
                onChange={(e) => updateField('fscTotal', Math.max(1, Number(e.target.value)))}
                placeholder="1100"
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
          {fscError && <p className="text-[11px] text-red-500">{fscError}</p>}
          {showRomanUrdu && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
              💡 Agar Part-2 ka result pending hai to Part-1 ke marks aur total (520 ya 550) darj karein.
            </p>
          )}
        </div>
      </div>

      {/* Hafiz-e-Quran Option */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <label className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={input.hafizQuran}
            onChange={(e) => updateField('hafizQuran', e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-zinc-300 dark:border-zinc-700"
          />
          <span className="font-medium">Certified Hafiz-e-Quran (+20 marks for Punjab University / PUCIT)</span>
        </label>
      </div>

      {/* Test Mode Selector */}
      <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              3. Admission Test Mode
            </label>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Choose whether you are applying via domestic entry tests or Digital SAT.
            </p>
          </div>

          <div className="flex rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => updateField('useSat', false)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                !input.useSat
                  ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              🏛️ University Tests (NET / NU / ECAT)
            </button>
            <button
              type="button"
              onClick={() => updateField('useSat', true)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                input.useSat
                  ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              🎯 Digital SAT (1600)
            </button>
          </div>
        </div>

        {/* SAT Mode Input */}
        {input.useSat ? (
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Digital SAT Score (out of 1600)
              </span>
              <span className="text-[11px] font-mono text-teal-700 dark:text-teal-300">
                {input.satScore > 0 ? `${((input.satScore / 1600) * 100).toFixed(2)}%` : '0.00%'}
              </span>
            </div>

            <div className="max-w-xs">
              <input
                type="number"
                min={400}
                max={1600}
                value={input.satScore || ''}
                onChange={(e) => updateField('satScore', Math.min(1600, Math.max(0, Number(e.target.value))))}
                placeholder="e.g. 1350"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 font-mono ${
                  satError ? 'border-red-500' : 'border-teal-300 dark:border-teal-700'
                } focus:outline-none focus:ring-2 focus:ring-teal-600`}
              />
            </div>
            {satError && <p className="text-[11px] text-red-500">{satError}</p>}
            <p className="text-[11px] text-teal-800 dark:text-teal-300">
              Applies directly to <strong>FAST-NUCES</strong> (50% computing, 33% engineering), <strong>NUST</strong> (75% National Seats), <strong>GIKI</strong> (85%), and <strong>COMSATS</strong> (50%).
            </p>
          </div>
        ) : (
          /* Local Test Inputs */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {universities.map((uni) => {
              const currentScore = input.entryTestScores[uni.id] ?? '';
              return (
                <div
                  key={uni.id}
                  className="p-3 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                      {uni.shortName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Max: {uni.testTotal}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={0}
                      max={uni.testTotal}
                      value={currentScore}
                      onChange={(e) => updateTestScore(uni.id, Math.max(0, Number(e.target.value)))}
                      placeholder={`Test score (/${uni.testTotal})`}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    {uni.testName}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
