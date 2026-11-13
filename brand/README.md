# AVUNOR — Monochrome logo

An angular A with a diagonal cut, paired with custom outlined uppercase lettering.
Tagline: **Your vision. Built.**

## Files

`exports/` contains black and white versions of:

- `avunor-primary-*`: horizontal symbol and wordmark. SVG + transparent PNG, 2400px wide.
- `avunor-tagline-*`: horizontal logo with tagline. SVG + transparent PNG, 2400px wide.
- `avunor-symbol-*`: standalone A. SVG + transparent PNG, 1024 × 1024.
- Additional symbol PNGs at 16, 32, 64, 128, and 256px.

`avunor-brand-preview.png` shows light/dark applications, small symbol sizes, and a header-sized logo.
`avunor-brand-preview.svg` is the scalable presentation sheet. Its annotations use system fonts; all actual logo artwork, including the tagline, is outlined.

## Usage

- Black: `#111111` on light backgrounds. Reversed: `#FFFFFF` on dark backgrounds.
- Use SVG for websites and print. Use PNG where vector files are unsupported.
- Suggested minimum widths: primary 180px; tagline version 320px; symbol 16px.
- Preserve the aspect ratio and the built-in clear space. Add more space when needed; do not stretch or crop the logo.
- Use the primary logo for the website header and the symbol for compact icons.
- Keep the tagline in its separate version, especially at small sizes.

## Source and checks

`generate-brand.mjs` builds all exports from native geometry and the supplied tagline outlines in `tagline-outline.json`.
`validate-brand.mjs` checks transparent PNGs, output sizes, unclipped content, and font-independent SVG masters.
Install the development dependency with `npm install`, then run `npm run brand:generate` or `npm run brand:validate`.

The primary logo is used in the website header and footer; the A symbol is used for the favicon.

`avunor-primary-black-on-white.*` provides the logo on a solid white background. Other exports use transparent backgrounds.
