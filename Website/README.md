# Brown Campbell Tutoring — chemistry tutoring

A responsive React 19 and TypeScript site for Gavin Brown and Felix Campbell. This project uses the Vinext React framework and Vite. The Radix/Shadcn components remain vendored in `components/ui`, but the pages are now plain HTML styled in `app/globals.css` and no longer use them.

## Run locally

Requires Node 22.13 or newer. Run `npm install`, then `npm run dev`. Use the local address printed by the development server. `npm run build` prerenders both pages to static HTML in `dist/client` (`output: "export"` in `next.config.ts`), which is what Cloudflare Pages publishes. `npm run lint` and `npx tsc --noEmit` check the source.

## Site plan and implemented visitor journey

1. Say who the tutors are and what they teach, with an at-a-glance summary beside the introduction.
2. List the three courses and the topics students can bring.
3. Introduce both tutors with a photo and the academic information supplied by the owner.
4. Answer practical questions without inventing rates, credentials, testimonials, or availability.
5. Offer the request form at the foot of the home page. Course links preselect it, as do links such as `/?course=organic&tutor=felix#request`.
6. Validate required details, prepare a reviewable email, and let the visitor open an email app or copy the draft for webmail.
7. Keep the worked chemistry problems on a separate page, `/examples`, so the home page stays about the people and the service.

## Deploying to Cloudflare Pages

Pages settings: root directory `Website`, build command `npm run build`, build output directory `dist/client`. The pages are static, so `?course=` and `?tutor=` preselection is read in the browser. Links are plain `<a>` elements because vinext’s `<Link>` client navigation throws in the pinned beta.

## Search engines

- The production address lives in `siteUrl` in `lib/tutoring.ts`, and again in `public/robots.txt` and `public/sitemap.xml`. Update all three if the site moves to a custom domain.
- Each page sets its title, description, canonical URL and Open Graph tags through `metadata`. The share image is `public/og.png` (1200×630).
- The home page carries schema.org `EducationalOrganization` data for the tutors.
- `public/_headers` sends `X-Robots-Tag: noindex` on preview and branch deployments (`<id>.tutoring-9f8.pages.dev`), so only the production address is indexed.

## Editing business details

- `lib/tutoring.ts`: placeholder company name, tutor contact details, course descriptions, FAQ, and email draft generation.
- `app/layout.tsx`: browser title, search description, favicon.
- `app/page.tsx` and `components/home-page.tsx`: home page structure and the request form.
- `app/examples/page.tsx` and `components/reaction-schemes.tsx`: the worked examples and their hand-placed structure drawings. Check the chemistry whenever a problem is changed.
- `components/site-header.tsx` and `components/site-footer.tsx`: navigation and contact details shared by both pages.
- `app/globals.css`: palette, typography, responsive layout, and components.
- `public/favicon.svg`: original simple brand icon.

The two contact addresses supplied by the owner are `glb001@uark.edu` and `fcampbell@uark.edu`. Selecting either tutor sends the draft to that person; selecting “Either tutor” addresses both. The site never sends messages automatically and never reports that a request has been submitted or a session booked. All form details stay in browser memory until a visitor deliberately opens their email app or copies the text. Refreshing clears the fields. The website does not store inquiries or need a database. Rates, payment processing, exact availability, and booking-calendar integration remain business decisions, with no invented prices or calendar slots.

## Design

A printed problem set: white paper, black ink, one ballpoint blue (`--pen`) for the tutor’s working, and highlighter yellow (`--highlight`) for the key idea and the request form. Libre Franklin carries the site’s own voice; STIX Two Text is used only inside the problems and the “pen” annotations. Section titles sit in a margin column with ruled lines between sections rather than cards. Real tutor names and no fabricated tutor photographs. Light theme intentionally fixed; reduced-motion preferences supported. The site includes mobile navigation, native radio buttons and labeled fields, clear draft status, fallback copy, and a skip link.

## Retired hero asset

Asset: `public/images/molecular-hero.webp`. No page references it since the redesign; it is kept only for provenance and can be deleted. Created once with the built-in ImageGen tool, then converted to WebP for web delivery. The artwork is conceptual and is not intended as an exact chemical structure.

Exact generation prompt:

> Use case: stylized-concept. Asset type: original raster hero image for a premium chemistry tutoring website. Primary request: A premium editorial still life of a physical ball-and-stick molecular model, playful yet sophisticated, suitable for a college and high-school tutoring brand. Scene/backdrop: Seamless vivid periwinkle-lilac studio background and matching floor, with no visible horizon. Subject: A single sculptural organic-chemistry-inspired ball-and-stick arrangement, constructed from white and deep cobalt spheres with a few bright tangerine spheres, connected by slender rods. Conceptual brand art, not an exact chemical structure. The model has an elegant asymmetrical, dimensional arrangement with clearly readable spheres and rods. Style/medium: Striking premium product photography / photorealistic 3D studio render. Composition/framing: Portrait 4:5 composition, model centered with generous breathing room on all sides, the entire sculpture visible, suitable for filling a website hero right panel. Lighting/mood: Soft directional studio light, beautiful realistic contact shadows, confident editorial art direction. Color palette: Vivid periwinkle-lilac background, bright white, deep cobalt blue, small bold tangerine accents. Materials/textures: Tactile matte spheres and slender matte rods, refined realistic surfaces. Constraints: Exactly one image. No diagrams, letters, text, people, logos, hands, interface, or watermark.

## Optional browser agent support

When supported, `start_tutoring_request` scrolls to the same visible request form after validating its course and tutor options. It only stages the request and cannot send email. Browsers without WebMCP use the complete ordinary interface.

## Verification

After the redesign: TypeScript, lint, and a production build pass. Browser checks at 1440 px and 390 px cover both pages, course and tutor preselection (buttons and `?course=` links), email draft content and recipient routing, mobile navigation, and page width. The webmail copy button and the browser agent tool were not re-exercised after the redesign. No test inquiry was sent.
