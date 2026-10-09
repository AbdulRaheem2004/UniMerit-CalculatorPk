import { useState, useEffect, useMemo } from 'react';
import universitiesData from '../data/universities.json';
import { UniversityConfig, AcademicInput } from './engine/types';
import { calculateUniversityAggregate } from './engine/calculator';
import { Header } from './components/Header';
import { NavigationStrip, NavSection, ViewMode } from './components/NavigationStrip';
import { StreamPreSelector } from './components/StreamPreSelector';
import { MarksInputForm } from './components/MarksInputForm';
import { UniversityResults } from './components/UniversityResults';
import { ReversePlanner } from './components/ReversePlanner';
import { IBCCConverterModal } from './components/IBCCConverterModal';
import { SourceAuditModal } from './components/SourceAuditModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { AdmissionFaqSection } from './components/AdmissionFaqSection';
import { Footer } from './components/Footer';
import { Share2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const universities = universitiesData as UniversityConfig[];

export function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Roman Urdu guide toggle
  const [showRomanUrdu, setShowRomanUrdu] = useState<boolean>(false);

  // Navigation & Multi-Page View Mode
  const [activeNavSection, setActiveNavSection] = useState<NavSection>('stream');
  const [viewMode, setViewMode] = useState<ViewMode>('full');

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

  const handleSelectForReverse = (uniId: string, targetAggregate?: number) => {
    setReverseTargetUniId(uniId);
    if (targetAggregate) {
      setReverseDefaultTarget(targetAggregate);
    }
    setActiveNavSection('planner');
    if (viewMode === 'full') {
      const elem = document.getElementById('section-planner');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
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

      {/* Sticky Top Border Navigation Strip with Jump Tabs & Multi-Page Toggle */}
      <NavigationStrip
        activeSection={activeNavSection}
        onSelectSection={(sec) => setActiveNavSection(sec)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
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
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-teal-950 hover:bg-teal-50 transition-colors shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Generate WhatsApp Card</span>
          </button>
        </div>

        {/* SECTION 1: Step 1 - Pre-Selection Stream Menu */}
        {(viewMode === 'full' || activeNavSection === 'stream') && (
          <section id="section-stream" className="scroll-mt-16 space-y-3">
            <StreamPreSelector
              selectedCategory={selectedDisciplineCategory}
              onSelectCategory={(cat) => {
                setSelectedDisciplineCategory(cat);
                if (viewMode === 'step') {
                  setActiveNavSection('marks');
                }
              }}
              showRomanUrdu={showRomanUrdu}
            />
            {viewMode === 'step' && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveNavSection('marks')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Continue to Academic Marks (Step 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: Step 2 - Academic & Test Marks Input Form */}
        {(viewMode === 'full' || activeNavSection === 'marks') && (
          <section id="section-marks" className="scroll-mt-16 space-y-3">
            <MarksInputForm
              input={input}
              onChange={setInput}
              universities={universities}
              selectedDisciplineCategory={selectedDisciplineCategory}
              onSelectDisciplineCategory={setSelectedDisciplineCategory}
              onOpenIBCC={() => setIsIBCCModalOpen(true)}
              showRomanUrdu={showRomanUrdu}
            />
            {viewMode === 'step' && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveNavSection('stream')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Streams</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNavSection('results')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Calculate & View University Merits (Step 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* SECTION 3: Step 3 - Multi-University Aggregate Results */}
        {(viewMode === 'full' || activeNavSection === 'results') && (
          <section id="section-results" className="scroll-mt-16 space-y-3">
            <UniversityResults
              results={calculationResults}
              selectedDisciplineCategory={selectedDisciplineCategory}
              onSelectForReverse={handleSelectForReverse}
              onOpenAudit={handleOpenAuditForUni}
              showRomanUrdu={showRomanUrdu}
            />
            {viewMode === 'step' && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveNavSection('marks')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Marks</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNavSection('planner')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Plan Required Entry Test Score (Step 4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* SECTION 4: Step 4 - Reverse Target Score Planner */}
        {(viewMode === 'full' || activeNavSection === 'planner') && (
          <section id="section-planner" className="scroll-mt-16 space-y-3">
            <ReversePlanner
              input={input}
              universities={universities}
              selectedUniId={reverseTargetUniId}
              defaultTarget={reverseDefaultTarget}
              showRomanUrdu={showRomanUrdu}
            />
            {viewMode === 'step' && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveNavSection('results')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Merits</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNavSection('policies')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Official Policies & FAQs (Step 5)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* SECTION 5: Step 5 - Official Admissions Policy & SEO FAQ Guide */}
        {(viewMode === 'full' || activeNavSection === 'policies') && (
          <section id="section-policies" className="scroll-mt-16 space-y-3">
            <AdmissionFaqSection />
            {viewMode === 'step' && (
              <div className="flex justify-start pt-2">
                <button
                  type="button"
                  onClick={() => setActiveNavSection('stream')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Recalculate (Back to Step 1)</span>
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Floating Share Button on Mobile */}
      <div className="fixed bottom-5 right-5 z-20 sm:hidden">
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="p-3.5 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center cursor-pointer"
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
