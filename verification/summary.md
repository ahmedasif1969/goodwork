# Verification — 14 October 2026

## Atmospheric experience refinement

The existing framework, content, project order, section structure, branding, and contact integration were retained. Added layered radial-gradient lighting, subtle static grain, a coordinated GSAP entrance, a pause/resume control, scroll-linked horizon movement, browser-framed portfolio previews, clearer project-type labels, and restrained surface lighting across services, workflows, process, contact, and footer. No packages were added.

`experience-results.json` records the current browser run:

- Ambient fields move, pause/resume manually, pause offscreen, and pause on a simulated `visibilitychange` event. The tab-visibility test sets the browser's `document.hidden` value; it is not a real device power measurement.
- The existing links all loaded successfully during fresh inspection; five local screenshots loaded and their hover depth worked.
- Website and Web App labels map to the actual three website and two application entries; AI Automation links to the separate concept section.
- Scrolling down and back up keeps content visible and restores ambient motion.
- No horizontal overflow at 320, 390, 768, 1024, and 1440px.
- Three repeated reduced-motion preference cycles restore static content and remove ambient movement.
- A separate touch-mobile context verified navigation, Escape handling, service details, form errors, focus, and input preservation.
- Broken-image fallback and server-rendered content without JavaScript remain usable.
- No runtime page errors were observed. The layout-shift observer reported 0 during this desktop test session; this is not a field-performance or load-time benchmark.

All desktop and mobile sections received visual inspection. Captures use the `experience-` prefix. Lint, TypeScript, the three contact tests, and the final production build all passed.

## Design refinement

The screenshot's surrounding frame was removed from the website and social preview. The layout now reaches both viewport edges with no outer border or rounded page corners. The hero's hard ellipse was replaced by a bright, tapered violet arc with separate haze, bloom, and luminous core layers. Typography is more readable, section gaps are tighter, and narrow mobile CTAs stack rather than shrink.

`scripts/verify-design.cjs` verified the revised layout at 320, 390, 768, 1024, and 1440px: no horizontal overflow, no outer border, full viewport width, visible section headings after navigation, reduced-motion support, and no runtime errors. Local review screenshots use the `refined-` prefix.

The completed Goodwork Digital website was checked in a headless Microsoft Edge browser and built with Next.js 16.4.0.

- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm test`: 3 contact-handling tests passed. Tests verify invalid-input rejection, no false success without configuration, and provider acceptance / rejection / network failure.
- `npm run build`: passed, including static page generation, favicon, Open Graph image, and contact API route.
- Browser widths: 320, 390, 768, 1024, and 1440px. No horizontal overflow or hero-title overflow.
- Mobile navigation: open, Escape to close, and close after selecting a section.
- Native service details: expand and collapse.
- All five portfolio URLs returned HTTP 200 during inspection. The five local preview assets loaded successfully; a deliberately broken image displayed the fallback.
- Contact: accessible validation and focus on the first invalid field; real HTTP 503 when delivery is unconfigured; retained input on failure; UI success tested with a stubbed response only.
- Contact API: rejects a foreign origin (403) and invalid input (400).
- Motion: scroll down and back up; reduced-motion preference; readable server-rendered content with JavaScript disabled.
- No browser page errors were observed.
- All page sections received visual review; mobile workflow diagrams were refined into vertical sequences for readable labels.

`results.json` holds the browser assertions. PNG files in this directory are local review captures and are ignored by Git.

## Deployment requirements

Email delivery has not been activated or sent to a real inbox. Configure `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL`; configure the real `NEXT_PUBLIC_SITE_URL` for production origin checking and canonical metadata. See the README for setup and distributed rate-limit considerations.

The supplied Galaxy Knitwear URL currently displays Silver Textile. Portfolio text discloses that branding and describes the live manufacturing website accurately.

The production dependency audit reported zero vulnerabilities. The complete audit reported five development-only advisories in the ESLint / Next lint plugin chain, originating in `braces` / `micromatch`. The audit's suggested fix would downgrade the Next lint configuration across major versions; no forced downgrade was applied. Recheck upstream fixes when updating developer tooling.
