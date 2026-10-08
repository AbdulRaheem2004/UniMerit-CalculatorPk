# 🏛️ Architecture & System Design — PakMerit (UniMerit-CalculatorPk)

## 1. System Overview

**PakMerit** is an open-source, client-side progressive web application (PWA) designed for Pakistani intermediate and A-Level students. It calculates admission merit aggregates simultaneously across all premier medical, computing, engineering, and business universities in Pakistan using official, verified criteria.

```mermaid
flowchart TD
    User["Student User"] --> StreamSelect["Step 1: Stream Pre-Selector\n(Medical / Computing / Engineering / Business / All)"]
    StreamSelect --> InputForm["Step 2: Adaptive Credentials Form\n(Matric, FSc/A-Level, Hafiz-e-Quran, Entry Tests/SAT)"]
    
    subgraph Engine ["Core Computational Pipeline"]
        Norm["Academic Normalizer\n(1100 vs 1200 Quran vs Part-1)"]
        Hafiz["Hafiz-e-Quran Processor\n(+20 to FSc for PMDC Medical / +20 for PU)"]
        Thresholds["Regulatory Eligibility Evaluator\n(PMDC: 55% MBBS / 50% BDS; PEC: 60% FSc)"]
        Weights["Weighted Calculation Engine\n(Multi-Stream Linear & Composite Formulas)"]
        Reverse["Reverse Target Solver\n(Exact score needed for target aggregate)"]
    end
    
    InputForm --> Norm
    Norm --> Hafiz
    Hafiz --> Thresholds
    Thresholds --> Weights
    Weights --> Reverse
    
    subgraph UI ["User Interface & Results"]
        Cards["Step 3: Multi-University Merit Roster\n(Aggregates, Badges, Campuses, Official Links)"]
        NustModal["NUST Comprehensive Modal\n(20+ Programs across SEECS, SMME, NBS, etc.)"]
        AuditModal["Official Criteria & Prospectus Audit Modal"]
        ShareCard["WhatsApp / Social Merit Summary Modal"]
    end
    
    Weights --> Cards
    Cards --> NustModal
    Cards --> AuditModal
    Cards --> ShareCard
```

---

## 2. Multi-Discipline Stream & University Routing

Universities in Pakistan frequently offer programs across multiple streams (e.g. NUST offers Computing, Engineering, Business, and Sciences; GIKI offers Engineering and Computing; LUMS offers Computing, Engineering, and Business). 

### Category Mapping Architecture
Each institution defines its primary `disciplineCategory` and an array of `categories`:

```typescript
export interface UniversityConfig {
  id: string;
  name: string;
  shortName: string;
  disciplineCategory: 'medical' | 'computing' | 'engineering' | 'business' | 'sciences' | 'general';
  categories?: ('medical' | 'computing' | 'engineering' | 'business' | 'sciences' | 'general')[];
  disciplines: string[];
  campuses: string[];
  testName: string;
  testTotal: number;
  satSupported?: boolean;
  satTotal?: number;
  satMinScore?: number;
  satNotes?: string;
  formulaDisplay: string;
  sourceUrl: string;
  weights?: { matric: number; fsc: number; test: number };
  customFormula?: string;
  eligibilityMinAcademicPct: number;
  notes?: string;
}
```

When a student selects a stream (e.g. `computing`), the UI filter matches both `uni.categories.includes(selectedCategory)` and `uni.disciplineCategory === selectedCategory`. This guarantees:
1. **Zero Duplicate Cards:** An institution is represented with clean, consolidated campus listings without redundant entries.
2. **Universal Presence:** Multi-discipline institutions cleanly appear in every field they offer.

---

## 3. Official Regulatory Formulas & Weightages

### A. Medical & Dental Stream (PMDC Regulations)
Governed by the **Pakistan Medical & Dental Council (PMDC)**:
- **Standard Formula:** $50\% \text{ MDCAT} + 40\% \text{ FSc Pre-Medical} + 10\% \text{ Matric/SSC}$
- **Hafiz-e-Quran Policy:** 20 marks added to obtained FSc marks before percentage computation.
- **Passing Thresholds:**
  - MBBS: Minimum $55\%$ ($110/200$) in MDCAT.
  - BDS: Minimum $50\%$ ($100/200$) in MDCAT.
- **Participating Institutions:** UHS Punjab (KEMU, AIMC, Nishtar, etc.), NUMS (Army Medical College AMC & CMH), Dow / DUHS Sindh, KMU KPK, Aga Khan University (AKU), Shifa Tameer-e-Millat (STMU).

### B. Computing & Information Technology Stream
- **FAST-NUCES:** $50\% \text{ NU Test / SAT} + 40\% \text{ FSc} + 10\% \text{ Matric}$. Dedicated SAT cut-off: 1200/1600.
- **NUST (Computing):** $75\% \text{ NET / SAT} + 15\% \text{ FSc} + 10\% \text{ Matric}$.
- **LUMS SBASSE:** $50\% \text{ SAT/LCAT} + 40\% \text{ Intermediate} + 10\% \text{ Matric}$.
- **COMSATS:** $50\% \text{ NTS-NAT} + 40\% \text{ FSc} + 10\% \text{ Matric}$.
- **GIKI:** $85\% \text{ Test / SAT} + 15\% \text{ SSC (Matric)}$.
- **PUCIT (Punjab University):** Custom composite:
  $$\text{Academic \%} = \frac{0.25 \times \text{Matric} + \text{FSc} + \text{Hafiz Bonus}}{0.25 \times \text{Matric Total} + \text{FSc Total}} \times 100$$
  $$\text{Aggregate} = (\text{Academic \%} \times 0.75) + (\text{PU Test \%} \times 0.25)$$

### C. Engineering Stream (Pakistan Engineering Council - PEC)
- **PEC Requirement:** Mandatory minimum $60\%$ in FSc Pre-Engineering.
- **UET Lahore:** $33\% \text{ ECAT} + 50\% \text{ FSc} + 17\% \text{ Matric}$.
- **NED University Karachi:** $60\% \text{ NED Test} + 40\% \text{ Intermediate (HSC)}$ (Matric $0\%$).
- **PIEAS Islamabad:** $60\% \text{ Written Test} + 25\% \text{ FSc} + 15\% \text{ Matric}$.
- **SSUET Karachi:** $50\% \text{ SSUET Test} + 40\% \text{ Intermediate} + 10\% \text{ Matric}$.

### D. Business & Social Sciences Stream
- **IBA Karachi:** $100\% \text{ Aptitude Test}$ determination (HSSC $\ge 65\%$ eligibility for BBA, SAT $\ge 1270$ exemption).
- **NUST NBS:** $75\% \text{ NET Business} + 15\% \text{ FSc} + 10\% \text{ Matric}$.
- **FAST BBA:** $50\% \text{ Test/SAT} + 40\% \text{ FSc} + 10\% \text{ Matric}$.
- **FCCU Lahore & BNU Lahore:** Holistic evaluation indices with institutional tests and SAT acceptance.

---

## 4. Reverse Target Score Solver Engine

The reverse solver allows a candidate to input a desired aggregate percentage $A_{\text{target}}$ and derives the exact entry test or SAT score $S_{\text{req}}$ required:

$$\text{Contribution}_{\text{academic}} = (P_{\text{matric}} \times W_{\text{matric}}) + (P_{\text{fsc}} \times W_{\text{fsc}})$$
$$\text{Contribution}_{\text{test needed}} = A_{\text{target}} - \text{Contribution}_{\text{academic}}$$
$$S_{\text{req}} = \left\lceil \frac{\text{Contribution}_{\text{test needed}}}{W_{\text{test}} \times 100} \times S_{\text{total}} \right\rceil$$

### Edge Cases Handled:
1. $S_{\text{req}} \le 0$: Student academics already achieve the target aggregate (`already_achieved`).
2. $S_{\text{req}} > S_{\text{total}}$: Mathematically impossible target score (`impossible`).
3. $W_{\text{test}} \le 0$: University does not weight entry test scores.
4. Digital SAT minimum threshold override: If $S_{\text{req}} < S_{\text{min\_sat}}$, the solver adjusts to the mandatory minimum score required for eligibility.

---

## 5. Technology Stack & Verification Pipeline

- **Frontend Core:** React 19, TypeScript 5.8, Tailwind CSS v4, Lucide React
- **Build System:** Vite 6 with tree-shaking and offline Service Worker caching
- **Testing:** Vitest 3.2 suite with 38 automated test cases covering:
  - Regulatory weights sum verification
  - PMDC medical calculations and MDCAT thresholds
  - Reverse solver edge conditions
  - IBCC equivalence conversion tables
  - Institutional HTTPS portal links
