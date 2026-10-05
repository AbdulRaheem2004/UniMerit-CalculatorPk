# Execution Plan: Pakistani Universities Merit Calculator

This plan outlines the phased development of the 100% client-side, zero-backend SPA for the Pakistani Universities Merit Calculator.

## Phase 0: Data Collection (1 Day)
**Goal:** Compile all necessary data, formulas, and historical metrics.
- **Tasks:**
  - Create `universities.json` containing verified formulas for NUST, FAST, COMSATS, GIKI, PUCIT, LUMS, FCCU, GCU, BNU, UET.
  - Compile 2024/2025 closing merits for these institutions.
  - Document the IBCC O/A-Level equivalence table.
- **Deliverables:** `data/universities.json`, `data/closing_merits.json`, `data/ibcc_equivalence.json`.
- **Exit Criteria:** All formulas are cited to official prospectuses. Historical data is cross-verified.
- **Verification:** Manual review of JSON against official PDFs.
- **Commands:** Run `graphify init` and `graphify update` to establish the initial project structure.

## Phase 1: Core Engine (1 Day)
**Goal:** Build the deterministic formula engine and reverse calculator logic in pure TypeScript/JS.
- **Tasks:**
  - Implement functions to calculate aggregates for all supported universities based on `universities.json`.
  - Implement the IBCC conversion logic.
  - Implement the "Reverse Target Score Planner" (calculating required entry test marks given target aggregate, Matric, and FSc marks).
- **Deliverables:** `src/engine/calculator.ts`, `src/engine/reverse.ts`, `src/engine/ibcc.ts`.
- **Exit Criteria:** All core logic functions exist and pass all Phase 1 unit tests.
- **Verification:** Run unit tests for all university formulas and edge cases (e.g., required score > 100%).
- **Commands:** `npm run test:engine`.

## Phase 2: UI Shell (1 Day)
**Goal:** Construct the single-page responsive form and results dashboard.
- **Tasks:**
  - Build input form (Matric/O-Level, FSc/A-Level, Entry Test marks).
  - Build university selector (checkboxes).
  - Build the results dashboard with dynamic color-coding (Safe/Risky/Danger zones).
  - Integrate the Core Engine (Phase 1) with the UI components.
  - Apply impeccable styling (Tailwind CSS) focusing on utility and clarity.
- **Deliverables:** `src/components/Form.tsx`, `src/components/Results.tsx`, `src/App.tsx`.
- **Exit Criteria:** Form accepts inputs, calculates aggregates in real-time, and displays color-coded results accurately across all selected universities.
- **Verification:** Manual UI testing for layout responsiveness and state management.
- **Commands:** `impeccable lint --ui` and `graphify sync`.

## Phase 3: Polish & Public Launch (1 Day)
**Goal:** Finalize features for public release and deploy the application.
- **Tasks:**
  - Implement the "WhatsApp Share Card" feature using `html2canvas` or `dom-to-image`.
  - Add SEO meta tags, Open Graph data, and a clear favicon.
  - Generate a PWA manifest and service worker for offline capability.
  - Write a comprehensive `README.md` with screenshots.
  - Deploy to GitHub Pages or Cloudflare Pages.
- **Deliverables:** `public/manifest.json`, `service-worker.js`, `index.html` (with SEO), configured CI/CD pipeline.
- **Exit Criteria:** App is live, shareable via WhatsApp with a clean card, installable as a PWA, and passes Lighthouse performance audits.
- **Verification:** Share testing on WhatsApp, Lighthouse audit, offline mode test.
- **Commands:** `npm run build`, `npm run deploy`, `impeccable audit --web`.

## Phase 4: Post-Launch
**Goal:** Maintain and scale the application based on community usage.
- **Tasks:**
  - Monitor community feedback via GitHub Issues.
  - Add support for additional universities (e.g., NED, DUHS) based on requests.
  - Update formulas and closing merits for the next admission cycle.
- **Commands:** `graphify report --usage`.
