# 🎓 PakMerit: Pakistani Universities Merit Calculator & Official Criteria Guide (2026)

> **Live & Deterministic Admissions Aggregate Calculator for Pakistani Students**  
> Built for FSc, ICS, and Cambridge O/A-Level applicants targeting **NUST, FAST-NUCES, COMSATS, GIKI, PUCIT (Punjab University), and UET Lahore**.  
> **100% Free Forever ($0 Budget)** • Zero Backend • Offline PWA • No Ads • Authentic Verified Formulas & Direct Portal Links.

---

## ⚡ Core Features

1. **Simultaneous Multi-University Forward Calculator:**
   - Enter your Matric / O-Level and FSc / A-Level marks once.
   - Instantly calculates your aggregate across **all 6 top universities simultaneously** with complete mathematical transparency.
   - Transparent formula display with component contributions (e.g. Matric %, FSc %, Test %).

2. **Direct Official Admission Portal Redirects:**
   - Every university card features a direct link button (**Official Portal ↗**) to the verified admissions website.
   - No reliance on unverified rumors or stale cutoff estimates.

3. **Digital SAT (out of 1600) Support:**
   - Seamless toggle to calculate your aggregate using your Digital SAT score.
   - Automatically scales SAT into university test weightages:
     - **FAST-NUCES Computing:** 50% SAT ($\frac{\text{Score}}{1600} \times 100$) + 40% FSc + 10% Matric (Requires $\ge 1200$).
     - **FAST-NUCES Engineering:** 33% SAT + 50% FSc + 17% Matric (Requires $\ge 1200$).
     - **NUST (National SAT Seats):** 75% SAT + 15% FSc + 10% Matric.
     - **GIKI:** 85% SAT + 15% SSC.
     - **COMSATS:** 50% SAT + 40% FSc + 10% Matric.

4. **NUST Constituent Schools & Disciplines Modal:**
   - Click on the NUST card to explore 20+ disciplines across SEECS, SMME, NICE, SCME, EME, CAE, NBS, S3H, and ASAB.
   - View exact campus locations, schools, and direct links to NUST's undergraduate portal.

5. **Reverse Target Score Planner ("What score do I need?"):**
   - Pick preset target aggregates (65%, 70%, 75%, 80%, 85%) or type a custom target aggregate.
   - Solves for the exact minimum test score required in **NET (out of 200)**, **FAST NU Test (out of 100)**, **ECAT (out of 400)**, or **Digital SAT (out of 1600)**.

6. **IBCC O/A-Level Equivalence Modal:**
   - Grade selector for 8 O-Level subjects ($A^*=90, A=85, B=75, C=65, D=55, E=45$).
   - Computes official IBCC equivalence marks out of 1100 and auto-populates the form with a single click.

7. **WhatsApp Branded Share Card:**
   - Pure HTML5 Canvas snapshot generator rendering a high-contrast 1200x675 social summary card for WhatsApp, parents, and friends.

8. **Offline-Ready Progressive Web App (PWA):**
   - Installable on mobile home screens and desktops with Service Worker caching. Works 100% offline with zero server calls.

---

## 🏛️ Supported Universities & Formulas

| University | Test Name | Total Test Marks | Official Aggregate Formula | Official Portal |
|---|---|:---:|---|:---:|
| **NUST** | NET / Digital SAT | 200 / 1600 | **10% Matric + 15% FSc + 75% NET/SAT** | [ugadmissions.nust.edu.pk](https://ugadmissions.nust.edu.pk/) |
| **FAST-NUCES (Computing)** | NU Test / SAT / NAT | 100 / 1600 | **10% Matric + 40% FSc + 50% Test/SAT** | [nu.edu.pk](https://nu.edu.pk/admissions/eligibilitycriteria) |
| **FAST-NUCES (Engineering)** | NU Test / SAT / ECAT | 100 / 1600 | **17% Matric + 50% FSc + 33% Test/SAT** | [nu.edu.pk](https://nu.edu.pk/admissions/eligibilitycriteria) |
| **COMSATS (CUI)** | NTS-NAT / SAT | 100 / 1600 | **10% Matric + 40% FSc + 50% NTS/SAT** | [comsats.edu.pk](https://www.comsats.edu.pk/) |
| **GIKI** | GIKI Test / SAT | 200 / 1600 | **15% SSC (Matric) + 85% Test/SAT** *(HSSC $\ge 60\%$)* | [giki.edu.pk](https://giki.edu.pk/admissions/) |
| **PUCIT / PU** | PU Admission Test | 100 | **75% Academic + 25% Test** *(+20 Hafiz bonus)* | [pucit.edu.pk](https://pucit.edu.pk/admissions/) |
| **UET Lahore** | ECAT | 400 | **17% Matric + 50% FSc + 33% ECAT** | [admission.uet.edu.pk](https://admission.uet.edu.pk/) |

---

## 🌐 How to Deploy for Free ($0 Budget)

This project is a static Single Page Application (React 19 + TypeScript + Vite + Tailwind CSS). It requires **zero backend servers or databases**, making it 100% free to deploy forever on leading edge platforms:

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

### Option 2: Cloudflare Pages (Free, Unlimited Bandwidth)
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and log in.
2. Click **"Create an application"** → **"Pages"** → **"Connect to Git"**.
3. Select `AbdulRaheem2004/UniMerit-CalculatorPk`.
4. Build configuration:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click **"Save and Deploy"**.

### Option 3: GitHub Pages
1. In your repository on GitHub, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Choose the **Static HTML** or Vite workflow to build and deploy automatically on every push to `main`.

---

## 💻 Tech Stack & Zero-Cost Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS.
- **Icons:** Lucide React.
- **Testing:** Vitest (26 automated unit tests covering all formulas, edge cases, and configuration integrity).
- **Graphics:** HTML5 Canvas API (custom 1200x675 card compositor).
- **Cost:** **$0.00 / forever**. Completely static, client-side deterministic computation.

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/AbdulRaheem2004/UniMerit-CalculatorPk.git
cd UniMerit-CalculatorPk

# Install dependencies
npm install

# Run local development server
npm run dev

# Run automated unit test suite
npm test

# Build production bundle
npm run build
```
