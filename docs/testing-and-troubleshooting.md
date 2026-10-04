# Testing and troubleshooting

[Documentation index](README.md) · Related: [Getting started](getting-started.md), [Animation guide](animations.md)

## TypeScript and production build

From the repository root:

```bash
npm run typecheck
npm run build
```

The first command checks the application's TypeScript types. The second compiles the application and generates production pages. Neither is a substitute for testing browser interactions or delivery integrations.

The repository has no configured `lint`, `test` or unit-test script. The existing browser command is `test:pages`.

## Run browser verification

Install the browser once after installing dependencies:

```bash
npx playwright install chromium
```

Use a test environment with `INQUIRY_WEBHOOK_URL` unset. The suite submits sample inquiries and expects the disconnected-delivery response; a configured webhook changes that behavior and would receive the sample submissions.

In terminal one, start the application on the test script's default port:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3002
```

Wait until the server is ready. In terminal two, run:

```bash
npm run test:pages
```

For a production-mode check, build first and use `npm run start -- --hostname 127.0.0.1 --port 3002` in terminal one instead.

To target a different server:

```bash
TEST_BASE_URL=http://127.0.0.1:3000 npm run test:pages
```

If you already have a compatible Chromium executable, set its absolute path through `CHROMIUM_PATH`. Otherwise the script uses Playwright's installed Chromium. These environment variables belong to the verification script, not the application.

`scripts/verify-internal-pages.mjs` launches the browser itself. It does not start Next.js or use a `playwright.config` file. Success prints `PASS` messages; a failed assertion or browser error produces a nonzero exit.

## Existing coverage

| Area | What the script checks |
| --- | --- |
| Manifest routes | Every manifest URL returns 200, contains the internal wrapper and excludes the original form webhook URL. |
| Five freight forms | Invalid initial progression, required fields, steps, summaries, preserved entries on back navigation and disconnected delivery. |
| Road form details | Optional pickup-address visibility and cargo-row add/remove behavior. |
| General contact | Required form completion, disconnected submission and keyboard accordion toggling. |
| API validation | An invalid-email request returns 400. |
| Location directory | Search reduces results, a missing term produces an empty list and clearing restores results. |
| News | Category selection filters results and reset restores them. |
| Search/navigation | Search returns results; desktop menu dismissal works. |
| Homepage hero | Four forward wheel scene changes keep the page at the top, normal scrolling then resumes, and returning to the top permits a reverse scene change. |
| Mobile layout | Selected homepage/internal pages at 390 × 844 do not overflow horizontally; the mobile menu opens. |
| Browser runtime | Captured page errors must remain empty. |

The route sweep uses HTTP requests; it is not a full visual interaction test for all 177 pages. The suite does not check live webhook acceptance, email delivery, attachment forwarding, every conditional field, touch gestures, reduced-motion behavior or exact globe frame alignment. Add appropriate manual or automated checks when changing those areas.

The current script fills date inputs with `2026-10-08`. If future date constraints or changed template requirements make that fixture invalid, update the test fixture deliberately as part of an implementation change. A date-related progression failure does not automatically indicate a scroll or navigation defect.

## Manual checks for reuse

For a new route or component adaptation, check desktop and mobile layout, destinations, metadata and search discoverability. For a form change, check newly added fields, summary values, optional states and the receiving endpoint's field mapping.

For motion changes, test forward/backward scenes, tabs, gesture locking, normal scrolling after Digital, touch input, reduced motion and globe progress in both directions. Use the [animation guide](animations.md) and [recorded measurements](reference-motion.md) for expected behavior.

## Troubleshooting

| Symptom | Check or fix |
| --- | --- |
| `next` or a dependency cannot be found | Run `npm ci` at the repository root with the supported Node version. |
| `npm run start` cannot find a build | Run `npm run build` first. Development output is not a production build. |
| Browser test reports connection refused | Start the application separately and match `TEST_BASE_URL` to its actual host/port. |
| Playwright cannot find Chromium | Run `npx playwright install chromium`, or supply a valid `CHROMIUM_PATH`. Missing Linux browser libraries require the browser's system dependencies in that environment. |
| Inquiry shows “not sent” with 503 | Delivery is unset. Configure your own webhook and restart the server when delivery is intended. |
| Browser suite fails at the disconnected-message assertion | Check that the test server has no delivery webhook configured. |
| Inquiry returns 502 | Check endpoint availability, bearer token, the endpoint's response status and the 15-second timeout. |
| Inquiry returns 403 behind a proxy | Check that the browser Origin host and the request Host reaching Next.js agree. |
| Attachment upload returns 413 | Check the 10 MiB application data limit and any smaller provider/proxy limit. |
| A template route returns 404 | Check the exact manifest URL. English content retains many German route slugs. |
| A route fails to read its content file | Check the manifest `file` value and ensure the matching HTML file is deployed at the expected path. |
| Internal page appears unstyled | Check network requests for `original.css`, the page CSS and `interactions.css`; regenerate scoped CSS from the source when needed. |
| Homepage suggestions are stale | Update manifest metadata and run `npm run reference:styles` to refresh `search-index.json`. |
| Search results have old text | Update the manifest's heading, description and `searchText`; editing HTML alone does not refresh them. |
| A template control has stopped responding | Compare its classes/data attributes and surrounding structure with the selectors in `interactions.ts`. |
| Editing `config/brand.ts` has no visible effect | The active components do not consume that retained configuration; follow the rebranding file map. |
| Changing a Three.js model has no homepage effect | The active hero is video. The procedural Three.js components are not mounted. |
| Hero moves the page while switching scenes | Review event interception, Lenis coordination and whether the hero is still at the document top. |
| Test reverse-scroll position is unstable | Let Lenis settle after wheel input; avoid jumping with `scrollTo()` during interpolation. |
| Importer keeps returning old reference content | Review the URL cache in `/tmp/emons-reference-cache`. |
| Local content disappeared after importing | Import outputs are overwritten. Restore your changes from version control and use targeted edits for local customization. |

Use browser network requests and the server terminal to distinguish missing assets/content from client-side interaction failures. For framework behavior, consult the installed Next.js documentation under `node_modules/next/dist/docs/`.
