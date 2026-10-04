# Deployment

[Documentation index](README.md) · Related: [Forms and inquiry API](forms-and-api.md), [Testing](testing-and-troubleshooting.md)

## Deployment requirements

Deploy this project as a Next.js application with a Node.js server runtime or a hosting integration that supports its App Router server features. Use Node.js 20.9 or newer and install dependencies from the lockfile.

The internal templates are local files, and many routes are generated during the production build. Search uses server request parameters and `/api/inquiries` handles runtime POST requests. A plain upload of static files does not provide the current application's complete behavior. The project does not configure `output: "export"` or `output: "standalone"`.

There is no checked-in Dockerfile, cloud deployment adapter or provider-specific deployment workflow. The commands below describe the existing standard Node deployment path.

## Build and run

Install and validate in the application directory:

```bash
npm ci
npm run typecheck
npm run build
```

Serve the completed build:

```bash
npm run start -- --hostname 0.0.0.0 --port 3000
```

Choose the port required by your process manager or hosting platform. `next start` requires the production `.next/` output from a successful build. Keep the application process running through your hosting platform or process manager.

For a local production preview, open the server URL and run the browser checks against it with delivery unset before configuring real inquiry delivery.

## Files required by the running app

For a conventional deployment, keep the application directory and installed dependencies available, including:

| Path | Why it is needed |
| --- | --- |
| `.next/` | Production build output. |
| `public/` | Local fonts, images, video, Lottie data and compiled internal styles. |
| `src/content/reference/` | Local HTML templates; the content reader resolves these from `process.cwd()`. |
| `package.json` and installed `node_modules/` | Start command and runtime dependencies. |
| `next.config.ts` | Existing Next.js runtime/build configuration. |

Run the server from the repository/application root. When packaging the application into a reduced bundle, ensure local content is included at the path expected by `readReferencePage()`; verify direct internal URLs as well as the homepage. Do not assume moving only `.next/` supplies every public asset or filesystem template.

The reference website is not fetched to render local content. Python and the importer are unnecessary on the production server. Compile any edited internal source CSS before deploying; a normal Next.js build does not run `reference:styles` for you.

## Production environment

Set these values in the server runtime when inquiry delivery is required:

```dotenv
INQUIRY_WEBHOOK_URL=https://your-backend.example/inquiries
INQUIRY_WEBHOOK_TOKEN=your-optional-bearer-token
```

Keep them server-side. They do not need `NEXT_PUBLIC_` prefixes. The example file is a configuration reference; copying it without setting a URL leaves delivery disconnected. Restart/redeploy the process according to your platform when changing runtime environment values.

The receiving endpoint must accept multipart fields/files and respond within the application's 15-second timeout. The application accepts successful HTTP statuses as inquiry acceptance. See the [API contract](forms-and-api.md#request-contract) for field names, responses and limits.

## Proxy and asset behavior

The API compares the supplied browser Origin host with the Host reaching the application. Configure a reverse proxy to preserve the public host consistently; mismatches can produce a 403 response.

Support the request sizes your forms need within the application's 10 MiB data limit. Some hosting platforms impose smaller body limits or execution timeouts; those limits can prevent attachment forwarding even when the local development server accepts the same request.

Serve `/reference/…` assets and `/_next/…` build assets at their expected URLs. The hero uses an MP4 with seeking, so verify video loading and byte-range delivery through any asset proxy or CDN. Check direct document navigation to internal URLs; the template deliberately uses regular page links between its rendering workflows.

`allowedDevOrigins` in `next.config.ts` is for development access, not the production API's origin validation or webhook configuration.

## Release verification

Before adopting a release, run the existing type/build checks and browser suite in a delivery-disconnected environment. On the deployed app, check direct internal URLs, search, assets, mobile navigation and the homepage's forward/reverse scroll transitions.

Check configured webhook acceptance and attachment handling separately using your own integration environment. The browser suite intentionally verifies the disconnected state and does not validate a production delivery backend.

Deploy source changes together with their generated reference styles and search index. Keep `.next/`, incremental TypeScript caches and local environment files out of source edits; rebuild production output for the release.
