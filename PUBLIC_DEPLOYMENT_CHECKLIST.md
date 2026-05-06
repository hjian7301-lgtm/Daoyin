# DaoYin / 道印 Public Deployment Checklist

This checklist prepares the current prototype for a public preview aimed at European and American users.

## Current Public Preview Status

- Public navigation hides the mock `Manage` admin entry.
- Direct `#/admin` access shows a public-preview notice instead of the mock management system.
- Checkout remains simulated.
- Account/order/product data remains browser-local through `localStorage`.
- Social poster export is client-side PNG generation.

## Recommended Cloudflare Pages Settings

- Framework preset: None
- Build command: `exit 0`
- Build output directory: `.`
- Root directory: project root

After deployment:

1. Open the temporary `*.pages.dev` URL.
2. Test `#/oracle`, `#/shop`, `#/hexagrams`, and poster export.
3. Add your custom domain in Cloudflare Pages.
4. Keep DNS and SSL managed by Cloudflare.

## Files Needed For Public Deployment

Required:

- `index.html`
- `styles.css`
- `app.js`
- `_headers`
- `_redirects`

Optional but useful:

- `README.md`
- `PUBLIC_DEPLOYMENT_CHECKLIST.md`
- `CONTENT_RIGHTS_NOTES.md`

Not required in production:

- `server.js`
- `package.json`
- internal planning `.md` files

They can remain in the repository, but a later production build should publish only the final app assets.

## Simplest Deployment Option

For the first Cloudflare Pages preview, deploy the whole folder. This is acceptable for internal preview because the app is static and management UI is hidden in public mode.

For a cleaner external preview, publish only:

```text
index.html
styles.css
app.js
_headers
_redirects
README.md
CONTENT_RIGHTS_NOTES.md
PUBLIC_DEPLOYMENT_CHECKLIST.md
```

If using GitHub, keep internal planning documents private or move them out before making the repository public.

## Pre-Public Review

- Replace placeholder product visuals with original or licensed product photography.
- Review all English interpretations for cultural accuracy and brand tone.
- Confirm that no modern translation or copyrighted commentary has been copied.
- Hide or remove prototype-only warnings once replaced by real terms, privacy, and commerce pages.
- Add real Privacy Policy, Terms of Service, Refund Policy, Shipping Policy, and Contact pages before taking payments.
- Keep medical, financial, and guaranteed-outcome claims out of product and oracle copy.
