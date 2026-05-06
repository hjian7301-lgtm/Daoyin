import { error, handleApi, json, newId, readJson, requireDb, requireOps } from "../../_lib/api.js";

const JOB_STATUS = new Set(["pending", "scheduled", "in_progress", "completed", "cancelled"]);

export function onRequestGet({ env, request }) {
  return handleApi(async () => {
    requireOps(env, request);
    const db = requireDb(env);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "pending";

    const { results } = await db
      .prepare(
        `SELECT *
         FROM consecration_jobs
         WHERE status = ?
         ORDER BY created_at DESC
         LIMIT 100`,
      )
      .bind(status)
      .all();

    return json({
      ok: true,
      jobs: results,
    });
  });
}

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    requireOps(env, request);
    const db = requireDb(env);
    const body = await readJson(request);

    if (!body.orderId || !body.orderItemId) {
      return error("orderId and orderItemId are required.", 400);
    }

    const status = body.status || "pending";

    if (!JOB_STATUS.has(status)) {
      return error("Unsupported consecration job status.", 400);
    }

    const id = newId("KG");

    await db
      .prepare(
        `INSERT INTO consecration_jobs (
          id,
          order_id,
          order_item_id,
          dao_yin_id,
          status,
          temple_location,
          scheduled_at,
          operator_notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        body.orderId,
        body.orderItemId,
        body.daoYinId || null,
        status,
        body.templeLocation || null,
        body.scheduledAt || null,
        body.operatorNotes || null,
      )
      .run();

    const job = await db.prepare("SELECT * FROM consecration_jobs WHERE id = ?").bind(id).first();

    return json(
      {
        ok: true,
        job,
      },
      { status: 201 },
    );
  });
}
