# Goodwork Digital

A complete Next.js App Router website with TypeScript, Tailwind CSS, and GSAP. The design follows the supplied near-black / violet reference with an edge-to-edge layout and a bright, layered violet horizon. The screenshot's surrounding frame is not reproduced as part of the website. All five portfolio links are kept in `lib/content.ts`. No invented client results, testimonials, or social profiles are included.

## Run

Node.js 20.9+ is required.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. For production, run `npm run build` then `npm start`, or deploy the repository to Vercel with its Next.js preset.

`vercel.json` explicitly selects the Next.js framework, runs the production build, and restores the framework's default output directory. In Vercel, keep **Root Directory** at the repository root (blank / `.`), and deploy the `main` branch. Do not set Root Directory or Output Directory to `public`: it contains images, not the application's homepage or API routes. If the deployment serves images but returns Vercel `NOT_FOUND` for `/`, confirm these settings and redeploy the latest commit.

## Contact delivery

Copy `.env.example` to `.env.local` and configure:

- `RESEND_API_KEY`: a server-only Resend API key.
- `CONTACT_FROM_EMAIL`: a sender address on your verified Resend domain.
- `CONTACT_TO_EMAIL`: the inbox that receives enquiries.
- `NEXT_PUBLIC_SITE_URL`: the exact production origin (e.g. your real https URL, without a path). This enables canonical metadata and enforces same-origin contact requests. Leave unset locally.

The form submits to `app/api/contact/route.ts`. Both browser and server validate fields. The server adds origin checking, a honeypot, a 20KB body limit, bounded per-instance throttling, and a provider timeout. Credentials never enter the browser bundle. A successful state appears only after Resend returns an accepted email ID; this confirms provider acceptance, not inbox delivery. Without email configuration, the route returns HTTP 503 and the form retains its contents. Failed delivery and timeouts also retain user input.

For a busy production deployment, replace the per-instance rate-limit map with a shared Redis/KV limiter, and add a managed anti-abuse service if needed. On Vercel, rate-limit identity assumes the platform supplies trusted forwarding headers. Add your domain to Resend and test real delivery before promoting the contact form. Tests use a stubbed provider and never send an email.

## Content and assets

- `lib/content.ts`: project URLs, descriptions, services, principles, and workflow concepts.
- `public/projects/`: authentic portfolio captures when available. If a preview cannot load, a designed project-name fallback is displayed.
- `scripts/project-inspection.json`: inspection outcomes, without inferred capabilities.
- Automation entries are explicitly labelled workflow concepts with implementation and deployment unconfirmed. Replace the status and descriptions only when confirmed; add demo links only when real URLs exist.
- No placeholder social links are rendered.
- The provided Galaxy Knitwear URL currently presents a Silver Textile manufacturing website, not an e-commerce storefront. The supplied portfolio name is retained, with the current branding disclosed in its description. Nova and Vantor are described as concept sites; Ember & Grain and Fade & Co. are described as application interfaces, without claiming confirmed backend functionality.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Motion is organized in `components/use-site-motion.ts`, using `useGSAP` lifecycle cleanup and responsive `gsap.matchMedia`. The navigation, whole headline, copy, buttons, and light have a coordinated entrance; selected sections and project previews have restrained ScrollTrigger effects. Native scrolling is preserved, with no Lenis or scroll-hijacking dependency.

Three static radial-gradient fields drift through transform-only GSAP tweens at different speeds. They pause when the hero is offscreen, the tab is hidden, or the visitor uses the pause/resume control beside “Discover the work.” Mobile and devices reporting four or fewer logical processors animate only one field; desktop preview parallax and process-line scrubbing are limited to capable devices with a fine pointer. Blur, gradient stops, and grain are not animated each frame. Reduced-motion preferences remove ambient movement and the entrance/scroll effects. Server-rendered content remains visible without JavaScript.

The portfolio uses the actual local screenshots inside decorative browser frames with the real hostnames; Website and Web App labels identify the project types. It does not embed or run the external apps inside the page. CSS hover depth is limited to devices with a fine pointer, and image fallbacks remain readable.

`verification/experience-results.json` records the latest browser checks; `scripts/verify-experience.cjs` is a local verification helper using this machine's bundled Playwright runtime. It covers ambient pause/resume, simulated tab visibility, offscreen pausing, repeated reduced-motion changes, touch navigation, portfolio previews, the unconfigured contact response, and no-JavaScript rendering. Review captures are kept locally in `verification/` and excluded from Git.
