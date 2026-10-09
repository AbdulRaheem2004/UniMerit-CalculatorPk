import React from 'react';
import { AcademicInput, UniversityConfig, DisciplineCategory, InterStream } from '../engine/types';
import { Calculator, Sparkles, Layers, Stethoscope, CheckCircle2, ShieldCheck, BookOpen, Info } from 'lucide-react';

interface MarksInputFormProps {
  input: AcademicInput;
  onChange: (updated: AcademicInput) => void;
  universities: UniversityConfig[];
  selectedDisciplineCategory: DisciplineCategory | 'all';
  onSelectDisciplineCategory: (category: DisciplineCategory | 'all') => void;
  onOpenIBCC: () => void;
  showRomanUrdu: boolean;
}

export const MarksInputForm: React.FC<MarksInputFormProps> = ({
  input,
  onChange,
  universities,
  selectedDisciplineCategory,
  onSelectDisciplineCategory,
  onOpenIBCC,
  showRomanUrdu,
}) => {
  const updateField = <K extends keyof AcademicInput>(field: K, value: AcademicInput[K]) => {
    onChange({
      ...input,
      [field]: value,
    });
  };

  const updateTestScore = (testKey: string, score: number) => {
    onChange({
      ...input,
      entryTestScores: {
        ...input.entryTestScores,
        [testKey]: score,
      },
    });
  };

  const matricError = input.matricObtained > input.matricTotal ? 'Obtained marks cannot exceed total' : null;
  const fscError = input.fscObtained > input.fscTotal ? 'Obtained marks cannot exceed total' : null;
  const satError =
    input.useSat && (input.satScore > 1600 || input.satScore < 400) && input.satScore > 0
      ? 'SAT score is typically between 400 and 1600'
      : null;

  // Filter universities for entry tests display based on selected category
  const relevantUnisForTests = universities.filter((uni) => {
    if (selectedDisciplineCategory === 'all') return true;
    if (uni.categories && uni.categories.includes(selectedDisciplineCategory)) return true;
    return uni.disciplineCategory === selectedDisciplineCategory;
  });

  const isMedicalMode = selectedDisciplineCategory === 'medical';
  const mdcatScore = input.entryTestScores['mdcat'] ?? 0;
  const numsScore = input.entryTestScores['nums'] ?? 0;
  const akuScore = input.entryTestScores['aku'] ?? 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header and Quick Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            Step 2: Required Information
          </span>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 mt-0.5">
            <Calculator className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {isMedicalMode ? 'Medical & Dental Credentials & MDCAT' : 'Academic & Admission Test Scores'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isMedicalMode
              ? 'Enter Matric, FSc Pre-Medical, and MDCAT to calculate official PMDC merit across all public & private medical colleges.'
              : 'Enter your credentials once to see exact merit across all universities & campuses simultaneously.'}
          </p>
        </div>

        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5" /> Target:
          </span>
          {[
            { id: 'all', label: 'All Streams' },
            { id: 'medical', label: '🩺 Medical (MDCAT)' },
            { id: 'computing', label: '💻 Computing' },
            { id: 'engineering', label: '⚙️ Engineering' },
            { id: 'business', label: '📊 Business' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectDisciplineCategory(tab.id as DisciplineCategory | 'all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDisciplineCategory === tab.id
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stream-Specific Official Guideline Banner */}
      <div className="p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
        {selectedDisciplineCategory === 'medical' && (
          <div>
            <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400 text-xs mb-1">
              <Stethoscope className="w-4 h-4" />
              <span>PMDC Official Admission Regulations (MBBS & BDS):</span>
            </div>
            <p>
              Merit is calculated as <strong>50% MDCAT + 40% FSc (Pre-Medical) + 10% Matric</strong>. Certified Hafiz-e-Quran receives <strong>20 marks added to FSc</strong>.
              PMDC passing cutoff is <strong>55% (110/200) for MBBS</strong> and <strong>50% (100/200) for BDS</strong>.
            </p>
          </div>
        )}
        {selectedDisciplineCategory === 'computing' && (
          <div>
            <span className="font-bold text-teal-800 dark:text-teal-300">💻 Computing Stream: </span>
            <span>
              Requires Intermediate in Pre-Engineering, ICS, or Pre-Medical with Additional Math. Minimum 50% for FAST/COMSATS/PUCIT, 60% for NUST & GIKI. Multi-discipline universities (GIKI, UET, NED, PIEAS, SSUET, FCCU, BNU) appear with their CS programs.
            </span>
          </div>
        )}
        {selectedDisciplineCategory === 'engineering' && (
          <div>
            <span className="font-bold text-amber-800 dark:text-amber-300">⚙️ Engineering Stream: </span>
            <span>
              Governed by Pakistan Engineering Council (PEC). Requires minimum 60% in FSc Pre-Engineering across all institutions. Includes NUST, GIKI, UET Lahore, NED Karachi, PIEAS Islamabad, SSUET, FAST, and COMSATS.
            </span>
          </div>
        )}
        {selectedDisciplineCategory === 'business' && (
          <div>
            <span className="font-bold text-blue-800 dark:text-blue-300">📊 Business & Social Sciences: </span>
            <span>
              Open to all intermediate backgrounds (FA / FSc / ICS / I.Com). Includes premier business faculties: IBA Karachi, LUMS SDSB, NUST NBS, FAST Business, COMSATS, FCCU, and BNU.
            </span>
          </div>
        )}
        {selectedDisciplineCategory === 'all' && (
          <div>
            <span className="font-bold text-zinc-900 dark:text-white">🌐 All Pakistani Disciplines: </span>
            <span>
              Showing all verified medical, computing, engineering, and business universities across Pakistan. Fill your academic marks and applicable test scores to calculate exact simultaneous merits.
            </span>
          </div>
        )}
      </div>

      {showRomanUrdu && (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
          {isMedicalMode
            ? '💡 PMDC ke mutabiq merit formula: 50% MDCAT + 40% FSc Pre-Medical + 10% Matric hai. Hafiz-e-Quran ko 20 number FSc mein diye jatay hain. MBBS ke liye 55% aur BDS ke liye 50% MDCAT marks zaroori hain.'
            : '💡 Apnay Matric aur FSc ke number darj karein. Agar aap ne university test diya hai to uske number likhein, ya Digital SAT ka score likhein. Naye Quran syllabus ke sath total 1200 hai jabke puraane repeaters 1100 istemal karein.'}
        </div>
      )}

      {/* Academic Marks: Matric & Intermediate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Matric / SSC / O-Level */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <span>1. Matric / SSC / O-Level Marks</span>
            </label>
            <div className="flex items-center space-x-1 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  const newTotal = 1100;
                  const newObtained =
                    input.matricTotal > 0 && input.matricObtained > 0
                      ? Math.min(newTotal, Math.round((input.matricObtained / input.matricTotal) * newTotal))
                      : input.matricObtained;
                  onChange({ ...input, matricTotal: newTotal, matricObtained: newObtained });
                }}
                className={`px-2 py-0.5 rounded font-medium border ${
                  input.matricTotal === 1100
                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                }`}
                title="Traditional total (FBISE, Sindh, KPK, Pre-2023)"
              >
                1100 (Standard)
              </button>
              <button
                type="button"
                onClick={() => {
                  const newTotal = 1200;
                  const newObtained =
                    input.matricTotal > 0 && input.matricObtained > 0
                      ? Math.min(newTotal, Math.round((input.matricObtained / input.matricTotal) * newTotal))
                      : input.matricObtained;
                  onChange({ ...input, matricTotal: newTotal, matricObtained: newObtained });
                }}
                className={`px-2 py-0.5 rounded font-medium border ${
                  input.matricTotal === 1200
                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                }`}
                title="Punjab Boards with Tarjuma-tul-Quran"
              >
                1200 (Punjab Quran)
              </button>
              <button
                type="button"
                onClick={onOpenIBCC}
                className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 ml-1"
              >
                <Sparkles className="w-3 h-3" />
                IBCC
              </button>
            </div>
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
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Matric Percentage:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {input.matricTotal > 0 ? ((input.matricObtained / input.matricTotal) * 100).toFixed(2) : 0}%
            </span>
          </div>
        </div>

        {/* 2. Intermediate / FSc / ICS / Pre-Medical */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>2. What did you study in Intermediate (HSSC)?</span>
            </label>
            <div className="text-[10px] text-zinc-500 font-medium">
              Official 2026 Board Scale
            </div>
          </div>

          {/* Inter Discipline Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
            {[
              { id: 'pre_medical', label: 'F.Sc Pre-Medical', icon: '🩺', badge: 'Bio / Chem' },
              { id: 'pre_engineering', label: 'F.Sc Pre-Eng', icon: '⚙️', badge: 'Math / Phy' },
              { id: 'ics', label: 'ICS (Comp Sci)', icon: '💻', badge: 'CS / Math' },
              { id: 'icom_arts', label: 'I.Com / FA / Arts', icon: '📚', badge: 'General' },
              { id: 'alevels', label: 'A-Levels', icon: '🌍', badge: 'IBCC Scale' },
            ].map((st) => {
              const currentStream = input.interStream || (isMedicalMode ? 'pre_medical' : 'pre_engineering');
              const isCurrent = currentStream === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    const nextStream = st.id as InterStream;
                    const stage = input.interStage || 'complete';
                    const isSindh = !!input.isSindhOrNonQuranBoard;
                    let targetTotal = 1200;
                    if (nextStream === 'alevels') {
                      targetTotal = 1100;
                    } else if (stage === 'part1') {
                      targetTotal = isSindh ? 550 : 600;
                    } else {
                      targetTotal = isSindh ? 1100 : 1200;
                    }

                    const nextObtained =
                      input.fscTotal > 0 && input.fscObtained > 0
                        ? Math.min(targetTotal, Math.round((input.fscObtained / input.fscTotal) * targetTotal))
                        : input.fscObtained;

                    onChange({
                      ...input,
                      interStream: nextStream,
                      fscTotal: targetTotal,
                      fscObtained: nextObtained,
                    });
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left border transition-all text-xs font-semibold ${
                    isCurrent
                      ? 'bg-teal-700 text-white dark:bg-teal-600 border-teal-800 dark:border-teal-500 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{st.icon}</span>
                    <span className="truncate">{st.label}</span>
                  </div>
                  <span className={`text-[9px] block font-normal opacity-80 mt-0.5 ${isCurrent ? 'text-teal-100' : 'text-zinc-400'}`}>
                    {st.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Examination Stage & Board Policy Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 font-medium">Applying with:</span>
              <button
                type="button"
                onClick={() => {
                  const isSindh = !!input.isSindhOrNonQuranBoard;
                  const targetTotal = input.interStream === 'alevels' ? 1100 : isSindh ? 1100 : 1200;
                  const nextObtained =
                    input.fscTotal > 0 && input.fscObtained > 0
                      ? Math.min(targetTotal, Math.round((input.fscObtained / input.fscTotal) * targetTotal))
                      : input.fscObtained;
                  onChange({
                    ...input,
                    interStage: 'complete',
                    fscTotal: targetTotal,
                    fscObtained: nextObtained,
                  });
                }}
                className={`px-2 py-0.5 rounded font-semibold ${
                  (input.interStage || 'complete') === 'complete'
                    ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                Complete HSSC (2-Years)
              </button>
              <button
                type="button"
                onClick={() => {
                  const isSindh = !!input.isSindhOrNonQuranBoard;
                  const targetTotal = isSindh ? 550 : 600;
                  const nextObtained =
                    input.fscTotal > 0 && input.fscObtained > 0
                      ? Math.min(targetTotal, Math.round((input.fscObtained / input.fscTotal) * targetTotal))
                      : input.fscObtained;
                  onChange({
                    ...input,
                    interStage: 'part1',
                    fscTotal: targetTotal,
                    fscObtained: nextObtained,
                  });
                }}
                className={`px-2 py-0.5 rounded font-semibold ${
                  input.interStage === 'part1'
                    ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                1st Year (Part-1)
              </button>
            </div>

            {/* Non-Quran / Sindh Board check */}
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-600 dark:text-zinc-400 select-none">
              <input
                type="checkbox"
                checked={!!input.isSindhOrNonQuranBoard}
                onChange={(e) => {
                  const isSindh = e.target.checked;
                  const stage = input.interStage || 'complete';
                  let targetTotal = 1200;
                  if (input.interStream === 'alevels') {
                    targetTotal = 1100;
                  } else if (stage === 'part1') {
                    targetTotal = isSindh ? 550 : 600;
                  } else {
                    targetTotal = isSindh ? 1100 : 1200;
                  }
                  const nextObtained =
                    input.fscTotal > 0 && input.fscObtained > 0
                      ? Math.min(targetTotal, Math.round((input.fscObtained / input.fscTotal) * targetTotal))
                      : input.fscObtained;
                  onChange({
                    ...input,
                    isSindhOrNonQuranBoard: isSindh,
                    fscTotal: targetTotal,
                    fscObtained: nextObtained,
                  });
                }}
                className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
              />
              <span className="text-[10px]">Sindh Board / Non-Quran Scheme</span>
            </label>
          </div>

          {/* Obtained & Total Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium">Obtained Marks</span>
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
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase font-medium">Board Total</span>
                <span className="text-[9px] text-teal-600 dark:text-teal-400 font-bold">Auto-set</span>
              </div>
              <input
                type="number"
                min={1}
                value={input.fscTotal || ''}
                readOnly
                title="Automatically set based on official board curriculum"
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 font-mono cursor-not-allowed"
              />
            </div>
          </div>
          {fscError && <p className="text-[11px] text-red-500">{fscError}</p>}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-0.5">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-teal-600" />
              <span>Board Scheme:</span>
              <strong className="text-zinc-700 dark:text-zinc-300">
                {input.fscTotal === 1200
                  ? 'SNC 1200 (Tarjuma-tul-Quran 100m)'
                  : input.fscTotal === 600
                  ? 'Part-1 600 (Tarjuma-tul-Quran 50m)'
                  : input.fscTotal === 1100
                  ? 'Traditional 1100 Scale'
                  : 'Part-1 550 Scale'}
              </strong>
            </span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {input.fscTotal > 0 ? ((input.fscObtained / input.fscTotal) * 100).toFixed(2) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Hafiz-e-Quran Option */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <label className="flex items-center space-x-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={input.hafizQuran}
            onChange={(e) => updateField('hafizQuran', e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-zinc-300 dark:border-zinc-700"
          />
          <span className="font-medium">
            Certified Hafiz-e-Quran{' '}
            <span className="text-teal-700 dark:text-teal-400 font-semibold">
              {isMedicalMode
                ? '(+20 marks added to FSc for PMDC Medical Merit)'
                : '(+20 marks for Punjab University / PUCIT & Medical)'}
            </span>
          </span>
        </label>
        {input.hafizQuran && (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> +20 Marks Active
          </span>
        )}
      </div>

      {/* 3. Admission Test Inputs Section */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
        {/* IF MEDICAL STREAM: Show dedicated MDCAT & Medical inputs */}
        {isMedicalMode ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-rose-600" />
                  3. Medical Admission Entry Tests (MDCAT & NUMS)
                </label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Your MDCAT score applies universally to all PMDC affiliated public & private medical colleges (UHS, Dow, KMU, Shifa).
                </p>
              </div>
            </div>

            {/* Primary: MDCAT Box */}
            <div className="p-4 rounded-xl border-2 border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-rose-950 dark:text-rose-200">
                    National MDCAT (Medical & Dental College Admission Test)
                  </span>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300">
                    Mandatory standardized exam conducted under PMDC supervision across Pakistan.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-rose-800 dark:text-rose-300">
                    Total: 200 Marks
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300 block mb-1">
                    Your MDCAT Score (out of 200)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={mdcatScore || ''}
                    onChange={(e) => updateTestScore('mdcat', Math.min(200, Math.max(0, Number(e.target.value))))}
                    placeholder="e.g. 175"
                    className="w-full px-3 py-2 text-base font-bold font-mono rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Real-time PMDC Eligibility Status */}
                <div className="sm:col-span-2 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/60 text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    PMDC Official Eligibility Assessment:
                  </div>
                  {mdcatScore >= 110 ? (
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                      ✅ <strong>Eligible for both MBBS & BDS:</strong> Your score ({mdcatScore}/200 ={' '}
                      {((mdcatScore / 200) * 100).toFixed(1)}%) clears the mandatory 55% MBBS threshold (110 marks) and 50% BDS threshold.
                    </p>
                  ) : mdcatScore >= 100 ? (
                    <p className="text-amber-700 dark:text-amber-400 font-medium">
                      ⚠️ <strong>Eligible for BDS Only:</strong> Your score ({mdcatScore}/200 ={' '}
                      {((mdcatScore / 200) * 100).toFixed(1)}%) meets the 50% BDS threshold (100 marks), but is below the 55% MBBS cutoff (110 marks).
                    </p>
                  ) : mdcatScore > 0 ? (
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      ❌ <strong>Below PMDC Passing Cutoff:</strong> PMDC requires minimum 50% (100 marks) for BDS and 55% (110 marks) for MBBS admission.
                    </p>
                  ) : (
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Enter your MDCAT score above to evaluate official PMDC eligibility.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Specialized / Army Medical College (NUMS) & AKU test fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* NUMS Test */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                    NUMS Entry Test (Army Medical College)
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Max: 150</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={150}
                  value={numsScore || ''}
                  onChange={(e) => updateTestScore('nums', Math.min(150, Math.max(0, Number(e.target.value))))}
                  placeholder="e.g. 125 (/150)"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Required for AMC Rawalpindi & CMH constituent medical colleges. Falls back to MDCAT if not taken.
                </p>
              </div>

              {/* AKU Internal Test */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Aga Khan University (AKU) Test
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Max: 100</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={akuScore || ''}
                  onChange={(e) => updateTestScore('aku', Math.min(100, Math.max(0, Number(e.target.value))))}
                  placeholder="e.g. 78 (/100)"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  AKU internal admission test percentile score.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* NON-MEDICAL: Computing, Engineering, Business, All */
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  3. Admission Test Mode
                </label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Choose whether you are applying via university entry tests or Digital SAT.
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
                  🏛️ University Tests (NET / NU / ECAT / NAT)
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
              <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Digital SAT Score (out of 1600)
                  </span>
                  <span className="text-[11px] font-mono text-teal-700 dark:text-teal-300 font-bold">
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

                {/* University SAT Policy Evaluation Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-white">FAST-NUCES Policy:</span>
                    {input.satScore >= 1200 ? (
                      <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                        ✅ Eligible for Computing & Engineering (Met 1200+ threshold)
                      </p>
                    ) : input.satScore >= 1000 ? (
                      <p className="text-amber-700 dark:text-amber-400 font-medium">
                        ⚠️ Eligible for Business (1000+), but below CS/Eng minimum (1200)
                      </p>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        ❌ Ineligible for FAST SAT route (Min 1200 for CS/Eng, 1000 for Business)
                      </p>
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-white">LUMS & IBA Karachi:</span>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      LUMS accepts SAT (typically 1350+ competitive for CS/Eng, 1300+ for SDSB). IBA offers exemption for 1400+ (CS) and 1270+ (BBA).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-white">NUST National Seats:</span>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      75% SAT + 15% FSc + 10% SSC (Min 550 per section in Math & Physics).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-white">GIKI, COMSATS, FCCU & BNU:</span>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Accepted in lieu of internal test. GIKI: 85% SAT. COMSATS: 50% SAT. FCCU & BNU accept 1000+ SAT.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Local University Test Inputs */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relevantUnisForTests.map((uni) => {
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
                            placeholder={`Score (/${uni.testTotal})`}
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
