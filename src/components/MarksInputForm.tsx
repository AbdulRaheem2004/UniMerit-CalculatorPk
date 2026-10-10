import React, { useState } from 'react';
import { AcademicInput, UniversityConfig, DisciplineCategory, InterStream } from '../engine/types';
import { calculatePercentage } from '../engine/calculator';
import {
  Calculator,
  Sparkles,
  Layers,
  Stethoscope,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Info,
  Building2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Wand2,
  RotateCcw,
} from 'lucide-react';

interface MarksInputFormProps {
  input: AcademicInput;
  onChange: (updated: AcademicInput) => void;
  universities: UniversityConfig[];
  selectedDisciplineCategory: DisciplineCategory | 'all';
  onSelectDisciplineCategory: (category: DisciplineCategory | 'all') => void;
  onOpenIBCC: (tab?: 'olevel' | 'alevel') => void;
  showRomanUrdu: boolean;
}

const SAMPLE_TEST_SCORES: Record<string, number> = {
  mdcat: 172,
  nums: 125,
  aku: 78,
  nust: 154,
  nust_eng: 154,
  nust_business: 154,
  fast_cs: 74,
  fast_eng: 74,
  fast_bba: 74,
  comsats: 84,
  comsats_eng: 84,
  comsats_business: 84,
  giki: 158,
  pucit: 82,
  uet: 288,
  ned: 78,
  pieas: 76,
  fccu: 75,
  bnu: 72,
  ssuet: 70,
  iba_cs: 80,
  iba_business: 80,
  lums_cs: 80,
  lums_eng: 80,
  lums_business: 80,
};

const SECONDARY_UNI_IDS = new Set(['ned', 'pieas', 'fccu', 'bnu', 'ssuet']);

export const MarksInputForm: React.FC<MarksInputFormProps> = ({
  input,
  onChange,
  universities,
  selectedDisciplineCategory,
  onSelectDisciplineCategory: _onSelectDisciplineCategory,
  onOpenIBCC,
  showRomanUrdu,
}) => {
  const [showDualLocalTests, setShowDualLocalTests] = useState<boolean>(false);
  const [showAdditionalTests, setShowAdditionalTests] = useState<boolean>(false);

  const handlePrefillSampleScores = () => {
    onChange({
      ...input,
      satScore: input.useSat ? 1350 : input.satScore,
      entryTestScores: {
        ...input.entryTestScores,
        ...SAMPLE_TEST_SCORES,
      },
    });
  };

  const handleClearScores = () => {
    onChange({
      ...input,
      satScore: 0,
      entryTestScores: {},
    });
  };

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

  const matricError =
    input.matricObtained < 0
      ? 'Obtained marks cannot be negative'
      : input.matricTotal <= 0
      ? 'Total marks must be greater than zero'
      : input.matricObtained > input.matricTotal
      ? 'Obtained marks cannot exceed total marks'
      : null;

  const fscError =
    input.fscObtained < 0
      ? 'Obtained marks cannot be negative'
      : input.fscTotal <= 0
      ? 'Total marks must be greater than zero'
      : input.fscObtained > input.fscTotal
      ? 'Obtained marks cannot exceed total marks'
      : null;

  const satError =
    input.useSat && input.satScore < 0
      ? 'SAT score cannot be negative'
      : input.useSat && (input.satScore > 1600 || input.satScore < 400) && input.satScore > 0
      ? 'Digital SAT score is typically between 400 and 1600'
      : null;

  // Filter universities for entry tests display based on selected category
  const relevantUnisForTests = universities.filter((uni) => {
    if (selectedDisciplineCategory === 'all') return true;
    if (uni.categories && uni.categories.includes(selectedDisciplineCategory)) return true;
    return uni.disciplineCategory === selectedDisciplineCategory;
  });

  const primaryUnis = relevantUnisForTests.filter((uni) => !SECONDARY_UNI_IDS.has(uni.id));
  const secondaryUnis = relevantUnisForTests.filter((uni) => SECONDARY_UNI_IDS.has(uni.id));
  const hasSecondaryScore = secondaryUnis.some((uni) => (input.entryTestScores[uni.id] ?? 0) > 0);

  // Filter universities that support Digital SAT
  const satSupportedUnis = universities.filter((uni) => {
    if (!uni.satSupported) return false;
    if (selectedDisciplineCategory === 'all') return true;
    if (uni.categories && uni.categories.includes(selectedDisciplineCategory)) return true;
    return uni.disciplineCategory === selectedDisciplineCategory;
  });

  const isMedicalMode = selectedDisciplineCategory === 'medical';
  const mdcatScore = input.entryTestScores['mdcat'] ?? 0;
  const numsScore = input.entryTestScores['nums'] ?? 0;
  const akuScore = input.entryTestScores['aku'] ?? 0;

  const matricPct = calculatePercentage(input.matricObtained, input.matricTotal);
  const effectiveFscObtained = input.hafizQuran && isMedicalMode
    ? Math.min(input.fscTotal, input.fscObtained + 20)
    : input.fscObtained;
  const fscPct = calculatePercentage(effectiveFscObtained, input.fscTotal);
  const satPct = calculatePercentage(input.satScore, 1600);

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

        {/* Stream Context Indicator */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 px-3 py-1.5 rounded-xl">
          <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <div className="text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Target Field: </span>
            <strong className="text-teal-900 dark:text-teal-200">
              {selectedDisciplineCategory === 'medical'
                ? '🩺 Medical (MBBS & BDS)'
                : selectedDisciplineCategory === 'computing'
                ? '💻 Computing & Software'
                : selectedDisciplineCategory === 'engineering'
                ? '⚙️ Engineering (PEC)'
                : selectedDisciplineCategory === 'business'
                ? '📊 Business & Management'
                : '🌐 All Disciplines'}
            </strong>
          </div>
          <a
            href="#section-stream"
            className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline ml-1"
          >
            Change
          </a>
        </div>
      </div>

      {/* Critical Failed Subject Ineligibility Alert */}
      {input.hasFailedSubject && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border-2 border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-rose-950 dark:text-rose-100 text-xs block">
                🚨 Ineligibility Alert: Profile Contains a Failed Subject ('U' / Ungraded)
              </span>
              <p className="text-[11px] leading-relaxed text-rose-800 dark:text-rose-300">
                {input.failedSubjectDetails ||
                  "Under official IBCC regulations and admission criteria across all Pakistani universities, failing any subject means an Equivalence Certificate cannot be issued. You are not eligible for admission until cleared."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenIBCC('olevel')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-700 text-white hover:bg-rose-800 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Fix Grades in IBCC
          </button>
        </div>
      )}

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
            : '💡 Apnay Matric aur FSc ke number darj karein. Agar aap ne university test diya hai to uske number likhein, ya Digital SAT ka score likhein. Naye Quran syllabus ke sath total 1200 hai jabke Sindh Boards aur IBCC equivalence 1100 istemal karte hain.'}
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
                  const newTotal = 1200;
                  const newObtained =
                    input.matricTotal > 0 && input.matricObtained > 0
                      ? Math.min(newTotal, Math.round((input.matricObtained / input.matricTotal) * newTotal))
                      : input.matricObtained;
                  onChange({ ...input, matricTotal: newTotal, matricObtained: newObtained });
                }}
                className={`px-2 py-0.5 rounded font-medium border cursor-pointer ${
                  input.matricTotal === 1200
                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                }`}
                title="SNC / Punjab Boards with 100m Tarjuma-tul-Quran (Punjab Quran Act 2021 & FBISE 2022)"
              >
                1200 (SNC / 2026 Quran Syllabus)
              </button>
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
                className={`px-2 py-0.5 rounded font-medium border cursor-pointer ${
                  input.matricTotal === 1100
                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                }`}
                title="Sindh Boards (BIEK/BISE), IBCC O-Level Standard Scale, or Pre-2023 Repeaters"
              >
                1100 (Sindh / IBCC / Repeaters)
              </button>
              <button
                type="button"
                onClick={() => onOpenIBCC('olevel')}
                className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors flex items-center gap-1 ml-1 cursor-pointer shadow-xs"
                title="Convert Cambridge O-Level letter grades (A*, A, B) to Pakistani IBCC equivalent marks"
              >
                <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>O-Level IBCC Converter</span>
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
                onChange={(e) => updateField('matricObtained', e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="e.g. 1050"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-zinc-50 dark:bg-zinc-800 font-mono ${
                  matricError ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                } focus:outline-none focus:ring-2 focus:ring-teal-600`}
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-medium">Total Marks</span>
              <input
                type="number"
                min={1}
                value={input.matricTotal || ''}
                onChange={(e) => updateField('matricTotal', e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="1200"
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
          {matricError && <p className="text-[11px] text-red-500">{matricError}</p>}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-0.5">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-teal-600 shrink-0" />
              <span>Board Scheme:</span>
              <strong className="text-zinc-700 dark:text-zinc-300">
                {input.matricTotal === 1200
                  ? 'SNC 1200 (Tarjuma-tul-Quran 100m)'
                  : input.matricTotal === 1100
                  ? 'Sindh / IBCC 1100 Scale'
                  : `Custom ${input.matricTotal} Total`}
              </strong>
            </span>
            <span>
              Matric: <strong className="text-zinc-800 dark:text-zinc-200">{matricPct.toFixed(2)}%</strong>
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
              { id: 'pre_medical', label: 'F.Sc Pre-Medical', icon: '🩺', badge: 'Bio & Chem' },
              { id: 'pre_engineering', label: 'F.Sc Pre-Eng', icon: '⚙️', badge: 'Math & Physics' },
              { id: 'ics', label: 'ICS Comp Sci', icon: '💻', badge: 'CS & Math' },
              { id: 'icom_arts', label: 'I.Com / FA / Arts', icon: '📚', badge: 'General' },
              { id: 'alevels', label: 'Cambridge A-Levels', icon: '🌍', badge: 'IBCC Scale' },
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
                  className={`px-2.5 py-1.5 rounded-lg text-left border transition-all text-xs font-semibold cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-700 text-white dark:bg-teal-600 border-teal-800 dark:border-teal-500 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="shrink-0">{st.icon}</span>
                    <span className="leading-tight font-semibold">{st.label}</span>
                  </div>
                  <span className={`text-[9px] block font-normal opacity-80 mt-0.5 ${isCurrent ? 'text-teal-100' : 'text-zinc-400'}`}>
                    {st.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Direct IBCC Converter Trigger for A-Levels */}
          {input.interStream === 'alevels' && (
            <div className="p-2.5 rounded-lg bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-teal-950 dark:text-teal-200 animate-in fade-in">
              <span className="flex items-center gap-1.5 font-medium text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Calculate your official HSSC equivalent marks from your 3 A-Level subjects:</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenIBCC('alevel')}
                className="px-3 py-1 rounded-md text-[11px] font-bold bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                Open A-Level IBCC Calculator
              </button>
            </div>
          )}

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
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
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
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
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
                onChange={(e) => updateField('fscObtained', e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="e.g. 1020"
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
              <Info className="w-3 h-3 text-teal-600 shrink-0" />
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
              {fscPct.toFixed(2)}%
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

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handlePrefillSampleScores}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Fill realistic sample medical scores (MDCAT: 172, NUMS: 125, AKU: 78)"
                >
                  <Wand2 className="w-3 h-3 text-rose-600" />
                  <span>Sample Scores</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearScores}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Clear medical test scores"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
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
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={200}
                      value={mdcatScore || ''}
                      onChange={(e) => updateTestScore('mdcat', e.target.value === '' ? 0 : Math.min(200, Math.max(0, Number(e.target.value))))}
                      placeholder="e.g. 175"
                      className="w-full px-3 py-2 pr-7 text-base font-bold font-mono rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    {mdcatScore > 0 && (
                      <button
                        type="button"
                        onClick={() => updateTestScore('mdcat', 0)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-sm"
                        title="Clear MDCAT score"
                      >
                        ×
                      </button>
                    )}
                  </div>
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
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={150}
                    value={numsScore || ''}
                    onChange={(e) => updateTestScore('nums', e.target.value === '' ? 0 : Math.min(150, Math.max(0, Number(e.target.value))))}
                    placeholder="e.g. 125 (/150)"
                    className="w-full px-2.5 py-1.5 pr-6 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  {numsScore > 0 && (
                    <button
                      type="button"
                      onClick={() => updateTestScore('nums', 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-xs"
                      title="Clear NUMS score"
                    >
                      ×
                    </button>
                  )}
                </div>
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
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={akuScore || ''}
                    onChange={(e) => updateTestScore('aku', e.target.value === '' ? 0 : Math.min(100, Math.max(0, Number(e.target.value))))}
                    placeholder="e.g. 78 (/100)"
                    className="w-full px-2.5 py-1.5 pr-6 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  {akuScore > 0 && (
                    <button
                      type="button"
                      onClick={() => updateTestScore('aku', 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-xs"
                      title="Clear AKU score"
                    >
                      ×
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  AKU internal admission test percentile score.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* NON-MEDICAL: Computing, Engineering, Business, All */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  3. Admission Test Mode
                </label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Select your test path: Local University Tests (NET/NU/ECAT/NAT) or Digital SAT (1600).
                </p>
              </div>

              <div className="flex rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => updateField('useSat', false)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    !input.useSat
                      ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-sm font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  🏛️ Local University Tests
                </button>
                <button
                  type="button"
                  onClick={() => updateField('useSat', true)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    input.useSat
                      ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-sm font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  🎯 Digital SAT (1600 Scale)
                </button>
              </div>
            </div>

            {/* SAT Mode Enhanced Display */}
            {input.useSat ? (
              <div className="space-y-4">
                {/* Score Input Card */}
                <div className="p-4 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Digital SAT Score (out of 1600)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300">
                        {input.satScore > 0 ? `${satPct.toFixed(2)}%` : '0.00%'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-48">
                      <input
                        type="number"
                        min={400}
                        max={1600}
                        value={input.satScore || ''}
                        onChange={(e) => updateField('satScore', e.target.value === '' ? 0 : Number(e.target.value))}
                        placeholder="e.g. 1350"
                        className={`w-full px-3 py-2 text-base font-bold font-mono rounded-lg border bg-white dark:bg-zinc-900 ${
                          satError ? 'border-red-500' : 'border-teal-300 dark:border-teal-700'
                        } focus:outline-none focus:ring-2 focus:ring-teal-600`}
                      />
                    </div>
                    {/* Presets */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[10px] text-zinc-500 font-medium">Quick presets:</span>
                      {[1100, 1200, 1300, 1400, 1500].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => updateField('satScore', score)}
                          className={`px-2 py-1 rounded text-[11px] font-mono font-semibold border cursor-pointer ${
                            input.satScore === score
                              ? 'bg-teal-700 text-white border-transparent'
                              : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                  {satError && <p className="text-[11px] text-red-500">{satError}</p>}

                  {/* Why Inter & Matric Matter with SAT Banner */}
                  <div className="p-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-teal-200 dark:border-teal-900 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                    <div className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Why your Intermediate & Matric marks determine 15% to 50% of your SAT Merit:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      In Pakistan, SAT does <strong>not</strong> substitute your academic qualification. Universities integrate your SAT score with your Matric ({matricPct.toFixed(1)}%) and FSc ({fscPct.toFixed(1)}%) using official weightages:
                      <strong className="text-zinc-900 dark:text-white"> NUST (75% SAT + 15% FSc + 10% Matric)</strong>,
                      <strong className="text-zinc-900 dark:text-white"> FAST (50% SAT + 40% FSc + 10% Matric)</strong>,
                      <strong className="text-zinc-900 dark:text-white"> GIKI (85% SAT + 15% SSC)</strong>,
                      <strong className="text-zinc-900 dark:text-white"> COMSATS (50% SAT + 40% FSc + 10% Matric)</strong>, and
                      <strong className="text-zinc-900 dark:text-white"> LUMS & IBA (SAT + Mandatory FSc eligibility)</strong>.
                    </p>
                  </div>
                </div>

                {/* Interactive Target Universities with SAT Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>Universities Accepting SAT & Their Combined Formula Breakdown:</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {satSupportedUnis.length} Programs Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {satSupportedUnis.map((uni) => {
                      const weights = uni.weights ?? { matric: 0.1, fsc: 0.4, test: 0.5 };
                      const matricContrib = (matricPct * weights.matric);
                      const fscContrib = (fscPct * weights.fsc);
                      const satContrib = (satPct * weights.test);
                      const agg = (matricContrib + fscContrib + satContrib).toFixed(2);
                      const minScore = uni.satMinScore || 0;
                      const meetsThreshold = input.satScore >= minScore;
                      const meetsFsc = fscPct >= uni.eligibilityMinAcademicPct;

                      return (
                        <div
                          key={uni.id}
                          className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:border-teal-400 dark:hover:border-teal-600 transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div>
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                                {uni.shortName}
                              </h4>
                              <span className="text-[10px] text-zinc-500 font-medium block">
                                {uni.disciplines[0]}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                meetsThreshold && meetsFsc
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              }`}
                            >
                              {meetsThreshold ? `Min ${minScore}+ Met` : `Requires ${minScore}`}
                            </span>
                          </div>

                          {/* Live Combined Formula Breakdown */}
                          <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 space-y-1 font-mono text-[11px]">
                            <div className="flex justify-between text-zinc-500">
                              <span>Matric ({Math.round(weights.matric * 100)}%):</span>
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {matricContrib.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-zinc-500">
                              <span>FSc ({Math.round(weights.fsc * 100)}%):</span>
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {fscContrib.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-zinc-500">
                              <span>SAT ({Math.round(weights.test * 100)}%):</span>
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {satContrib.toFixed(2)}%
                              </span>
                            </div>
                            <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800 flex justify-between font-bold text-teal-700 dark:text-teal-400 text-xs">
                              <span>Combined Merit:</span>
                              <span>{agg}%</span>
                            </div>
                          </div>

                          {/* Policy note */}
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {uni.notes || uni.formulaDisplay}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dual Option: Expand Local Test Inputs as Well */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowDualLocalTests(!showDualLocalTests)}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Also applying to some universities via local tests (NET, ECAT, NAT)?</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 font-bold">
                      {showDualLocalTests ? 'Hide Local Test Fields' : 'Enter Local Test Scores'}
                      {showDualLocalTests ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  {showDualLocalTests && (
                    <div className="mt-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3">
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Enter your university-specific entry test scores below if taking both SAT and domestic tests:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {relevantUnisForTests.map((uni) => {
                          const currentScore = input.entryTestScores[uni.id] ?? '';
                          return (
                            <div
                              key={uni.id}
                              className="p-2.5 bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="truncate">{uni.shortName}</span>
                                <span className="text-[10px] text-zinc-400 font-mono">Max: {uni.testTotal}</span>
                              </div>
                              <div className="relative">
                                <input
                                  type="number"
                                  min={0}
                                  max={uni.testTotal}
                                  value={currentScore}
                                  onChange={(e) => updateTestScore(uni.id, e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                                  placeholder={`Score (/${uni.testTotal})`}
                                  className="w-full px-2 py-1 pr-6 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 font-mono focus:outline-none focus:ring-1 focus:ring-teal-600"
                                />
                                {Number(currentScore) > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => updateTestScore(uni.id, 0)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-xs"
                                    title="Clear score"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Local University Test Inputs */
              <div className="space-y-3">
                {/* Quick Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
                    <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Enter scores only for universities you are targeting. Unchecked tests remain neutral.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrefillSampleScores}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Prefill sample realistic test scores across all institutions"
                    >
                      <Wand2 className="w-3 h-3 text-teal-600" />
                      <span>Sample Scores</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearScores}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Clear all domestic entry test scores"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Primary National University Tests Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {primaryUnis.map((uni) => {
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
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={uni.testTotal}
                            value={currentScore}
                            onChange={(e) => updateTestScore(uni.id, e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            placeholder={`Score (/${uni.testTotal})`}
                            className="w-full px-2.5 py-1.5 pr-6 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                          />
                          {Number(currentScore) > 0 && (
                            <button
                              type="button"
                              onClick={() => updateTestScore(uni.id, 0)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-xs"
                              title="Clear score"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                          {uni.testName}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Collapsible Secondary / Regional University Tests */}
                {secondaryUnis.length > 0 && (() => {
                  const isAdditionalTestsOpen = showAdditionalTests || hasSecondaryScore;
                  return (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setShowAdditionalTests(!isAdditionalTestsOpen)}
                        className="flex items-center justify-between w-full p-2.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>
                            Additional Institutions ({secondaryUnis.map((u) => u.shortName.split(' ')[0]).join(', ')})
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 font-bold shrink-0">
                          {isAdditionalTestsOpen ? 'Collapse' : `+ Show ${secondaryUnis.length} More`}
                          {isAdditionalTestsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                      {isAdditionalTestsOpen && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in">
                          {secondaryUnis.map((uni) => {
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
                                <div className="relative">
                                  <input
                                    type="number"
                                    min={0}
                                    max={uni.testTotal}
                                    value={currentScore}
                                    onChange={(e) => updateTestScore(uni.id, e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                                    placeholder={`Score (/${uni.testTotal})`}
                                    className="w-full px-2.5 py-1.5 pr-6 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                                  />
                                  {Number(currentScore) > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => updateTestScore(uni.id, 0)}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-xs"
                                      title="Clear score"
                                    >
                                      ×
                                    </button>
                                  )}
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
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
