import { error, handleApi, json, requireDb } from "../../_lib/api.js";

export function onRequestGet({ env, params }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const hexagram = await db.prepare("SELECT * FROM hexagrams WHERE id = ?").bind(params.id).first();

    if (!hexagram) {
      return error("Hexagram not found.", 404);
    }

    const { results: yaoTexts } = await db
      .prepare(
        `SELECT *
         FROM yao_texts
         WHERE hexagram_id = ?
         ORDER BY line_number ASC`,
      )
      .bind(params.id)
      .all();

    return json({
      ok: true,
      hexagram,
      yaoTexts,
    });
  });
}
