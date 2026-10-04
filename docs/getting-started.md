# Getting started

[Documentation index](README.md) · Next: [Project structure](project-structure.md)

## Requirements

| Requirement | Use |
| --- | --- |
| Node.js 20.9 or newer | Required by the installed Next.js version. Node.js 22 was used for recorded verification. |
| npm | Dependency installation and the commands in this documentation. |
| A current browser | Viewing the site, native form inputs and scroll interactions. |
| Python 3 | Optional; used only by the reference-content importer. |
| Playwright Chromium | Optional; required for the existing browser verification script. |

The project uses Next.js App Router, React 19 and TypeScript. `package.json` declares version ranges; `package-lock.json` records the resolved dependency versions. Use the lockfile for reproducible installations.

The installed Next.js package includes documentation under `node_modules/next/dist/docs/`. Consult that version's documentation when extending framework features. The repository's `AGENTS.md` also directs coding assistants to these local guides.

## Install and start

Clone or copy the repository, open a terminal at its root, and run:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is occupied, Next.js may choose another port; use the address printed in the terminal.

To choose a port explicitly:

```bash
npm run dev -- --port 3002
```

Keep the development server running while editing the project. The checked-in page content and assets are ready to use; you do not need Python, a reference import or a webhook to preview the site.

## Configure inquiry delivery

For development without delivery, leave the webhook unset. Forms validate and retain the current entries, report that delivery is disconnected and offer an inquiry download.

To connect your own endpoint:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```dotenv
INQUIRY_WEBHOOK_URL=https://your-backend.example/inquiries
INQUIRY_WEBHOOK_TOKEN=your-optional-bearer-token
```

Restart the development server after changing environment variables. These variables are read by the server route; they do not use a `NEXT_PUBLIC_` prefix. `.env.local` is ignored by Git.

The endpoint must accept `multipart/form-data` and return a successful HTTP status when it has accepted the inquiry. The project does not provision an email provider or automatically create this endpoint. See [Forms and inquiry API](forms-and-api.md) for the request and response contract.

## Available commands

| Command | Purpose | Writes generated output? |
| --- | --- | --- |
| `npm ci` | Install the lockfile's dependencies. | Creates `node_modules/`. |
| `npm run dev` | Start the Next.js development server. | Creates development output under `.next/`; Next.js can refresh generated type files. |
| `npm run build` | Compile and generate production pages. | Creates production output under `.next/`. |
| `npm run start` | Serve the existing production build. | Requires a successful build first. |
| `npm run typecheck` | Check TypeScript without emitting application JavaScript. | May update the incremental TypeScript cache. |
| `npm run test:pages` | Run the browser verification script against a running server. | Does not start that server for you. |
| `npm run reference:styles` | Compile scoped internal-page styles and rebuild the homepage search index. | Updates `public/reference/styles/` and `src/config/search-index.json`. |

There is no configured lint, unit-test or static-export command. Use the commands actually defined in `package.json`.

## First-run walkthrough

1. Open `/` and use successive downward wheel gestures to move through Road, Logistics, Air & Sea, Rail and Digital. The next gesture releases normal document scrolling.
2. Open a service card. It should navigate to a complete internal page such as `/en/leistungen/strasse`.
3. Open `/en/standorte` and test location search. Open `/en/news` and select a category.
4. Open `/en/frachtanfrage`, select a transport mode and move through its form. Previous-step entries should remain available when navigating backward.
5. Open `/en/kontakt` and expand an FAQ item.
6. Resize the browser to a mobile width and open the navigation menu.

For automated checks, continue to [Testing and troubleshooting](testing-and-troubleshooting.md). For a production preview, use [Deployment](deployment.md).
