# AVUNOR SEO

Production canonical URL: https://www.avunorstudio.store/

## Implemented

- Descriptive page title and meta description matching AVUNOR's services.
- Canonical URL using the existing HTTPS/www redirect destination.
- Organization, WebSite, and WebPage JSON-LD with actual business contact information.
- Service-specific headings and introductory copy.
- Open Graph and Twitter card metadata with a 1200 × 630 PNG preview.
- `robots.txt` and a sitemap listing the single canonical page. Section anchors are not separate pages.
- Outlined logo plus a 512 × 512 organization logo PNG.
- Existing mobile layouts, accessible navigation, image dimensions, deferred scripts, and static page content retained.

## Google Search Console setup

1. Add the `avunorstudio.store` domain property in Google Search Console.
2. Verify ownership using Google's DNS TXT record through the domain's DNS provider.
3. Submit https://www.avunorstudio.store/sitemap.xml.
4. Inspect https://www.avunorstudio.store/ and request indexing.
5. Review indexing, performance, and Core Web Vitals as data becomes available.

Ownership verification and sitemap submission have not been performed by this repository. Metadata and structured data do not guarantee indexing, rankings, or rich results.

## Maintenance

Update the canonical, sitemap, robots sitemap URL, social URLs, and structured data together if the production domain changes. Update structured data when business contact details change. Do not add fabricated reviews or aggregate ratings to structured data.

Vercel's static `public/` hosting serves the SEO files directly. The Cloudflare Worker build also supports their correct content types and binary image bytes. The review submission API needs a server/storage integration on Vercel; the previously used Sites R2 binding is not automatically available there.

Run `npm run test:seo` after changing SEO files.

References: [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
