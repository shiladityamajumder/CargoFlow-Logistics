# Customization and reuse

[Documentation index](README.md) · Previous: [Project structure](project-structure.md) · Next: [Internal pages](internal-pages.md)

## Choose the editing workflow

| Your change | Edit | Follow-up |
| --- | --- | --- |
| Homepage copy, images or section order | Homepage TSX components and `src/app/page.tsx`. | Check the homepage at desktop and mobile widths. |
| Homepage colors, spacing or typography | `src/styles/globals.css`. | Check hero and globe layout as well as content sections. |
| Internal article, service or location content | Its local HTML template and manifest entry. | Refresh search data if the searchable content changed. |
| Internal page appearance | Source CSS in `src/content/reference/`. | Run `npm run reference:styles`. |
| Internal menus and footer | `src/content/reference/chrome.json`. | Check every affected route/link and both menu layouts. |
| Form behavior | `interactions.ts`, `ContactForm.tsx` or the API handler. | Follow [Forms and inquiry API](forms-and-api.md). |

Editing a TSX homepage component does not update an internal HTML template. Similarly, changing shared internal chrome does not change the homepage header or footer.

## Rebrand the template

Branding is currently distributed across the implementation. `src/config/brand.ts` is retained configuration, but it is not wired into the rendered page components. Updating those constants alone will leave the existing branding visible.

Work through these locations when adapting the template:

| Brand element | Locations to review |
| --- | --- |
| Browser title, description and social metadata | `src/app/layout.tsx`; internal `manifest.json`; the search route's metadata. |
| Header/footer logo | `/reference/logo.svg`; shared SVG/HTML in `chrome.json`. The internal header includes inline artwork, so replacing the SVG file alone does not replace it. |
| Favicon | `public/favicon.svg`. |
| Business name and copy | Homepage section components, internal HTML and shared chrome. |
| Contact details and social links | `FinalCta.tsx`, shared chrome, contact/location templates and other inline destinations. |
| Service, career and customer destinations | `config/navigation.ts`, homepage header menu records and inline links in components/templates. |
| Inquiry download name | The file-name prefix in `components/internal/inquiry.ts`. |
| Brand shown in the hero | The poster and rendered video; the original branding is baked into the footage. |
| Brand shown in other imagery | Service illustrations, photos and CTA artwork. |

The following command helps find text occurrences without modifying anything:

```bash
rg -n 'Emons|emons\.de|emons-karriere' src scripts docs README.md
```

Some matches are source attribution or reference URLs rather than visible brand copy. Keep provenance records meaningful when changing assets.

## Change homepage content

The homepage is assembled in `src/app/page.tsx`. Content appears in this order: header and hero, mission, globe statistics, services, company, news, final call to action and footer.

For copy changes, edit the relevant section component. For example, company heading/copy belongs to `ExpertiseSection.tsx`; the globe's statistics are stored in the `statistics` array inside `NetworkSection.tsx`; news titles and images are local article records in `InsightsSection.tsx`.

Reordering ordinary content sections is a composition change in `src/app/page.tsx`. The hero and globe also rely on layout and scroll timing, so consult the [Animation guide](animations.md) before moving them or changing their container structure.

Keep IDs used by fragment links, such as `services`, `network`, `insights` and `contact`, consistent with their link destinations. If a section is removed or renamed, update the related links too.

## Navigation and links

`src/config/navigation.ts` supplies the service-card records, homepage news destinations and several external URLs. Each service record has this shape:

```ts
{
  name: "Road",
  image: "road",
  href: "/en/leistungen/strasse"
}
```

`ServicesSection.tsx` resolves that image name to `/reference/road.webp`. Adding a service card requires both a valid image path and a valid destination page. A record in this array does not create a route or add the service to the internal site's shared navigation automatically.

The homepage header also has local top-level links and menu records. Its footer, hero hotspots and several calls to action have inline links. Search these files when changing a destination rather than assuming every link comes from the configuration module.

Internal menus/footer are HTML strings in `chrome.json`. Update those separately. The existing `<a href>` links perform document navigation; this is part of how the internal CSS lifecycle remains separate from homepage motion. Treat a wholesale migration to Next.js `<Link>` navigation as an architectural change requiring style and scroll regression checks.

## Assets and fonts

Place new public assets under `public/` and reference their browser URLs. For example:

```text
File: public/reference/company-team.webp
URL:  /reference/company-team.webp
```

The homepage loads local Clash Grotesk light, regular and medium fonts through `@font-face` in `src/styles/globals.css`. Internal pages use their own compiled reference CSS and font declarations. To replace typography across the site, update both styling paths and then regenerate the internal CSS.

For internal assets with hashed file names, use `src/content/reference/assets.json` to identify their original source. Rename or replace an asset only after updating its HTML/CSS references. Keep the existing image dimensions or aspect ratios when preserving the surrounding layout.

The hero requires a coordinated video, poster and frame map. Its replacement procedure is documented in [Replace the video](animations.md#replace-the-video).

## Styling boundaries

Homepage variables such as `--red`, `--coral`, `--peach`, `--ink` and `--gray` are defined in `src/styles/globals.css`. Changing them adjusts consumers in that stylesheet; it does not automatically replace the internal reference design tokens.

For internal pages, edit the source `.css` files under `src/content/reference/` and run:

```bash
npm run reference:styles
```

The compiler writes the corresponding files under `public/reference/styles/`. `interactions.css` in that public folder is maintained directly and is not regenerated by this command. Use it for the existing interactive UI overrides; keep new rules scoped to `.reference-page`.

Internal responsive rules use `html:has(.reference-page)` to adjust the root font size. The homepage uses its original root size. Unscoped typography, `html`, `body` or motion rules can affect that separation.

## Reuse individual components

The section components are exported React components that you can import into another page. Most do not expose content props, so adapting them normally means editing the component's local content or introducing a new props interface in your own implementation.

| Component or module | What must accompany it |
| --- | --- |
| `ServicesSection` | Its navigation data, referenced service images and relevant CSS rules. |
| `MissionSection`, `ExpertiseSection`, `FinalCta` | Their images, local copy/links and layout styles. `FinalCta` also renders a footer. |
| `Header` | Navigation configuration, generated search index, logo, styles and its linked routes. |
| `JourneySection` | GSAP, `ServiceGlyph`, poster/video assets, scene CSS and the full-screen layout. Review scroll event ownership before combining it with another scroller. |
| `NetworkSection` | Lottie, `lib/motion.ts`, planet artwork, route JSON and the sticky section CSS. |
| `ReferencePage` | Shared chrome, scoped styles and `interactions.ts`; use it inside the existing Next.js project or port those dependencies as well. |
| `ContactForm` | The shared submission helper, form styles and a compatible `/api/inquiries` endpoint. |

The TypeScript import alias `@/*` maps to `src/*`. Preserve that alias in a receiving project or update the imports when copying components.

For example, a dedicated React page at `src/app/services-preview/page.tsx` can reuse the existing service section:

```tsx
import { ServicesSection } from "@/components/sections/ServicesSection";

export default function ServicesPreviewPage() {
  return (
    <main>
      <ServicesSection />
    </main>
  );
}
```

Inside this project, the root layout already loads its global styles and the public assets are available. This example would create `/services-preview`; it would not add navigation or search entries automatically. When copying the section into another project, carry over its configuration, assets and the CSS for its classes. Check fragment links when using it alongside other sections.

There is no generic theme-switching API, CMS adapter or automatic white-label switch in this version. The tables above describe the concrete files to adapt.

## Validate a customization

After implementation changes in your own branch, run the existing TypeScript/build checks and the browser suite described in [Testing and troubleshooting](testing-and-troubleshooting.md). Include manual checks for any new copy, route, integration or interaction that the current suite does not cover.
