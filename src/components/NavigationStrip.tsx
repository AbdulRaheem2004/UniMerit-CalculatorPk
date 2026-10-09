import React, { useState } from 'react';
import {
  Compass,
  FileSpreadsheet,
  GraduationCap,
  Target,
  BookOpen,
  Menu,
  Calculator,
  ChevronsUpDown,
} from 'lucide-react';

export type NavSection = 'stream' | 'marks' | 'results' | 'planner' | 'policies';
export type WorkflowMode = 'calculator' | 'reverse';

interface NavigationStripProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  workflowMode: WorkflowMode;
  onSelectWorkflowMode: (mode: WorkflowMode) => void;
}

export const NavigationStrip: React.FC<NavigationStripProps> = ({
  activeSection,
  onSelectSection,
  workflowMode,
  onSelectWorkflowMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections: { id: NavSection; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'stream', label: '1. Target Stream', shortLabel: '1. Stream', icon: Compass },
    { id: 'marks', label: '2. Academic Marks', shortLabel: '2. Marks', icon: FileSpreadsheet },
    { id: 'results', label: '3. University Merits', shortLabel: '3. Merits', icon: GraduationCap },
    { id: 'planner', label: '4. Reverse Planner', shortLabel: '4. Planner', icon: Target },
    { id: 'policies', label: '5. Official Policies', shortLabel: '5. Policies', icon: BookOpen },
  ];

  const handleNavClick = (sectionId: NavSection) => {
    onSelectSection(sectionId);
    setIsMobileMenuOpen(false);

    if (sectionId === 'planner') {
      onSelectWorkflowMode('reverse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(`section-${sectionId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 gap-3">
          {/* Left: Top-Level Workflow Mode Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shrink-0">
            <button
              type="button"
              onClick={() => {
                onSelectWorkflowMode('calculator');
                onSelectSection('marks');
                const elem = document.getElementById('section-marks');
                if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workflowMode === 'calculator'
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Forward Merit Calculator</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectWorkflowMode('reverse');
                onSelectSection('planner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workflowMode === 'reverse'
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Reverse Target Planner</span>
            </button>
          </div>

          {/* Center / Right: Section Jump Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleNavClick(sec.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white font-bold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Section Jump Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {sections.find((s) => s.id === activeSection)?.shortLabel || 'Jump'}
              </span>
              <ChevronsUpDown className="w-3 h-3 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Jump To Section:
            </div>
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleNavClick(sec.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-teal-700 text-white dark:bg-teal-600'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{sec.label}</span>
                  </div>
                  {isActive && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
