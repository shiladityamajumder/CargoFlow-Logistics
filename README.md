# CargoFlow Logistics

A Next.js logistics website template based on the [Emons reference website](https://www.emons.de/en). It includes an animated homepage, 177 local internal pages, search, location/news filters and freight/contact inquiry forms.

**Start with the [developer documentation](docs/README.md)** for setup, the file-by-file architecture, customization, component reuse, form integration, testing and deployment.

## Quick start

Requires Node.js 20.9 or newer and npm. Run from the repository root:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), or the URL printed by Next.js if that port is occupied. The checked-in content works immediately; importing the reference website is optional.

Production preview:

```bash
npm run build
npm run start
```

## What is included

| Feature | Implementation |
| --- | --- |
| Homepage at `/` and `/en` | React sections, a scene-based video hero, Lenis scrolling and a scroll-driven Lottie globe. |
| Internal pages under `/en/…` | Local HTML templates and a metadata manifest, wrapped in shared React navigation/footer and scoped CSS. |
| Services, company, locations and news | Local pages, images and fonts; searchable metadata and local filters. |
| Five freight inquiry forms | Multi-step validation, optional fields, repeatable cargo rows, summaries and back navigation. |
| General contact | A local React form with optional attachments. |
| Inquiry delivery | A server route forwarding multipart data to an owner-configured webhook. |

The template uses Next.js App Router, React 19 and TypeScript. The active homepage hero uses video; the retained Three.js prototype is not mounted. See [Project structure](docs/project-structure.md) before choosing which modules to reuse.

## Inquiry delivery

For local delivery configuration:

```bash
cp .env.example .env.local
```

Set `INQUIRY_WEBHOOK_URL` to your own multipart endpoint and optionally set `INQUIRY_WEBHOOK_TOKEN` for bearer authentication. Restart the server after changing these values.

With delivery unset, forms retain entries, explicitly report that the inquiry was not sent and offer a JSON download. There is no built-in email provider, inquiry database or tracking/account backend. Read [Forms and inquiry API](docs/forms-and-api.md) for the field contract, attachments, limits and responses.

## Developer guides

| Guide | Use it to… |
| --- | --- |
| [Getting started](docs/getting-started.md) | Install dependencies, configure the environment and understand the available commands. |
| [Project structure](docs/project-structure.md) | Find routes, components, configuration, assets and generated files. |
| [Customization and reuse](docs/customization.md) | Change branding, content, links, fonts and reusable sections. |
| [Internal pages](docs/internal-pages.md) | Add/edit pages, maintain search, compile styles and refresh reference content. |
| [Forms and inquiry API](docs/forms-and-api.md) | Adapt fields and connect delivery to your backend. |
| [Animation guide](docs/animations.md) | Understand and preserve the hero, scrolling and globe behavior. |
| [Testing and troubleshooting](docs/testing-and-troubleshooting.md) | Run existing checks and resolve common development issues. |
| [Deployment](docs/deployment.md) | Build and serve the application with its runtime integrations. |
| [Reference motion measurements](docs/reference-motion.md) | Compare the recorded frame ranges and scroll positions. |

## Verification commands

```bash
npm run typecheck
npm run build
```

For browser checks, install Playwright Chromium, start a separate server on port 3002 with delivery unset, then run `npm run test:pages`. The [testing guide](docs/testing-and-troubleshooting.md) provides the complete two-terminal workflow and the suite's coverage.

## Content and asset provenance

Reference content is checked in under `src/content/reference/`; assets are under `public/reference/`. Source URLs are recorded in the content manifest and asset inventories. These files retain Emons branding and reference content. The repository does not include an asset license granting third-party reuse.

Tracking, MyEmons, careers, map embeds and public documents retain external destinations. The local implementation excludes the reference site's executable scripts and original form submission destinations. Adapting the template for another business involves updating its content, embedded branding and external integrations as described in the [customization guide](docs/customization.md).
