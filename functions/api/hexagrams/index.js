import { handleApi, json, requireDb } from "../../_lib/api.js";

export function onRequestGet({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const rows = status
      ? await db
          .prepare(
            `SELECT *
             FROM hexagrams
             WHERE status = ?
             ORDER BY id ASC`,
          )
          .bind(status)
          .all()
      : await db
          .prepare(
            `SELECT *
             FROM hexagrams
             ORDER BY id ASC`,
          )
          .all();

    return json({
      ok: true,
      hexagrams: rows.results,
    });
  });
}
