import React from 'react';
import { Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAudit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAudit }) => {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-10 text-xs text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Mission */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
              PakMerit 2026
            </h4>
            <p className="leading-relaxed">
              Built for Pakistani FSc, ICS, and Cambridge O/A-Level students applying to top universities across Pakistan. 100% free forever, zero ads, zero user accounts.
            </p>
          </div>

          {/* Column 2: Data Integrity & Disclaimer */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" />
              Official Data Integrity
            </h4>
            <p className="leading-relaxed">
              Every formula and weightage is derived strictly from official university prospectuses and admission circulars. Direct portal links are provided for every university.
            </p>
            <button
              onClick={onOpenAudit}
              className="text-teal-700 dark:text-teal-400 font-semibold hover:underline inline-block pt-1"
            >
              Inspect Official Formulas & Portals →
            </button>
          </div>

          {/* Column 3: Disclaimer */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
              Important Disclaimer
            </h4>
            <p className="leading-relaxed">
              Calculated aggregates provide exact planning calculations based on declared university formulas. Official admission offers and final selection lists are issued exclusively by each university.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} PakMerit. Open-Source Educational Utility.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Pakistani students.
          </p>
        </div>
      </div>
    </footer>
  );
};
