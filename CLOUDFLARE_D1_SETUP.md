# Cloudflare D1 Setup For DaoYin

Current live API check:

```text
https://daoyin.uk/api/health
```

Expected before D1 binding:

```json
{"ok":true,"service":"daoyin-api","dbConfigured":false}
```

After D1 binding, `dbConfigured` should become `true`.

## Current Status

Completed through Wrangler CLI:

- D1 database created: `daoyin-mvp`
- D1 database ID: `9537dc05-02c5-4180-9241-1d7fa8397dd8`
- Schema imported from `database/schema.sql`
- Pages binding configured in `wrangler.toml` with binding name `DB`

## 1. Create The D1 Database

In Cloudflare dashboard:

1. Open `Workers & Pages`.
2. Open `D1 SQL Database`.
3. Create a database named:

```text
daoyin-mvp
```

## 2. Import Schema

Use the SQL in:

```text
database/schema.sql
```

Recommended dashboard method:

1. Open the `daoyin-mvp` D1 database.
2. Open its SQL console.
3. Paste the full contents of `database/schema.sql`.
4. Run the SQL.

Optional CLI method:

```bash
npx wrangler d1 execute daoyin-mvp --remote --file=database/schema.sql
```

## 3. Bind D1 To Pages

Current repository binding:

```toml
[[d1_databases]]
binding = "DB"
database_name = "daoyin-mvp"
database_id = "9537dc05-02c5-4180-9241-1d7fa8397dd8"
```

Dashboard fallback:

In Cloudflare dashboard:

1. Open `Workers & Pages`.
2. Open the Pages project for DaoYin.
3. Open `Settings`.
4. Open `Functions`.
5. Add a D1 database binding.
6. Use this variable name exactly:

```text
DB
```

7. Select the `daoyin-mvp` database.
8. Save.

## 4. Redeploy

Trigger a new Pages deployment after saving the binding.

The simplest path is to push any new commit to GitHub, or use the Cloudflare Pages redeploy button for the latest deployment.

## 5. Verify

Open:

```text
https://daoyin.uk/api/health
```

Expected after D1 binding:

```json
{"ok":true,"service":"daoyin-api","dbConfigured":true}
```

Then test a DB-backed API:

```text
https://daoyin.uk/api/readings?userId=test-user
```

Expected after D1 binding:

```json
{"ok":true,"readings":[]}
```

The site header should also change from `Local Mode` to `API Live` after the browser refreshes.

## Notes

- The current front end still uses local browser storage.
- The API scaffold is ready, but front-end integration should happen after D1 is bound.
- Payment remains intentionally deferred.
- DaoYin ID creation and Kai Guang operations must be protected with real admin authentication before production launch.
