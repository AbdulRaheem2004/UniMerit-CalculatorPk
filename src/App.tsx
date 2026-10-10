import { useState, useEffect, useMemo } from 'react';
import universitiesData from '../data/universities.json';
import { UniversityConfig, AcademicInput } from './engine/types';
import { calculateUniversityAggregate } from './engine/calculator';
import { Header } from './components/Header';
import { NavigationStrip, NavSection, WorkflowMode } from './components/NavigationStrip';
import { StreamPreSelector } from './components/StreamPreSelector';
import { MarksInputForm } from './components/MarksInputForm';
import { UniversityResults } from './components/UniversityResults';
import { ReversePlanner } from './components/ReversePlanner';
import { IBCCConverterModal } from './components/IBCCConverterModal';
import { SourceAuditModal } from './components/SourceAuditModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { AdmissionFaqSection } from './components/AdmissionFaqSection';
import { Footer } from './components/Footer';
import { Share2, ShieldCheck, Target, Calculator } from 'lucide-react';

const universities = universitiesData as UniversityConfig[];

export function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Roman Urdu guide toggle
  const [showRomanUrdu, setShowRomanUrdu] = useState<boolean>(false);

  // Navigation & Top-Level Workflow Mode ('calculator' vs 'reverse')
  const [activeNavSection, setActiveNavSection] = useState<NavSection>('stream');
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('calculator');

  // Modals state
  const [isIBCCModalOpen, setIsIBCCModalOpen] = useState<boolean>(false);
  const [ibccModalTab, setIbccModalTab] = useState<'olevel' | 'alevel'>('olevel');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [activeAuditUniId, setActiveAuditUniId] = useState<string | undefined>(undefined);

  // Reverse planner targeted university & target aggregate
  const [reverseTargetUniId, setReverseTargetUniId] = useState<string>('fast_cs');
  const [reverseDefaultTarget, setReverseDefaultTarget] = useState<number | undefined>(75.0);

  // Selected discipline stream (all, medical, computing, engineering, business)
  const [selectedDisciplineCategory, setSelectedDisciplineCategory] = useState<import('./engine/types').DisciplineCategory | 'all'>('computing');

  // Student Input State with realistic 2026 prefilled defaults (1200 SNC standard)
  const [input, setInput] = useState<AcademicInput>({
    matricObtained: 1050,
    matricTotal: 1200,
    fscObtained: 1020,
    fscTotal: 1200,
    interStream: 'pre_engineering',
    interStage: 'complete',
    isSindhOrNonQuranBoard: false,
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

  const handleSelectDisciplineCategory = (cat: import('./engine/types').DisciplineCategory | 'all') => {
    setSelectedDisciplineCategory(cat);
    if (cat === 'medical') {
      setInput((prev) => ({
        ...prev,
        useSat: false,
        interStream: prev.interStream === 'pre_engineering' ? 'pre_medical' : prev.interStream,
      }));
    }
  };

  const handleSwitchWorkflowMode = (mode: WorkflowMode) => {
    setWorkflowMode(mode);
    if (mode === 'reverse') {
      setActiveNavSection('planner');
      setTimeout(() => {
        document.getElementById('section-planner')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      setActiveNavSection('marks');
      setTimeout(() => {
        document.getElementById('section-marks')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleSelectForReverse = (uniId: string, targetAggregate?: number) => {
    setReverseTargetUniId(uniId);
    if (targetAggregate) {
      setReverseDefaultTarget(targetAggregate);
    }
    setWorkflowMode('reverse');
    setActiveNavSection('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuditForUni = (uniId?: string) => {
    setActiveAuditUniId(uniId);
    setIsAuditModalOpen(true);
  };

  const handleApplyIBCCMarks = (
    marks: number,
    target: 'matric' | 'fsc' = 'matric',
    hasFailedSubject: boolean = false,
    failureDetails?: string
  ) => {
    if (target === 'fsc') {
      setInput((prev) => ({
        ...prev,
        fscObtained: marks,
        fscTotal: 1100,
        interStream: 'alevels',
        hasFailedSubject,
        failedSubjectDetails: failureDetails,
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        matricObtained: marks,
        matricTotal: 1100,
        hasFailedSubject,
        failedSubjectDetails: failureDetails,
      }));
    }
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

      {/* Sticky Top Border Navigation Strip with Mode Switcher & Jump Tabs */}
      <NavigationStrip
        activeSection={activeNavSection}
        onSelectSection={(sec) => setActiveNavSection(sec)}
        workflowMode={workflowMode}
        onSelectWorkflowMode={handleSwitchWorkflowMode}
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

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <a
              href="#section-marks"
              onClick={(e) => {
                e.preventDefault();
                setActiveNavSection('marks');
                document.getElementById('section-marks')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-teal-950 hover:bg-teal-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Calculate My Merit</span>
            </a>
          </div>
        </div>

        {/* SECTION 1: Target Stream Pre-Selector (Always accessible at top) */}
        <section id="section-stream" className="scroll-mt-16 space-y-3">
          <StreamPreSelector
            selectedCategory={selectedDisciplineCategory}
            onSelectCategory={handleSelectDisciplineCategory}
            showRomanUrdu={showRomanUrdu}
          />
        </section>

        {/* WORKFLOW VIEW: REVERSE TARGET PLANNER AT TOP */}
        {workflowMode === 'reverse' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Prompt Banner for Reverse Mode */}
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-teal-950 dark:text-teal-200 font-medium">
                <Target className="w-5 h-5 text-teal-600 shrink-0" />
                <span>
                  <strong>🎯 Reverse Target Mode Active:</strong> Planning required entry test / SAT score directly at the top. You can adjust your Matric & FSc marks below to update targets in real-time.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWorkflowMode('calculator')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Switch to Forward Calculator</span>
              </button>
            </div>

            {/* Reverse Planner RENDERED IMMEDIATELY AT TOP */}
            <section id="section-planner" className="scroll-mt-16 space-y-3">
              <ReversePlanner
                input={input}
                universities={universities}
                selectedUniId={reverseTargetUniId}
                defaultTarget={reverseDefaultTarget}
                showRomanUrdu={showRomanUrdu}
              />
            </section>

            {/* Academic Marks Form (for tweaking background marks) */}
            <section id="section-marks" className="scroll-mt-16 space-y-3">
              <MarksInputForm
                input={input}
                onChange={setInput}
                universities={universities}
                selectedDisciplineCategory={selectedDisciplineCategory}
                onSelectDisciplineCategory={setSelectedDisciplineCategory}
                onOpenIBCC={(tab) => {
                  setIbccModalTab(tab || 'olevel');
                  setIsIBCCModalOpen(true);
                }}
                showRomanUrdu={showRomanUrdu}
              />
            </section>

            {/* University Results Cards */}
            <section id="section-results" className="scroll-mt-16 space-y-3">
              <UniversityResults
                results={calculationResults}
                selectedDisciplineCategory={selectedDisciplineCategory}
                onSelectForReverse={handleSelectForReverse}
                onOpenAudit={handleOpenAuditForUni}
                showRomanUrdu={showRomanUrdu}
              />
            </section>

            {/* Share Verified Merit Card */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold uppercase tracking-wider">
                  <Share2 className="w-4 h-4" /> Share Verified Results
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  Share your calculated merit report with parents or mentors
                </h3>
                <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
                  Generate an official WhatsApp summary image card showing your exact aggregate scores across your targeted universities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-teal-950 hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Generate WhatsApp Result Card</span>
              </button>
            </div>

            {/* Policies & SEO FAQs */}
            <section id="section-policies" className="scroll-mt-16 space-y-3">
              <AdmissionFaqSection />
            </section>
          </div>
        )}

        {/* WORKFLOW VIEW: FORWARD MERIT CALCULATOR (Standard Layout) */}
        {workflowMode === 'calculator' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* SECTION 2: Academic & Test Marks Input Form */}
            <section id="section-marks" className="scroll-mt-16 space-y-3">
              <MarksInputForm
                input={input}
                onChange={setInput}
                universities={universities}
                selectedDisciplineCategory={selectedDisciplineCategory}
                onSelectDisciplineCategory={handleSelectDisciplineCategory}
                onOpenIBCC={(tab) => {
                  setIbccModalTab(tab || 'olevel');
                  setIsIBCCModalOpen(true);
                }}
                showRomanUrdu={showRomanUrdu}
              />
            </section>

            {/* SECTION 3: Multi-University Aggregate Results */}
            <section id="section-results" className="scroll-mt-16 space-y-3">
              <UniversityResults
                results={calculationResults}
                selectedDisciplineCategory={selectedDisciplineCategory}
                onSelectForReverse={handleSelectForReverse}
                onOpenAudit={handleOpenAuditForUni}
                showRomanUrdu={showRomanUrdu}
              />
            </section>

            {/* Share Verified Merit Card */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold uppercase tracking-wider">
                  <Share2 className="w-4 h-4" /> Share Verified Results
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  Share your calculated merit report with parents or mentors
                </h3>
                <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
                  Generate an official WhatsApp summary image card showing your exact aggregate scores across your targeted universities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-teal-950 hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Generate WhatsApp Result Card</span>
              </button>
            </div>

            {/* SECTION 4: Reverse Target Score Planner */}
            <section id="section-planner" className="scroll-mt-16 space-y-3">
              <ReversePlanner
                input={input}
                universities={universities}
                selectedUniId={reverseTargetUniId}
                defaultTarget={reverseDefaultTarget}
                showRomanUrdu={showRomanUrdu}
              />
            </section>

            {/* SECTION 5: Official Admissions Policy & SEO FAQ Guide */}
            <section id="section-policies" className="scroll-mt-16 space-y-3">
              <AdmissionFaqSection />
            </section>
          </div>
        )}
      </main>

      {/* Modals */}
      <IBCCConverterModal
        isOpen={isIBCCModalOpen}
        onClose={() => setIsIBCCModalOpen(false)}
        onApply={handleApplyIBCCMarks}
        initialTab={ibccModalTab}
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
        selectedCategory={selectedDisciplineCategory}
      />

      {/* Footer */}
      <Footer onOpenAudit={() => handleOpenAuditForUni()} />
    </div>
  );
}
export default App;
