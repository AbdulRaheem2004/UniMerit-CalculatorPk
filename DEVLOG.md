# ⚡ Universities Merit Calculator — Status & Dev Log

> **Status:** `COMPLETED (v1.0 Release)` | **Version Target:** `v1.0 Production` | **Progress:** `100%`  
> **Last Synced:** `2026-10-09T02:55:00.000Z`

## 💡 Overview
Deterministic admission aggregate calculator and official criteria guide for premier Pakistani universities across Medical (MBBS/BDS), Computing, Engineering, and Business disciplines. Features interactive Stream Pre-Selection, PMDC MDCAT regulatory pass-threshold indicators, multi-campus consolidation, Digital SAT 1600 scale integration, Reverse Target Solver, and official university portal redirect links.

## 🎯 Completed Deliverables (Scope: 10/10 — 100%)
- [x] **Stream Pre-Selection Menu (Medical, Computing, Engineering, Business, All)** (Weight: 2.5)
- [x] **National MDCAT & PMDC Medical Colleges Engine (UHS, NUMS, Dow, KMU, AKU, Shifa)** (Weight: 3.0)
- [x] **Formula calculation engine for NUST, FAST, COMSATS, GIKI, PUCIT, UET** (Weight: 2.0)
- [x] **Expanded Roster of Premier Pakistani Universities (LUMS, IBA, NED, PIEAS, SSUET, FCCU, BNU)** (Weight: 2.5)
- [x] **Reverse Target Score Planner ("What score do I need in entry test?")** (Weight: 2.5)
- [x] **Curriculum 1200 vs 1100 Marks Normalizer (Tarjuma-tul-Quran & Part-1 Schemes)** (Weight: 1.5)
- [x] **Cambridge O/A-Level IBCC equivalence conversion calculator modal** (Weight: 1.5)
- [x] **Digital SAT (1600 scale) institutional eligibility evaluation** (Weight: 1.5)
- [x] **NUST Constituent Schools & All-Fields Interactive Modal** (Weight: 1.5)
- [x] **Deterministic Zero-Backend Architecture, SEO Optimization & Free Cloud Hosting Guide** (Weight: 2.0)

## 📝 Recent Dev Logs
### Major Release: Medical Stream, Pre-Selector & Top Universities Roster (2026-10-09)
- Built interactive Stream Pre-Selector allowing students to select their field before entering marks.
- Added comprehensive Medical Stream: PMDC 50% MDCAT + 40% FSc + 10% Matric standard with live MBBS (55%) and BDS (50%) passing cutoff indicators and Hafiz-e-Quran bonus (+20 FSc).
- Added premier medical institutions: UHS Punjab (KEMU/AIMC/Nishtar), NUMS (Army Medical College AMC & CMH), Dow / DUHS Sindh, KMU KPK, Aga Khan University (AKU), and Shifa Tameer-e-Millat (STMU).
- Added missing reputable universities: LUMS (SBASSE & SDSB), IBA Karachi (BBA & CS), NED Karachi, PIEAS Islamabad, Sir Syed University (SSUET), FCCU Lahore, and BNU Lahore.
- Supported multi-discipline universities seamlessly across all groups they offer without campus duplication.
- Verified system with 38 automated Vitest unit tests and visual Playwright browser testing.

### Edge Case Hardening, IBCC Failed Grade Ineligibility & Top Workflow (2026-10-09)
- **Defensive Boundary Validation:** Enforced strict non-negative academic marks validation (`marks < 0`), non-positive total guards (`total <= 0`), obtained exceeding total guards (`obtained > total`), and reverse solver impossible bounds (`target <= 0` or `target > 100`).
- **IBCC Grade 'U' Rejection (Clause 3.2):** Implemented official IBCC regulation where a Grade 'U' (Ungraded/Fail) in any Cambridge subject refuses equivalence certificate issuance, resulting in 100% university admission ineligibility across all institutions in Pakistan.
- **Dual-Tab IBCC Converter:** Integrated comprehensive O-Level (8 subjects) and A-Level (3 principal subjects) equivalence converter modal with instant ineligibility banners.
- **Top Workflow Mode Switcher:** Replaced multi-page wizard with an instant top toggle: `[ 📊 Forward Merit Calculator ]` vs `[ 🎯 Reverse Target Planner ]`, eliminating long scrolling.
- **1200 SNC vs 1100 Marks Scheme:** Documented Punjab Quran Act 2021 / FBISE notification while maintaining backward compatibility for Sindh Boards and older repeaters.
- **Test Suite Expansion:** Expanded Vitest suite to 50/50 passing unit tests. Built and deployed live to GitHub Pages.

