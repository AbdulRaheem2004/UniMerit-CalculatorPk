# Test Cases: Pakistani Universities Merit Calculator

## A. Formula Engine Unit Tests
| Test ID | Description | Input | Expected Output | Priority | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ENG-01 | NUST Aggregate Calc | Matric=980/1100, FSc=920/1100, NET=155/200 | ~76.22% (Verify exact math with NUST formula: 10% Matric + 15% FSc + 75% NET) | P0 | Engine |
| ENG-02 | FAST Aggregate Calc | FSc=880/1100, NU Test=72/100 | ~76.00% (Verify with FAST formula: 50% FSc + 50% NU Test) | P0 | Engine |
| ENG-03 | COMSATS Aggregate Calc | Matric=950/1100, FSc=900/1100, NAT=75/100 | Verify with exact COMSATS formula | P0 | Engine |
| ENG-04 | GIKI Aggregate Calc | SSC=1050/1100, HSSC=920/1100, GIKI Test=180/200 | Verify with exact GIKI formula | P0 | Engine |
| ENG-05 | PUCIT Aggregate Calc | Matric=900/1100, FSc=850/1100, Entry Test=65/100 | Verify with exact PUCIT formula | P0 | Engine |
| ENG-06 | UET (ECAT) Aggregate Calc | Verify inputs against formula | Verify with exact UET formula | P0 | Engine |
| ENG-07 | Edge: Perfect Scores | All inputs = Max possible | 100% | P1 | Engine |
| ENG-08 | Edge: Minimum Scores | All inputs = 0 | 0% | P1 | Engine |
| ENG-09 | IBCC O/A-Level Equivalence | A*=90, A=85, B=75 | Correct equivalent marks out of 1100 | P0 | Engine |

## B. Reverse Calculator Tests
| Test ID | Description | Input | Expected Output | Priority | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| REV-01 | Calculate required NET score | FSc=900, Matric=1000, Target NUST=80% | Required NET score calculated correctly | P0 | Reverse |
| REV-02 | Unachievable Target | Required score > Max test score | "Not achievable" warning | P1 | Reverse |
| REV-03 | Already Qualified | Current marks > Target without test | "You're already safe" message | P2 | Reverse |

## C. UI / UX Tests
| Test ID | Description | Input | Expected Output | Priority | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| UI-01 | Form validation: Non-numeric | "abc" in Marks field | Input rejected or validation error | P0 | UI |
| UI-02 | Form validation: Exceeds total | Marks = 1200, Total = 1100 | Validation error "Marks cannot exceed total" | P0 | UI |
| UI-03 | Responsive: Mobile (320px) | Viewport = 320px | No horizontal scrolling, stacked layout | P1 | UI |
| UI-04 | Keyboard Navigation | Tab key | Can navigate through all inputs and buttons | P1 | Accessibility |
| UI-05 | Screen Reader | NVDA/VoiceOver | Inputs labeled, results announced | P1 | Accessibility |
| UI-06 | WhatsApp Share | Click "Share" | Renders valid image card and opens WA intent | P0 | UI |
| UI-07 | PWA Offline | Disconnect network, reload | App loads and functions from cache | P1 | PWA |
| UI-08 | Performance: FCP | 3G Throttle in DevTools | First Contentful Paint < 1.5s | P2 | Performance |

## D. Data Integrity Tests
| Test ID | Description | Input | Expected Output | Priority | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DAT-01 | Formula Citations | Inspect `universities.json` | Every formula has a `source` URL/citation | P0 | Data |
| DAT-02 | Historical Merits | Inspect closing merits JSON | Matches official published lists exactly | P0 | Data |
| DAT-03 | IBCC Equivalence | Inspect IBCC rules | Matches official IBCC circular | P0 | Data |

## E. Cross-Browser Tests
| Test ID | Description | Input | Expected Output | Priority | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| XBR-01 | Chrome Android | Open site | Full functionality | P0 | Browser |
| XBR-02 | Safari iOS | Open site | Full functionality, share sheet works | P0 | Browser |
| XBR-03 | Desktop Browsers | Chrome, Firefox | Full functionality, hover states work | P1 | Browser |
