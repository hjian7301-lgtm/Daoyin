import { error, handleApi, json, newId, readJson, requireDb } from "../../_lib/api.js";

export function onRequestGet({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "available";

    const { results } = await db
      .prepare(
        `SELECT *
         FROM dao_yin_ids
         WHERE status = ?
         ORDER BY created_at DESC
         LIMIT 100`,
      )
      .bind(status)
      .all();

    return json({
      ok: true,
      ids: results,
    });
  });
}

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const body = await readJson(request);
    const code = body.code || newId("DY");

    if (!/^[A-Z0-9-]{6,40}$/.test(code)) {
      return error("DaoYin ID code must use uppercase letters, numbers, and hyphens only.", 400);
    }

    const id = newId("DYID");

    await db
      .prepare(
        `INSERT INTO dao_yin_ids (id, code, product_sku, product_category, status, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        code,
        body.productSku || null,
        body.productCategory || null,
        body.status || "available",
        body.notes || null,
      )
      .run();

    const row = await db.prepare("SELECT * FROM dao_yin_ids WHERE id = ?").bind(id).first();

    return json(
      {
        ok: true,
        daoYinId: row,
      },
      { status: 201 },
    );
  });
}
