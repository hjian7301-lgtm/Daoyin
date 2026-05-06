import { error, handleApi, json, readJson, requireDb, requireOps } from "../../_lib/api.js";

const JOB_STATUS = new Set(["pending", "scheduled", "in_progress", "completed", "cancelled"]);

export function onRequestGet({ env, params, request }) {
  return handleApi(async () => {
    requireOps(env, request);
    const db = requireDb(env);
    const job = await db.prepare("SELECT * FROM consecration_jobs WHERE id = ?").bind(params.id).first();

    if (!job) {
      return error("Consecration job not found.", 404);
    }

    return json({
      ok: true,
      job,
    });
  });
}

export function onRequestPatch({ env, params, request }) {
  return handleApi(async () => {
    requireOps(env, request);
    const db = requireDb(env);
    const body = await readJson(request);

    if (body.status && !JOB_STATUS.has(body.status)) {
      return error("Unsupported consecration job status.", 400);
    }

    const completedAt = body.status === "completed" ? body.completedAt || new Date().toISOString() : body.completedAt || null;

    await db
      .prepare(
        `UPDATE consecration_jobs
         SET
           status = COALESCE(?, status),
           temple_location = COALESCE(?, temple_location),
           scheduled_at = COALESCE(?, scheduled_at),
           completed_at = COALESCE(?, completed_at),
           operator_notes = COALESCE(?, operator_notes),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(
        body.status || null,
        body.templeLocation || null,
        body.scheduledAt || null,
        completedAt,
        body.operatorNotes || null,
        params.id,
      )
      .run();

    const job = await db.prepare("SELECT * FROM consecration_jobs WHERE id = ?").bind(params.id).first();

    if (!job) {
      return error("Consecration job not found.", 404);
    }

    return json({
      ok: true,
      job,
    });
  });
}
