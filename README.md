# 🎓 PakMerit: Pakistani Universities Merit Calculator & 10-Year Cutoffs (2016–2026)

> **Live & Deterministic Admissions Calculator for Pakistani Students**  
> Built for FSc, ICS, and Cambridge O/A-Level applicants targeting **NUST, FAST-NUCES, COMSATS, GIKI, PUCIT (Punjab University), and UET Lahore**.  
> **100% Free Forever ($0 Budget)** • Zero Backend • Offline PWA • No Ads • Authentic Verified Sources Only.

---

## ⚡ Key Features

1. **Simultaneous Multi-University Forward Calculator:**
   - Enter your Matric / O-Level and FSc / A-Level marks once.
   - Instantly calculates your aggregate across **all 6 top universities simultaneously** with complete mathematical transparency.
2. **Digital SAT (out of 1600) Support:**
   - Seamless toggle to calculate your aggregate using your Digital SAT score.
   - Automatically scales SAT into university test weightages:
     - **FAST-NUCES Computing:** 50% SAT ($\frac{\text{Score}}{1600} \times 100$) + 40% FSc + 10% Matric.
     - **FAST-NUCES Engineering:** 33% SAT + 50% FSc + 17% Matric.
     - **NUST (National SAT Seats):** 75% SAT + 15% FSc + 10% Matric.
     - **GIKI:** 85% SAT + 15% SSC.
     - **COMSATS:** 50% SAT + 40% FSc + 10% Matric.
3. **10-Year Historical Merit Trend Visualizer (2016–2026):**
   - Interactive SVG multi-year trend curves for high-demand disciplines (BS Computer Science, Software Engineering, AI, Data Science, Cyber Security, Electrical Engineering, Mechanical Engineering, BBA).
   - **Strict Authentication Rule:** Every data point is cited to official selection lists or circulars. If a university did not publicly archive a list (e.g. 2016 or COVID-19 2020 special policy), it is explicitly reported as **Not Found / Special Policy** rather than assumed.
   - **"You vs 10-Year Cutoffs" Overlay:** Draws the student's aggregate as a horizontal benchmark across the 10-year curve.
4. **Reverse Target Score Planner ("What score do I need?"):**
   - Pick any university program cutoff (e.g. FAST CS 74.2%) or enter a custom target aggregate.
   - Solves for the exact minimum test score required in **NET (out of 200)**, **FAST NU Test (out of 100)**, **ECAT (out of 400)**, or **Digital SAT (out of 1600)**.
5. **IBCC O/A-Level Equivalence Modal:**
   - Grade selector for 8 O-Level subjects ($A^*=90, A=85, B=75, C=65, D=55, E=45$).
   - Computes official IBCC equivalence marks out of 1100 and auto-populates the form with a single click.
6. **WhatsApp Branded Share Card:**
   - Pure HTML5 Canvas snapshot generator rendering a high-contrast 1200x675 social summary card for WhatsApp, parents, and friends.
7. **Offline-Ready Progressive Web App (PWA):**
   - Installable on mobile home screens and desktops with Service Worker caching. Works 100% offline with zero server calls.

---

## 🏛️ Supported Universities & Formulas

| University | Test Name | Total Test Marks | Official Aggregate Formula |
|---|---|:---:|---|
| **NUST** | NET / Digital SAT | 200 / 1600 | **10% Matric + 15% FSc + 75% NET/SAT** |
| **FAST-NUCES (Computing)** | NU Test / SAT / NAT | 100 / 1600 | **10% Matric + 40% FSc + 50% Test/SAT** |
| **FAST-NUCES (Engineering)** | NU Test / SAT / ECAT | 100 / 1600 | **17% Matric + 50% FSc + 33% Test/SAT** |
| **COMSATS (CUI)** | NTS-NAT / SAT | 100 / 1600 | **10% Matric + 40% FSc + 50% NTS/SAT** |
| **GIKI** | GIKI Test / SAT | 200 / 1600 | **15% SSC (Matric) + 85% Test/SAT** *(HSSC $\ge 60\%$ eligibility)* |
| **PUCIT / PU** | PU Admission Test | 100 | **75% Academic + 25% Test** *(+20 Hafiz bonus)* |
| **UET Lahore** | ECAT | 400 | **17% Matric + 50% FSc + 33% ECAT** |

---

## 💻 Tech Stack & Zero-Cost Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS.
- **Icons:** Lucide React.
- **Testing:** Vitest (20 automated unit tests covering all formulas, edge cases, and data integrity).
- **Graphics:** HTML5 Canvas API (custom 1200x675 card compositor).
- **Cost:** **$0.00 / forever**. Completely static, client-side deterministic computation. Ready to deploy to GitHub Pages, Cloudflare Pages, or Vercel Hobby.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Local Development
```bash
# Clone the repository
git clone <repo-url>
cd "projects/03-merit-calculator"

# Install dependencies
npm install

# Run local development server
npm run dev

# Run automated unit test suite
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Automated Test Suite

Run `npm test` to execute all unit tests:
```bash
npm test
```
- `tests/calculator.test.ts`: Validates aggregate percentage formulas, SAT conversions, and eligibility boundaries.
- `tests/reverse.test.ts`: Validates target score solver (achievable, unachievable, and already qualified states).
- `tests/historical_data.test.ts`: Verifies strict authentication standards (2016–2026 data integrity).
- `tests/ibcc.test.ts`: Validates Cambridge O-Level grade conversions to 1100 marks.
