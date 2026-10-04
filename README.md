# CargoFlow Logistics

The reference is https://www.emons.de/en. Local fonts, transport footage, service illustrations, photos and globe assets are in `public/reference/`. Their source URLs are recorded in `public/reference/asset-sources.json`.

## Run

```sh
npm install
npm run dev
```

Production preview:

```sh
npm run build
npm run start -- --hostname 0.0.0.0 --port 3001
```

## Scroll behavior

The hero occupies one viewport. Each wheel or touch gesture advances one scene: Road, Logistics, Air & Sea, Rail, then Digital. Its overlays slide for one second while the original rendered video plays the corresponding camera transition. Scrolling stays at the top during these transitions; after Digital, the page resumes normal scrolling. Returning to the top and scrolling upward selects the earlier scenes. Numbered tabs select a scene directly. Keyboard arrows and Page Up/Down also work.

`JourneySection.tsx` controls the scene transitions and video loops. Frame ranges use the same 46/1103 conversion as the reference. `SmoothScrolling.tsx` provides the reference's 0.1 interpolation and 0.8 wheel multiplier, respecting gestures intercepted by the hero.

## Globe animation

`NetworkSection.tsx` pins its content inside a 200svh section. The globe rises from 100svh below its resting position, shrinks from 2× to 1× and rotates from −15° to 0°. Motion runs between the 15% and 70% scroll keyframes with the reference's easing and 90% smoothing. The original `planet-routes.json` Lottie asset draws routes and location dots over the globe; its frames follow the 30–100% timeline, ending at 65% of the animation. Scrolling back reverses both transforms and route drawing.

The page follows the live site's section order: hero, mission, globe statistics, services, company, news, call to action and footer.

## Reference and scope

The original footage includes Emons branding. The earlier procedural Three.js components remain in the source tree but are not mounted by this page. The homepage's animation controllers and timing remain unchanged. Its service cards, news cards, navigation and calls to action now open their corresponding pages.

The project includes 177 English internal pages from the reference's public sitemap: services, company information, location directory and details, news index and articles, legal information, customer information, and five freight inquiry forms. Reviewed HTML templates live in `src/content/reference/`; images and fonts are stored locally in `public/reference/`. Source URLs are recorded in the manifest and asset inventory. All reference selectors are scoped to `.reference-page`, except the responsive root font size, which applies only while an internal page is present. Regular document navigation isolates these styles and page interactions from the homepage animation lifecycle.

Navigation menus, search, news and location filters, accordions, tabs, horizontal carousels and form behavior are implemented locally. The original site's executable scripts, analytics and submission destinations are excluded. The contact widget is replaced by an accessible local form. Shipment tracking, MyEmons, careers, maps and downloadable documents retain their external destinations.

## Inquiry delivery

Copy `.env.example` to `.env.local` and set `INQUIRY_WEBHOOK_URL` to your own delivery endpoint. Optionally set `INQUIRY_WEBHOOK_TOKEN` for bearer authentication. The endpoint receives `multipart/form-data`, including `kind`, the form's fields and any contact attachments (10 MB total limit).

Without that configuration, forms validate and retain entries, explicitly report that delivery is not connected, and offer a JSON download. They never report a successful delivery or submit to the reference company's webhook. Connect a real endpoint before using inquiry submission in production.

## Refresh reference templates

The checked-in pages work without fetching the reference at runtime. To deliberately refresh the public templates, install the Python requirements in `scripts/reference-requirements.txt`, run `python3 scripts/import-reference.py`, and run `npm run reference:styles`. Review the resulting changes before publishing. The importer strips scripts and submission destinations; the stylesheet compiler scopes the reference CSS. The contact interface and interaction logic remain maintained React/TypeScript code.

## Verification

Run `npm run typecheck` and `npm run build`. To run browser checks, install Chromium with `npx playwright install chromium`, start the app on port 3002, and run `npm run test:pages`. Use `TEST_BASE_URL` to change the server URL or `CHROMIUM_PATH` to use an existing Chromium executable. Run these checks without a delivery webhook configured; the tests deliberately verify the truthful disconnected-delivery state and never send real inquiries.

The browser checks cover all 177 internal routes, all five multi-step freight forms, required-field validation, optional addresses, repeated cargo positions, summaries and back navigation, contact submission, keyboard accordions, filtering and empty results, search, navigation, mobile overflow and homepage forward/reverse wheel transitions. See `docs/reference-motion.md` for the preserved motion settings.
