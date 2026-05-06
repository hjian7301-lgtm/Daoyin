import { error, handleApi, json, privateReadingRow, requireDb } from "../../_lib/api.js";

export function onRequestGet({ env, params, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return error("userId query parameter is required.", 400);
    }

    const row = await db
      .prepare(
        `SELECT *
         FROM oracle_readings
         WHERE id = ? AND user_id = ?`,
      )
      .bind(params.id, userId)
      .first();

    if (!row) {
      return error("Reading not found.", 404);
    }

    return json({
      ok: true,
      reading: privateReadingRow(row),
    });
  });
}
