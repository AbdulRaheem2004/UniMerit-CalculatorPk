import React from 'react';
import { DisciplineCategory } from '../engine/types';
import { Stethoscope, Laptop, Cpu, Briefcase, Globe, CheckCircle2, ChevronRight } from 'lucide-react';

interface StreamPreSelectorProps {
  selectedCategory: DisciplineCategory | 'all';
  onSelectCategory: (category: DisciplineCategory | 'all') => void;
  showRomanUrdu?: boolean;
}

interface StreamOption {
  id: DisciplineCategory | 'all';
  title: string;
  subtitle: string;
  urduSubtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  tests: string[];
  universitiesSummary: string;
}

export const StreamPreSelector: React.FC<StreamPreSelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  showRomanUrdu = false,
}) => {
  const options: StreamOption[] = [
    {
      id: 'medical',
      title: 'Medical & Dental',
      subtitle: 'MBBS & BDS (Public & Private Colleges)',
      urduSubtitle: 'Doctor bannay ke liye: MBBS aur BDS public wa private colleges',
      icon: Stethoscope,
      accentColor: 'from-rose-600 to-pink-700',
      borderColor: 'border-rose-400 dark:border-rose-600',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
      badgeText: 'text-rose-700 dark:text-rose-300',
      tests: ['MDCAT (200)', 'NUMS (150)', 'PMDC 50-40-10'],
      universitiesSummary: 'UHS Punjab (KEMU/AIMC/Nishtar), NUMS (AMC Rawalpindi), Dow (DUHS Sindh), KMU KPK, Aga Khan University (AKU), Shifa (STMU)',
    },
    {
      id: 'computing',
      title: 'Computing & Software',
      subtitle: 'CS, Software Eng, AI, Data Science & Cyber',
      urduSubtitle: 'Computer Science, AI, Software Engineering aur IT fields',
      icon: Laptop,
      accentColor: 'from-teal-600 to-emerald-700',
      borderColor: 'border-teal-400 dark:border-teal-600',
      badgeBg: 'bg-teal-100 dark:bg-teal-950/60',
      badgeText: 'text-teal-700 dark:text-teal-300',
      tests: ['NUST NET', 'FAST NU', 'Digital SAT', 'NAT-ICS'],
      universitiesSummary: 'FAST-NUCES, NUST SEECS, LUMS, IBA Karachi, COMSATS, GIKI, PUCIT, UET, NED, PIEAS, SSUET, FCCU, BNU',
    },
    {
      id: 'engineering',
      title: 'Engineering & Tech',
      subtitle: 'Electrical, Mechanical, Civil, Chemical (PEC)',
      urduSubtitle: 'Pakistan Engineering Council (PEC) approved engineering degrees',
      icon: Cpu,
      accentColor: 'from-amber-600 to-orange-700',
      borderColor: 'border-amber-400 dark:border-amber-600',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeText: 'text-amber-700 dark:text-amber-300',
      tests: ['ECAT (400)', 'NET Eng', 'GIKI Test', 'NED Test'],
      universitiesSummary: 'NUST, GIKI, UET Lahore, NED Karachi, PIEAS Islamabad, SSUET, FAST Eng, COMSATS Eng, LUMS',
    },
    {
      id: 'business',
      title: 'Business & Management',
      subtitle: 'BBA, Accounting, FinTech & Economics',
      urduSubtitle: 'BBA, Finance, Marketing aur Business analytics programs',
      icon: Briefcase,
      accentColor: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-400 dark:border-blue-600',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
      badgeText: 'text-blue-700 dark:text-blue-300',
      tests: ['IBA Test', 'LUMS SAT/LCAT', 'NET Business', 'NAT-IE'],
      universitiesSummary: 'IBA Karachi, LUMS SDSB, NUST NBS, FAST Business, COMSATS, FCCU, BNU',
    },
    {
      id: 'all',
      title: 'All Universities & Fields',
      subtitle: 'Compare merit across all 25+ institutions',
      urduSubtitle: 'Tamam shobon aur verified universitiyon ka aik sath muazna',
      icon: Globe,
      accentColor: 'from-zinc-700 to-zinc-900 dark:from-zinc-600 dark:to-zinc-800',
      borderColor: 'border-zinc-400 dark:border-zinc-500',
      badgeBg: 'bg-zinc-100 dark:bg-zinc-800',
      badgeText: 'text-zinc-700 dark:text-zinc-300',
      tests: ['All Portals', 'Cross-Discipline', 'Full Roster'],
      universitiesSummary: 'Complete roster of verified medical, engineering, computing, and business institutions across Pakistan',
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Title & Prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            Step 1: Target Stream
          </span>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 mt-0.5">
            What type of university are you targeting?
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {showRomanUrdu
              ? 'Pehle apna maqsood shoba chunein taake sirf zaroori tests aur mutaliqa universities samnay aayen.'
              : 'Select your field to adapt required test inputs and calculate exact verified merits.'}
          </p>
        </div>

        <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1 self-start sm:self-auto bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
          <span>Multi-discipline universities appear in every group they offer</span>
        </div>
      </div>

      {/* Grid of Selectable Stream Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedCategory === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectCategory(opt.id)}
              className={`relative flex flex-col justify-between text-left p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? `${opt.borderColor} bg-gradient-to-b ${opt.accentColor} text-white shadow-md transform -translate-y-0.5`
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'
              }`}
            >
              {/* Top Row: Icon & Status Check */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-xs'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 shrink-0 transition-transform group-hover:translate-x-0.5" />
                )}
              </div>

              {/* Card Body */}
              <div className="space-y-1 mb-2.5">
                <h3 className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                  {opt.title}
                </h3>
                <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-white/90' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {showRomanUrdu ? opt.urduSubtitle : opt.subtitle}
                </p>
              </div>

              {/* Bottom Tag / Test Badges */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10 mt-auto">
                <div className="flex flex-wrap gap-1">
                  {opt.tests.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : `${opt.badgeBg} ${opt.badgeText}`
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
