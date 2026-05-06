import { error, handleApi, json, privateReadingRow, requireDb } from "../_lib/api.js";

export function onRequestGet({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return error("userId query parameter is required.", 400);
    }

    const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();

    if (!user) {
      return error("Account not found.", 404);
    }

    const { results: readings } = await db
      .prepare(
        `SELECT *
         FROM oracle_readings
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 20`,
      )
      .bind(userId)
      .all();

    const { results: orders } = await db
      .prepare(
        `SELECT *
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 20`,
      )
      .bind(userId)
      .all();

    return json({
      ok: true,
      account: user,
      readings: readings.map(privateReadingRow),
      orders,
    });
  });
}
