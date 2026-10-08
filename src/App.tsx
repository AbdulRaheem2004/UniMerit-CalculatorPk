import { useState, useEffect, useMemo } from 'react';
import universitiesData from '../data/universities.json';
import { UniversityConfig, AcademicInput } from './engine/types';
import { calculateUniversityAggregate } from './engine/calculator';
import { Header } from './components/Header';
import { StreamPreSelector } from './components/StreamPreSelector';
import { MarksInputForm } from './components/MarksInputForm';
import { UniversityResults } from './components/UniversityResults';
import { ReversePlanner } from './components/ReversePlanner';
import { IBCCConverterModal } from './components/IBCCConverterModal';
import { SourceAuditModal } from './components/SourceAuditModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { AdmissionFaqSection } from './components/AdmissionFaqSection';
import { Footer } from './components/Footer';
import { Share2, ShieldCheck } from 'lucide-react';

const universities = universitiesData as UniversityConfig[];

export function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Roman Urdu guide toggle
  const [showRomanUrdu, setShowRomanUrdu] = useState<boolean>(false);

  // Modals state
  const [isIBCCModalOpen, setIsIBCCModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [activeAuditUniId, setActiveAuditUniId] = useState<string | undefined>(undefined);

  // Reverse planner targeted university & target aggregate
  const [reverseTargetUniId, setReverseTargetUniId] = useState<string>('fast_cs');
  const [reverseDefaultTarget, setReverseDefaultTarget] = useState<number | undefined>(75.0);

  // Selected discipline stream (all, medical, computing, engineering, business)
  const [selectedDisciplineCategory, setSelectedDisciplineCategory] = useState<import('./engine/types').DisciplineCategory | 'all'>('computing');

  // Student Input State with realistic prefilled defaults
  const [input, setInput] = useState<AcademicInput>({
    matricObtained: 980,
    matricTotal: 1100,
    fscObtained: 920,
    fscTotal: 1100,
    hafizQuran: false,
    useSat: false,
    satScore: 1350,
    entryTestScores: {
      mdcat: 172,
      nums: 125,
      aku: 80,
      nust: 155,
      nust_eng: 155,
      nust_business: 155,
      fast_cs: 74,
      fast_eng: 74,
      fast_bba: 74,
      comsats: 80,
      giki: 150,
      pucit: 75,
      uet: 280,
      iba_cs: 78,
      iba_business: 78,
      ned: 75,
      pieas: 75,
      ssuet: 75,
      fccu: 75,
      bnu: 75,
    },
  });

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Compute results dynamically for all universities
  const calculationResults = useMemo(() => {
    return universities.map((uni) => calculateUniversityAggregate(input, uni));
  }, [input]);

  const handleSelectForReverse = (uniId: string, targetAggregate?: number) => {
    setReverseTargetUniId(uniId);
    if (targetAggregate) {
      setReverseDefaultTarget(targetAggregate);
    }
    const elem = document.getElementById('reverse-planner');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuditForUni = (uniId?: string) => {
    setActiveAuditUniId(uniId);
    setIsAuditModalOpen(true);
  };

  const handleApplyIBCCMarks = (marks: number) => {
    setInput((prev) => ({
      ...prev,
      matricObtained: marks,
      matricTotal: 1100,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        showRomanUrdu={showRomanUrdu}
        toggleRomanUrdu={() => setShowRomanUrdu(!showRomanUrdu)}
        onOpenAudit={() => handleOpenAuditForUni()}
      />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 flex-1 space-y-8 w-full">
        {/* Hero Notice Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-700/60 text-teal-200 uppercase tracking-wider inline-block">
                Fall 2025/2026 Admissions
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Formulas Verified & Updated Till Date</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Pakistani Universities Merit Calculator
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl">
              Calculate your exact aggregate for Medical (UHS, NUMS, Dow, KMU, AKU, Shifa), Computing (FAST, NUST, LUMS, IBA, COMSATS, GIKI, PUCIT), Engineering (UET, NED, PIEAS, SSUET), and Business universities simultaneously. Verified with PMDC, PEC, and HEC official regulations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-teal-950 hover:bg-teal-50 transition-colors shadow-sm flex items-center gap-2 shrink-0"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Generate WhatsApp Card</span>
          </button>
        </div>

        {/* Step 1: Pre-Selection Stream Menu */}
        <StreamPreSelector
          selectedCategory={selectedDisciplineCategory}
          onSelectCategory={setSelectedDisciplineCategory}
          showRomanUrdu={showRomanUrdu}
        />

        {/* Step 2: Academic & Test Marks Input Form */}
        <MarksInputForm
          input={input}
          onChange={setInput}
          universities={universities}
          selectedDisciplineCategory={selectedDisciplineCategory}
          onSelectDisciplineCategory={setSelectedDisciplineCategory}
          onOpenIBCC={() => setIsIBCCModalOpen(true)}
          showRomanUrdu={showRomanUrdu}
        />

        {/* 2. Simultaneous Multi-University Aggregate Results */}
        <UniversityResults
          results={calculationResults}
          selectedDisciplineCategory={selectedDisciplineCategory}
          onSelectForReverse={handleSelectForReverse}
          onOpenAudit={handleOpenAuditForUni}
          showRomanUrdu={showRomanUrdu}
        />

        {/* 3. Reverse Target Score Planner ("What score do I need?") */}
        <ReversePlanner
          input={input}
          universities={universities}
          selectedUniId={reverseTargetUniId}
          defaultTarget={reverseDefaultTarget}
          showRomanUrdu={showRomanUrdu}
        />

        {/* 4. Official Admissions Policy & SEO FAQ Guide */}
        <AdmissionFaqSection />
      </main>

      {/* Floating Share Button on Mobile */}
      <div className="fixed bottom-5 right-5 z-20 sm:hidden">
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="p-3.5 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center"
          aria-label="Share via WhatsApp"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Modals */}
      <IBCCConverterModal
        isOpen={isIBCCModalOpen}
        onClose={() => setIsIBCCModalOpen(false)}
        onApply={handleApplyIBCCMarks}
      />

      <SourceAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        universities={universities}
        activeUniId={activeAuditUniId}
      />

      <WhatsAppShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        input={input}
        results={calculationResults}
      />

      {/* Footer */}
      <Footer onOpenAudit={() => handleOpenAuditForUni()} />
    </div>
  );
}
export default App;
