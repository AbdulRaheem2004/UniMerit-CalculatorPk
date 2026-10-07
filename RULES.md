# Project Rules: Pakistani Universities Merit Calculator

## 1. Quality Standards
- **UI/UX (Impeccable Skill):** Apply "GPT-taste." No AI slop. Avoid purple gradients, generic hero sections, oversized padding, and uninspired layouts. The design must be crisp, functional, and highly polished, resembling top-tier, modern utility apps.
- **Copywriting (GASP Method):** Writing must be Genuine, Authentic, Specific, and Purposeful. No AI-generated filler content or generic platitudes. Every label, tooltip, and message must be specific and useful to the user.

## 2. Public App Considerations (Web/PWA)
- **SEO & Social Sharing:** Implement robust SEO meta tags and Open Graph tags for WhatsApp and other social media sharing. A proper favicon and clean URLs are mandatory.
- **Performance:** Fast load times, aiming for < 1.5s First Contentful Paint (FCP) on slow 3G/4G connections.
- **PWA & Offline:** Must be a Progressive Web App (PWA), installable, and offline-capable using service workers.
- **Mobile-First:** Ensure flawless responsiveness, starting from mobile devices (320px) up to large desktops.

## 3. Audience Context: Pakistani Students
- **Language:** Keep English simple and accessible. Use Roman Urdu for complex tooltips or clarifications where it aids comprehension (e.g., explaining IBCC equivalence).
- **Accessibility:** Minimum WCAG 2.1 AA compliance. Ensure contrast ratios are sufficient and keyboard navigation works flawlessly.
- **Performance Context:** Must work seamlessly on low-end Android phones common in the region.
- **Sharing:** Provide a WhatsApp-native sharing feature, as it's the primary communication method for students.

## 4. Data Integrity & Verification
- **Formulas:** Aggregate formulas must exactly match the official university prospectuses for the current year. Include source citations for every formula within the data file or UI.
- **Historical Data:** Any historical closing merit data must clearly cite the year and source.
- **IBCC Equivalence:** Use the official IBCC O/A-Level equivalence formulas and explicitly state the conversion rules.

## 5. Development & Project Constraints
- **Budget:** Strict $0 budget. The app must be 100% client-side, hosted on free tiers (GitHub Pages or Cloudflare Pages). Zero API costs. Zero backend. All data must reside in static JSON files.
- **Ponytail Minimalism:** Zero bloat architecture. Pure deterministic mathematical functions for all formulas. Native HTML5 canvas for WhatsApp share image generation. Total bundle under 80KB gzipped. No external state management libraries (React state is sufficient).
- **Code Management:** Use `graphify` for context tracking, dependency mapping, and file navigation as the codebase evolves.

## 6. Prohibited Practices
- No user accounts or authentication.
- No backend servers.
- No unnecessary generic filler text.
