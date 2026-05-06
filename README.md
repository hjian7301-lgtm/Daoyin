# DaoYin / 道印 Clickable Prototype

This is a static clickable prototype for DaoYin / 道印, a Daoist oracle and ritual-commerce independent site.

## What Is Included

- Homepage with Daoist visual system.
- Oracle flow: reminder, question form, six coin casts, result page.
- Hexagram content module with 64 prototype records.
- Social poster export: story, square, and wide PNG formats.
- Account mock: local sign-in, reading history, order history.
- Shop mock: products, cart, checkout, order details.
- Product management mock: products, DaoYin ID inventory, orders, content preview.
- Optional Kai Guang / 开光 service and Recorded Consecration / 实地开光录制 service logic.

## Local Preview

Option 1: open `index.html` directly in a browser.

Option 2: run a local static server:

```bash
npm run start
```

Then open:

```text
http://localhost:4173
```

No dependencies are required.

## Sharing With Others

The local `file:///Users/.../index.html` URL only works on this machine.

To share the prototype with other people, use one of these options:

- Zip this folder and send it. The recipient can open `index.html` locally.
- Deploy the folder to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static host.
- Run the local server and expose it temporarily with a tunneling tool if needed.

## Important Prototype Limitations

- Accounts, cart, readings, orders, products, and DaoYin IDs are stored in each browser's `localStorage`.
- Different users do not share data.
- Checkout is simulated.
- Product management is a front-end mock, not a secure admin system.
- Full BaZi calculation is not implemented yet; the current birth pattern is a placeholder.
- Hexagram interpretation content is prototype-level and should be reviewed by a content/cultural expert.

## Suggested Static Deployment

Recommended for the current public preview: Cloudflare Pages.

### Netlify

1. Create a new site.
2. Drag this folder into Netlify Drop, or connect a Git repo.
3. Build command: leave empty.
4. Publish directory: `.`

### Vercel

1. Import this folder or Git repo.
2. Framework preset: Other.
3. Build command: leave empty.
4. Output directory: `.`

### Cloudflare Pages

1. Create a Pages project.
2. Connect the repo.
3. Build command: `exit 0`.
4. Build output directory: `.`

## Main Files

- `index.html`: app shell.
- `styles.css`: visual system and layout.
- `app.js`: prototype routes, data, interactions, poster export.
- `daoyin-functional-prototype.md`: functional spec.
- `daoyin-wireframe-prototype.md`: low-fidelity wireframe spec.
- `PUBLIC_DEPLOYMENT_CHECKLIST.md`: public deployment checklist.
- `CONTENT_RIGHTS_NOTES.md`: copyright and source-use notes.
