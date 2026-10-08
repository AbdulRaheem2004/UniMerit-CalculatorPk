# 🎓 PakMerit: Pakistani Universities Merit Calculator & Official Criteria Guide (2026)

> **Live & Deterministic Admissions Aggregate Calculator for Pakistani Students**  
> Built for FSc, ICS, and Cambridge O/A-Level applicants targeting **NUST, FAST-NUCES, COMSATS, GIKI, PUCIT (Punjab University), and UET Lahore**.  
> **100% Free Forever ($0 Budget)** • Zero Backend • Offline PWA • No Ads • Authentic Verified Formulas & Direct Portal Links.  
> **✓ Verified & Updated Till Date for Latest Fall 2025/2026 Admissions Cycle.**

---

## ⚡ Core Features

1. **Simultaneous Multi-University Forward Calculator:**
   - Enter your Matric / O-Level and FSc / A-Level marks once.
   - Instantly calculates your aggregate across **all 6 top universities simultaneously** with complete mathematical transparency.
   - Transparent formula display with component contributions (e.g. Matric %, FSc %, Test %).

2. **Full Support for New Curriculum (1100 vs 1200 Marks):**
   - **New Punjab Boards & FBISE:** Accounts for the compulsory **Tarjuma-tul-Quran (100 marks)** raising total Intermediate marks from 1100 to 1200 (50 marks in Part-1, 50 in Part-2) and Matric to 1200.
   - **Traditional & Other Boards:** Full presets for traditional 1100 marks (Sindh, KPK, Pre-2024 repeaters) and Part-1 marks (520 for FBISE, 550 for Punjab).
   - Proportional mathematical scaling ensures exact fairness regardless of educational board.

3. **NUST Gap Year Policy Clarification (0% Deduction):**
   - Directly addresses the student rumor regarding a 5% gap year deduction.
   - **Official NUST Rule:** 0% deduction. Fresh candidates apply with Part-1, while gap-year applicants use full FSc (Part 1+2) on 100% equal footing with the standard `75% NET + 15% FSc + 10% Matric` formula.
   - Contrasted with Punjab University (PUCIT) which officially deducts 2 marks per late session (gap year).

4. **Direct Official Admission Portal Redirects:**
   - Every university card features a direct link button (**Official Portal ↗**) to the verified admissions website.
   - Zero reliance on unverified rumors or outdated cutoff spreadsheets.

5. **Digital SAT (out of 1600) Support:**
   - Seamless toggle to calculate your aggregate using your Digital SAT score.
   - Automatically scales SAT into university test weightages:
     - **FAST-NUCES Computing:** 50% SAT ($\frac{\text{Score}}{1600} \times 100$) + 40% FSc + 10% Matric (Requires $\ge 1200$).
     - **FAST-NUCES Engineering:** 33% SAT + 50% FSc + 17% Matric (Requires $\ge 1200$).
     - **NUST (National SAT Seats):** 75% SAT + 15% FSc + 10% Matric.
     - **GIKI:** 85% SAT + 15% SSC.
     - **COMSATS:** 50% SAT + 40% FSc + 10% Matric.

6. **NUST Constituent Schools & Disciplines Modal:**
   - Click on the NUST card to explore 20+ disciplines across SEECS, SMME, NICE, SCME, EME, CAE, NBS, S3H, and ASAB.
   - View exact campus locations, schools, and direct links to NUST's undergraduate portal.

7. **Reverse Target Score Planner ("What score do I need?"):**
   - Pick preset target aggregates (65%, 70%, 75%, 80%, 85%) or type a custom target aggregate.
   - Solves for the exact minimum test score required in **NET (out of 200)**, **FAST NU Test (out of 100)**, **ECAT (out of 400)**, or **Digital SAT (out of 1600)**.

8. **IBCC O/A-Level Equivalence Modal:**
   - Grade selector for 8 O-Level subjects ($A^*=90, A=85, B=75, C=65, D=55, E=45$).
   - Computes official IBCC equivalence marks out of 1100 and auto-populates the form with a single click.

9. **SEO Optimized for Public Search Indexing:**
   - Pre-configured Open Graph, Twitter Cards, canonical tags, `robots.txt`, `sitemap.xml`, and Google JSON-LD structured data (`WebApplication` & `FAQPage`).

---

## 🏛️ Supported Universities & Formulas (Updated Till Date)

| University | Test Name | Total Test Marks | Official Aggregate Formula | Official Portal |
|---|---|:---:|---|:---:|
| **NUST** | NET / Digital SAT | 200 / 1600 | **10% Matric + 15% FSc + 75% NET/SAT** | [ugadmissions.nust.edu.pk](https://ugadmissions.nust.edu.pk/) |
| **FAST-NUCES (Computing)** | NU Test / SAT / NAT | 100 / 1600 | **10% Matric + 40% FSc + 50% Test/SAT** | [nu.edu.pk](https://nu.edu.pk/admissions/eligibilitycriteria) |
| **FAST-NUCES (Engineering)** | NU Test / SAT / ECAT | 100 / 1600 | **17% Matric + 50% FSc + 33% Test/SAT** | [nu.edu.pk](https://nu.edu.pk/admissions/eligibilitycriteria) |
| **COMSATS (CUI)** | NTS-NAT / SAT | 100 / 1600 | **10% Matric + 40% FSc + 50% NTS/SAT** | [comsats.edu.pk](https://www.comsats.edu.pk/) |
| **GIKI** | GIKI Test / SAT | 200 / 1600 | **15% SSC (Matric) + 85% Test/SAT** *(HSSC $\ge 60\%$)* | [giki.edu.pk](https://giki.edu.pk/admissions/) |
| **PUCIT / PU** | PU Admission Test | 100 | **75% Academic + 25% Test** *(+20 Hafiz bonus, -2/yr gap)* | [pucit.edu.pk](https://pucit.edu.pk/admissions/) |
| **UET Lahore** | ECAT | 400 | **17% Matric + 50% FSc + 33% ECAT** | [admission.uet.edu.pk](https://admission.uet.edu.pk/) |

---

## 🌐 How to Deploy for Free ($0 Budget)

This project is a static Single Page Application (React 19 + TypeScript + Vite + Tailwind CSS). It requires **zero backend servers or databases**, making it 100% free to deploy forever:

### Option 1: Vercel (Recommended — 2 Minutes, Zero Configuration)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your repository: `AbdulRaheem2004/UniMerit-CalculatorPk`.
4. Framework Preset will automatically detect **Vite**.
5. Build settings (default):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **"Deploy"**.
7. In ~30 seconds, your site will be live with an automatic SSL certificate (e.g. `https://unimerit-calculator-pk.vercel.app`).

### Option 2: Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and log in.
2. Click **"Create an application"** → **"Pages"** → **"Connect to Git"**.
3. Select `AbdulRaheem2004/UniMerit-CalculatorPk`.
4. Framework preset: **Vite**, Output: `dist`.
5. Click **"Save and Deploy"**.

### Option 3: GitHub Pages
1. In your repository on GitHub, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Choose the **Static HTML** or Vite workflow to build and deploy automatically on every push to `main`.

---

## 🧪 Automated Test Suite

Run `npm test` to execute all unit tests:
```bash
npm test
```
- `tests/calculator.test.ts`: Validates aggregate percentage formulas, 1200 marks curriculum scheme, Part-1 scaling, SAT conversions, and eligibility boundaries.
- `tests/university_config.test.ts`: Verifies official criteria URLs, 100% weightage totals, gap year notes, and campus lists.
- `tests/reverse.test.ts`: Validates target score solver (achievable, unachievable, and already qualified states).
- `tests/ibcc.test.ts`: Validates Cambridge O-Level grade conversions to 1100 marks.
