import { error, handleApi, json, publicReadingRow, requireDb } from "../../../_lib/api.js";

export function onRequestGet({ env, params }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const row = await db
      .prepare(
        `SELECT *
         FROM oracle_readings
         WHERE public_share_token = ?`,
      )
      .bind(params.token)
      .first();

    if (!row) {
      return error("Shared reading not found.", 404);
    }

    return json({
      ok: true,
      reading: publicReadingRow(row),
    });
  });
}
