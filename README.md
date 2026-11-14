# AVUNOR — Your vision. Built.

Responsive company website for AVUNOR's website, mobile app, and SaaS development services. Includes the approved monochrome logo, concept previews, a completed-projects section, and client review submission with an anonymous display option.

## Run locally

Use Node.js 22 or newer. The website has no runtime package dependencies.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Local reviews are stored in the ignored `.review-preview-data.json` file and are separate from hosted reviews.

```sh
npm test
npm run build
```

The build creates a Cloudflare Worker module in `dist/server/index.js`, embedding the website assets. Generated build output is not committed.

## Project structure

- `public/`: HTML, responsive styles, client scripts, logo, and adaptive favicon.
- `worker.mjs`: website serving and the `/api/reviews` GET/POST handlers.
- `build.mjs`: dependency-free Worker build.
- `.openai/hosting.json`: existing Sites project and R2 binding configuration.
- `brand/`: SVG masters, PNG logo exports, preview sheet, and brand guidance.

## Hosting

The public production website is hosted on Vercel at https://www.avunorstudio.store/. Vercel serves the `public/` website assets. The separate Sites Worker deployment uses an R2 bucket bound as `BUCKET` for reviews; that storage binding is not automatically available on Vercel. Static-only hosting will not run the review API. No GitHub Actions deployment workflow is configured.

See [SEO.md](SEO.md) for search metadata, sitemap details, and the remaining Google Search Console verification steps.

## Edit contact details

Set the email and international WhatsApp number in `public/config.js`. The corresponding contact buttons appear when valid values are supplied.

## Logo files

Ready-to-use files are in `brand/exports/`, including transparent, reversed-white, and black-on-white variants. All logo SVGs contain outlined artwork and require no fonts.

To regenerate or validate the logo exports:

```sh
npm install
npm run brand:generate
npm run brand:validate
```

Illustrative concept projects are labelled. Client review completion is self-reported.
