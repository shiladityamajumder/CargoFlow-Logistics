# Internal pages

[Documentation index](README.md) · Related: [Project structure](project-structure.md), [Forms](forms-and-api.md)

## Rendering workflow

`src/app/en/[...slug]/page.tsx` maps an incoming `/en/…` URL to an entry in `src/content/reference/manifest.json`. `src/lib/reference.ts` reads that entry's local HTML file. `ReferencePage.tsx` adds shared navigation/footer, scoped styles and browser interactions around the content.

`generateStaticParams()` enumerates the manifest routes for the build. Page metadata comes from each manifest entry. Unknown routes return a 404. `/en/old-frachtanfrage` and `/en/frachtanfrage-formular-old` permanently redirect to `/en/frachtanfrage`.

The homepage routes `/` and `/en` use their separate React composition. `/en/search` is a dedicated React/server-rendered route using the shared internal-page wrapper.

## Content files and naming

| File | Responsibility |
| --- | --- |
| `src/content/reference/manifest.json` | URL lookup, file identifiers, metadata and full-page search text. |
| `src/content/reference/<file>.html` | Main content only; the wrapper supplies navigation and footer. |
| `src/content/reference/<file>.css` | Source styles captured for that page. |
| `src/content/reference/original.css` | Shared source reference styles. |
| `src/content/reference/chrome.json` | Shared navigation and footer HTML. |
| `src/content/reference/assets.json` | Internal imported asset URLs and their local paths. |
| `public/reference/styles/*.css` | Browser-ready scoped output from `reference:styles`. |
| `public/reference/styles/interactions.css` | Directly maintained interaction and contact-form styling. |

The importer removes `/en/` and replaces nested `/` separators with `--`. For example:

```text
URL:             /en/leistungen/strasse
Manifest file:   leistungen--strasse
Content:         src/content/reference/leistungen--strasse.html
Source CSS:      src/content/reference/leistungen--strasse.css
Compiled CSS:    public/reference/styles/leistungen--strasse.css
```

Each manifest value has these fields:

| Field | Purpose |
| --- | --- |
| `file` | Base filename without an extension; used for both HTML and page CSS. |
| `title` | Browser/page metadata title. |
| `heading` | Display title used in search result data. The visible template heading is edited separately. |
| `description` | Metadata description and search snippet. |
| `searchText` | Text searched by `/en/search`; the importer captures up to 3,500 characters. |
| `theme` | Passed to the wrapper's `data-theme`; preserve the existing page conventions. |
| `source` | Provenance URL, not a URL fetched during page rendering. |

For example, an entry for a page you add could be:

```json
{
  "/en/services/example": {
    "file": "services--example",
    "title": "Example service | Your company",
    "heading": "Example service",
    "description": "A short description of this service.",
    "searchText": "Example service and the relevant searchable page content.",
    "theme": "dark",
    "source": ""
  }
}
```

Add the entry to the existing manifest object rather than replacing that object. `source` can be empty for original local content; the current renderer does not use it for routing.

## Edit an existing page

1. Find its URL in the manifest and read the `file` value.
2. Edit the corresponding `.html` for copy, images, links or markup. Retain layout classes and interaction attributes where you want the existing behavior.
3. Update the manifest heading, description and `searchText` when changing searchable content or metadata.
4. For style changes, edit the source `.css` and run `npm run reference:styles`. That command also refreshes the homepage search index.
5. Check the page at desktop and mobile widths, its links and any affected interactions.

Editing an HTML heading alone does not update its metadata or search text. Normal builds do not synchronize those fields or compile the reference CSS for you.

## Add a template-backed page

1. Add a unique manifest URL and `file` identifier.
2. Create `<file>.html` with the page's main content. Do not duplicate the shared navigation/footer or add an entire HTML document.
3. Create `<file>.css`, even if the page only needs shared styles. Use a comparable existing page as a starting point for the expected classes and layout.
4. Run `npm run reference:styles` to produce the scoped CSS and search index.
5. Add links to the page wherever users should discover it: shared chrome, homepage navigation, relevant content or list pages.
6. Run the documented build and browser checks. The route sweep automatically reads all manifest entries; specific interactions on a new page need their own checks.

The catch-all route handles the new URL without creating another route file. A manifest entry must point to a real HTML file; the generated page stylesheet must also be present for its layout.

To remove a page, remove its manifest entry, incoming links and associated source files. Regenerate the search index and remove obsolete compiled CSS deliberately. The style compiler does not prune output files.

## Add a React page

For an interactive page better authored in React, create a dedicated App Router route. The existing search route demonstrates using `ReferencePage` with React children instead of an HTML string.

An example for `src/app/en/example/page.tsx`:

```tsx
import { ReferencePage } from "@/components/internal/ReferencePage";

export default function ExamplePage() {
  return (
    <ReferencePage
      stylesheet="leistungen"
      theme="dark"
      pathname="/en/example"
    >
      <section className="section">
        <div className="container">
          <h1 className="text-h1">Example page</h1>
          <p>Replace this content and select styles suited to your page.</p>
        </div>
      </section>
    </ReferencePage>
  );
}
```

This example reuses an existing stylesheet. For a distinct design, supply the name of a compiled stylesheet you maintain and appropriate classes. Set page metadata in the new route using the installed Next.js conventions.

Dedicated React routes are not automatically added to either search system. To make one searchable with the current implementation, maintain a corresponding manifest record with meaningful search fields and regenerate the lightweight index. Such a record still requires a `file` value. The dedicated route serves the URL instead of the catch-all template route. The existing browser route sweep expects manifest URLs to render the internal wrapper, so retain it or adapt the verification deliberately.

## Shared chrome and navigation

`chrome.json` contains HTML strings for the internal navigation and footer. Edit their copy, destinations and embedded SVG branding directly. The internal logo is embedded markup; replacing the homepage logo file alone will not change it.

`ReferencePage` loads `original.css`, the selected page stylesheet and `interactions.css`. Its effect attaches interactions to its own wrapper and cleans them up on unmount. It mounts the React contact form at a `[data-contact-form]` placeholder when one is present.

The templates and shared chrome are inserted as trusted local HTML. The import script strips executable scripts and inline event handlers, but the runtime renderer is not an HTML sanitizer for arbitrary user input. Keep content reviewed and locally controlled.

Page links use regular document navigation. Internal styles are scoped to `.reference-page`, with a conditional root-font rule using `html:has(.reference-page)`. This separation allows the homepage's existing scroll/video lifecycle and root sizing to restart when returning to it.

## Interaction conventions

`src/components/internal/interactions.ts` implements the imported HTML behavior locally. Preserving visual classes alone is not enough when markup depends on these attributes:

| Convention | Behavior |
| --- | --- |
| Existing navigation classes and `.w-dropdown` structure | Desktop dropdowns, mobile menu and dismissal. |
| `fs-accordion-element="accordion"`, `"trigger"`, `"content"` | Expand/collapse behavior, keyboard handling and runtime accessibility state. |
| `.w-tab-link`, `.w-tab-pane`, matching `data-w-tab` | Tab selection. |
| `.splide`, its track/list/slides and previous/next arrow classes | Local horizontal carousel controls. |
| `fs-list-element="list"`, `"filters"`, `"clear"` | Location list filtering. |
| `fs-list-field` and `fs-list-value` | Location search and country/service/branch filter matching. |
| `sort-trigger` | Location sort control. |
| `fs-cmsfilter-element="list"`, `"filters"`, `"clear"` | News category filtering and reset. |
| `fs-cmsfilter-field="category"` | News category values. |
| `[data-contact-form]` | Mount point for the local React contact form. |

For form step, summary and clone conventions, use [Change or add fields](forms-and-api.md#change-or-add-fields). The current selectors and surrounding markup in `interactions.ts` are the source of truth when extending these behaviors.

## Keep search consistent

There are two search paths:

| Search | Data source | Matching |
| --- | --- | --- |
| Homepage header suggestions | `src/config/search-index.json`. | Lightweight title/description search; displays up to eight suggestions. |
| `/en/search?query=…` | `manifest.json`. | Case-insensitive heading, description and `searchText` search; query is trimmed and limited to 256 characters. |

`npm run reference:styles` rebuilds the lightweight index from the manifest. This is required after adding/removing pages or changing their search metadata, even if no CSS changed. Neither search automatically crawls edited HTML at runtime. The results page does not currently paginate results.

## Refresh imported reference content

This is an optional maintenance workflow, separate from daily development. It downloads the reference's public English sitemap pages and assets and replaces locally maintained import outputs.

Create an isolated Python environment:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r scripts/reference-requirements.txt
.venv/bin/python scripts/import-reference.py
npm run reference:styles
```

`.venv/` is not currently covered by the repository's `.gitignore`; keep it out of commits, or place your environment outside the project. No Python dependency is needed by the running Next.js application.

The importer:

- Reads the Emons sitemap and English pages, mapping nested URLs to local filenames.
- Extracts main content, page metadata, styles and shared chrome.
- Removes scripts, inline event handlers and original form submission destinations; prepares local form/contact placeholders.
- Localizes supported assets, normalizes internal links and keeps external service/document destinations.
- Writes templates, source CSS, the manifest and asset inventory. The follow-up style command writes scoped public CSS and the homepage search index.

Requests are cached by URL under `/tmp/emons-reference-cache`. Existing cached responses are reused, so rerunning the importer does not guarantee fresh remote content. For a deliberate fresh capture, move the relevant cache aside before running it.

The importer overwrites its named outputs, including locally edited templates, styles and shared chrome. It does not prune orphaned content or assets after a source page disappears. It also does not rebuild `src/config/countries.json`, homepage component copy, homepage navigation or the original homepage asset inventory. Review those independently if needed.

Review the resulting diff and verify routes, assets, styling, interactions and provenance before adopting an import. Local customization is usually better maintained by editing a specific page than by refreshing the entire reference capture.

## Recorded comparison

The October 4, 2026 comparison recorded matching heading rectangles at 1440 × 900 and 390 × 844 for road service, freight selection and contact pages. The road form's measured section dimensions also matched at the compared desktop position. These are historical measurements for those pages, not a screenshot assertion covering every route. Homepage timing measurements are preserved in [Reference motion measurements](reference-motion.md).
