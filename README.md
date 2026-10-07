# Good Chemistry — chemistry tutoring

A responsive React 19 and TypeScript site for Gavin Brown and Felix Campbell. “Good Chemistry” is an explicitly temporary company name. This project uses the Vinext React framework and Vite, with accessible Radix/Shadcn form, dialog, and accordion components.

## Run locally

Requires Node 22.13 or newer. Run `npm install`, then `npm run dev`. Use the local address printed by the development server. `npm run build` creates the deployable Cloudflare Workers site. `npm run lint` and `npx tsc --noEmit` check the source.

## Site plan and implemented visitor journey

1. Introduce personal tutoring for high school, AP, and college chemistry.
2. Explain the three subject areas and the topics students can bring.
3. Show the approach: questions, conceptual connections, then guided practice.
4. Introduce both tutors using the academic information supplied by the owner.
5. Answer practical questions without inventing rates, credentials, testimonials, or availability.
6. Open an accessible session planner, optionally preselecting course and tutor.
7. Validate required details, prepare a reviewable email, and let the visitor open an email app or copy the draft for webmail.

## Editing business details

- `lib/tutoring.ts`: placeholder company name, tutor contact details, bios, course descriptions, FAQ, and email draft generation.
- `app/layout.tsx`: browser title, search description, favicon.
- `app/page.tsx`: page structure and session planner.
- `app/globals.css`: palette, typography, responsive layout, and components.
- `public/favicon.svg`: original simple brand icon.

The two contact addresses supplied by the owner are `glb001@uark.edu` and `fcampbell@uark.edu`. Selecting either tutor sends the draft to that person; selecting “Either tutor” addresses both. The site never sends messages automatically and never reports that a request has been submitted or a session booked. All form details stay in browser memory until a visitor deliberately opens their email app or copies the text. Refreshing clears the fields. The website does not store inquiries or need a database. Rates, payment processing, exact availability, and booking-calendar integration remain business decisions, with no invented prices or calendar slots.

## Design

Violet, deep ink, and tangerine with an editorial serif and readable sans serif. Custom molecular artwork, real tutor names, and typographic initials instead of fabricated tutor photographs. Light theme intentionally fixed; reduced-motion preferences supported. The site includes mobile navigation, a keyboard-accessible modal and selects, labeled fields, clear draft status, fallback copy, and a skip link.

## Original hero asset

Asset: `public/images/molecular-hero.webp`. Created once with the built-in ImageGen tool, then converted to WebP for web delivery. The artwork is conceptual and is not intended as an exact chemical structure.

Exact generation prompt:

> Use case: stylized-concept. Asset type: original raster hero image for a premium chemistry tutoring website. Primary request: A premium editorial still life of a physical ball-and-stick molecular model, playful yet sophisticated, suitable for a college and high-school tutoring brand. Scene/backdrop: Seamless vivid periwinkle-lilac studio background and matching floor, with no visible horizon. Subject: A single sculptural organic-chemistry-inspired ball-and-stick arrangement, constructed from white and deep cobalt spheres with a few bright tangerine spheres, connected by slender rods. Conceptual brand art, not an exact chemical structure. The model has an elegant asymmetrical, dimensional arrangement with clearly readable spheres and rods. Style/medium: Striking premium product photography / photorealistic 3D studio render. Composition/framing: Portrait 4:5 composition, model centered with generous breathing room on all sides, the entire sculpture visible, suitable for filling a website hero right panel. Lighting/mood: Soft directional studio light, beautiful realistic contact shadows, confident editorial art direction. Color palette: Vivid periwinkle-lilac background, bright white, deep cobalt blue, small bold tangerine accents. Materials/textures: Tactile matte spheres and slender matte rods, refined realistic surfaces. Constraints: Exactly one image. No diagrams, letters, text, people, logos, hands, interface, or watermark.

## Optional browser agent support

When supported, `start_tutoring_request` opens the same visible planner after validating its course and tutor options. It only stages the request and cannot send email. Browsers without WebMCP use the complete ordinary interface.

## Verification

TypeScript and lint checked. Browser checks cover course preselection, required-field validation, email draft content and recipient routing, webmail copy, mobile navigation, FAQ expansion, image loading, and page width. The browser agent tool was exercised with valid and invalid inputs; invalid courses fail without changing the selected course. No test inquiry was sent.
