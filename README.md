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

## Backend Scaffold

The repository now includes a Cloudflare Pages Functions and D1 scaffold for the next MVP layer. The current UI still works as a static prototype, and the API becomes active after a Cloudflare D1 database is created and bound to the Pages project as `DB`.

Cloudflare routing is limited to `/api/*` through `_routes.json`, so normal page routes remain static and continue to use the SPA fallback in `_redirects`.

The front end uses progressive sync:

- Before D1 is bound, readings, account data, carts, and orders stay in local browser storage.
- After D1 is bound and `/api/health` returns `dbConfigured:true`, signed-in oracle readings and draft orders are also sent to the API.
- The account page reads cloud reading and order history from `/api/account?userId=...` when D1 is connected.
- The order detail page reads D1 item details from `/api/orders/:id?userId=...` when D1 is connected.
- Logged-in oracle entry checks D1 account history before allowing a new daily reading.
- Draft orders automatically create pending Kai Guang jobs for items with Kai Guang selected.
- Guest readings remain local until a real account/auth flow is connected.

Included API entry points:

- `GET /api/health`: deployment and DB binding check.
- `POST /api/auth/start`: create a development email verification code.
- `POST /api/auth/verify`: verify code, create or update user, return session token.
- `GET /api/account?userId=...`: account summary, reading history, order history.
- `GET /api/readings?userId=...`: account reading history.
- `POST /api/readings`: create one reading per account per day.
- `GET /api/readings/:id?userId=...`: private reading detail.
- `GET /api/share/readings/:token`: public shared reading without birth data.
- `GET /api/hexagrams`: hexagram content list.
- `GET /api/hexagrams/:id`: hexagram detail with line text.
- `GET /api/dao-yin-ids?status=available`: DaoYin ID inventory.
- `POST /api/dao-yin-ids`: create DaoYin ID records.
- `POST /api/orders/draft`: create a non-payment order draft.
- `GET /api/orders/:id?userId=...`: order detail.
- `PATCH /api/orders/:id`: update non-payment order fields.
- `GET /api/consecration-jobs?status=pending`: Kai Guang job list.
- `POST /api/consecration-jobs`: create Kai Guang job.
- `GET /api/consecration-jobs/:id`: Kai Guang job detail.
- `PATCH /api/consecration-jobs/:id`: update Kai Guang job.
- `GET /api/consecration-recordings?jobId=...`: recording metadata list.
- `POST /api/consecration-recordings`: create recording metadata.

D1 schema:

```bash
database/schema.sql
```

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
- `functions/`: Cloudflare Pages Functions API scaffold.
- `database/schema.sql`: Cloudflare D1 schema.
- `_routes.json`: Cloudflare Pages Functions route scope for `/api/*`.
- `wrangler.toml`: Cloudflare Pages project config and D1 binding.
- `daoyin-functional-prototype.md`: functional spec.
- `daoyin-wireframe-prototype.md`: low-fidelity wireframe spec.
- `PUBLIC_DEPLOYMENT_CHECKLIST.md`: public deployment checklist.
- `CONTENT_RIGHTS_NOTES.md`: copyright and source-use notes.
- `CLOUDFLARE_D1_SETUP.md`: D1 database creation, schema import, and Pages binding steps.
- `MVP_BACKEND_AND_CONTENT_PLAN.md`: backend, database, sharing, Kai Guang workflow, and content model plan.
