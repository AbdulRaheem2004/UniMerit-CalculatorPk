import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: React.ReactNode;
  category: 'gap-year' | 'curriculum' | 'formulas' | 'sat';
}

export const AdmissionFaqSection: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>('gap-year');

  const faqs: FaqItem[] = [
    {
      id: 'gap-year',
      question: 'Does NUST deduct 5% marks if a student takes a gap year or repeats NET?',
      shortAnswer: 'Official NUST Policy: No deduction (0%). Gap-year and fresh students are treated 100% equally.',
      category: 'gap-year',
      detailedAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p>
            A persistent myth among Pakistani students suggests that NUST deducts 2% or 5% of your aggregate if you take a gap year or re-appear as an improver. 
            <strong> This is completely incorrect.</strong>
          </p>
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1.5 text-teal-900 dark:text-teal-200">
            <div className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Official NUST Undergraduate Admission Regulations:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 ml-1 text-[11px]">
              <li>
                <strong>Fresh Applicants (Result Awaiting):</strong> Evaluated using <strong>FSc Part-1 marks</strong> (out of 520, 550, or 555) for the 15% intermediate weightage.
              </li>
              <li>
                <strong>Gap-Year & Completed Applicants:</strong> Evaluated using their <strong>Complete FSc marks</strong> (Part 1 + Part 2, out of 1100 or 1200) for the 15% intermediate weightage.
              </li>
              <li>
                <strong>Identical Formula:</strong> Both groups are calculated with the exact same formula: <code className="font-mono bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded">10% Matric + 15% FSc + 75% NET</code>.
              </li>
            </ul>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
            <strong>Where does gap-year deduction actually happen?</strong> Punjab University (PU / PUCIT) has an official Late Session Policy that deducts <strong>2 marks per late session (year)</strong> from academic marks. NUST, FAST, and COMSATS do not deduct marks for gap years.
          </div>
        </div>
      ),
    },
    {
      id: 'curriculum-1200',
      question: 'Why are Intermediate and Matric marks out of 1200 now instead of 1100?',
      shortAnswer: 'Punjab Educational Boards and FBISE introduced compulsory Tarjuma-tul-Quran (100 marks total).',
      category: 'curriculum',
      detailedAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p>
            Under the revised Single National Curriculum in Punjab and Federal Boards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="font-semibold text-zinc-900 dark:text-white block mb-1">
                📖 Intermediate Scheme (HSSC)
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li><strong>11th Class (Part-1):</strong> 50 Marks (Tarjuma-tul-Quran)</li>
                <li><strong>12th Class (Part-2):</strong> 50 Marks (Tarjuma-tul-Quran)</li>
                <li><strong>Total HSSC Marks:</strong> Revised from <strong>1100 to 1200 marks</strong>.</li>
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="font-semibold text-zinc-900 dark:text-white block mb-1">
                🎓 Matriculation Scheme (SSC)
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li><strong>9th Class:</strong> 50 Marks (Tarjuma-tul-Quran)</li>
                <li><strong>10th Class:</strong> 50 Marks (Tarjuma-tul-Quran)</li>
                <li><strong>Total SSC Marks:</strong> Revised to <strong>1200 marks</strong> in Punjab Boards.</li>
              </ul>
            </div>
          </div>
          <p className="text-[11px]">
            <strong>How our calculator ensures fairness:</strong> All university formulas rely on the exact percentage ratio <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">(Obtained / Total) × 100</code>. Whether your marks are out of 1100, 1200, or Cambridge equivalence, our engine calculates the true mathematical contribution.
          </p>
        </div>
      ),
    },
    {
      id: 'formulas-verified',
      question: 'Are all admission formulas verified and updated till date for 2025/2026?',
      shortAnswer: 'Yes. All formulas are verified against current university prospectuses and admission circulars.',
      category: 'formulas',
      detailedAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p>
            PakMerit strictly uses deterministic, officially sanctioned criteria verified for the current <strong>2025/2026 undergraduate admissions cycle</strong>:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
              <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold">
                <tr>
                  <th className="p-2 border-b border-zinc-200 dark:border-zinc-700">University</th>
                  <th className="p-2 border-b border-zinc-200 dark:border-zinc-700">Official Weightage Formula</th>
                  <th className="p-2 border-b border-zinc-200 dark:border-zinc-700">Key Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr>
                  <td className="p-2 font-medium">NUST</td>
                  <td className="p-2 font-mono">10% Matric + 15% FSc + 75% NET / SAT</td>
                  <td className="p-2">Best of 4 NET series; SAT min 1100</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">FAST-NUCES (CS)</td>
                  <td className="p-2 font-mono">10% Matric + 40% FSc + 50% NU Test / SAT</td>
                  <td className="p-2">Negative marking in NU Test (-0.25); SAT min 1200</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">FAST-NUCES (Engg)</td>
                  <td className="p-2 font-mono">17% Matric + 50% FSc + 33% Test / ECAT</td>
                  <td className="p-2">PEC engineering standard criteria</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">COMSATS (CUI)</td>
                  <td className="p-2 font-mono">10% Matric + 40% FSc + 50% NTS-NAT / SAT</td>
                  <td className="p-2">NTS-NAT validity 1 year</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">GIKI</td>
                  <td className="p-2 font-mono">15% SSC (Matric) + 85% Test / SAT</td>
                  <td className="p-2">FSc ≥60% eligibility check only</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">PUCIT / PU</td>
                  <td className="p-2 font-mono">75% Academic + 25% PU Test</td>
                  <td className="p-2">+20 Marks for certified Hafiz-e-Quran</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">UET Lahore</td>
                  <td className="p-2 font-mono">17% Matric + 50% FSc + 33% ECAT</td>
                  <td className="p-2">UET ECAT mandatory for domestic seats</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'sat-policy',
      question: 'How does Digital SAT (out of 1600) work for Pakistani universities?',
      shortAnswer: 'SAT is supported by FAST, NUST, COMSATS, and GIKI, with scaled test weightages.',
      category: 'sat',
      detailedAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p>
            Applicants with a Digital SAT score (400–1600) can apply to top Pakistani universities without taking the local entry test in many disciplines:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-[11px]">
            <li>
              <strong>FAST-NUCES:</strong> Accepts SAT-I for Computing & Engineering. Requires a <strong>minimum score of 1200/1600</strong>. The score is scaled as <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">(Score / 1600) × 100</code> into the 50% or 33% test weightage.
            </li>
            <li>
              <strong>NUST:</strong> National SAT Seats require minimum 550 each in Math and Physics (Engineering/Computing), contributing <strong>75%</strong> to aggregate.
            </li>
            <li>
              <strong>GIKI:</strong> Accepts SAT in lieu of the GIKI entrance test, carrying <strong>85% weightage</strong> in the overall merit.
            </li>
            <li>
              <strong>Domestic Exclusions:</strong> <em>Punjab University (PUCIT)</em> and regular domestic seats at <em>UET Lahore</em> do not accept SAT; domestic applicants must sit the PU Test or ECAT.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">
              Official Admissions Criteria & FAQs (Updated 2025/2026)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Verified policies on NUST gap year deduction, 1200 marks scheme, and official formulas.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Formulas Updated Till Date</span>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openItem === faq.id;
          return (
            <div
              key={faq.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenItem(isOpen ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/70 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="space-y-0.5 pr-3">
                  <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {faq.shortAnswer}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-teal-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-4 pt-2 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-in fade-in duration-150">
                  {faq.detailedAnswer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
