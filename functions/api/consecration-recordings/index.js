import { error, handleApi, json, newId, readJson, requireDb, requireOps } from "../../_lib/api.js";

export function onRequestGet({ env, request }) {
  return handleApi(async () => {
    requireOps(env, request);
    const db = requireDb(env);
    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");

    if (!jobId) {
      return error("jobId query parameter is required.", 400);
    }

    const { results } = await db
      .prepare(
        `SELECT *
         FROM consecration_recordings
         WHERE consecration_job_id = ?
         ORDER BY uploaded_at DESC`,
      )
      .bind(jobId)
      .all();

    return json({
      ok: true,
      recordings: results,
    });
  });
}

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    requireOps(env, request);
    const db = requireDb(env);
    const body = await readJson(request);

    if (!body.consecrationJobId || !body.r2ObjectKey) {
      return error("consecrationJobId and r2ObjectKey are required.", 400);
    }

    const id = newId("KGV");

    await db
      .prepare(
        `INSERT INTO consecration_recordings (
          id,
          consecration_job_id,
          dao_yin_id,
          r2_object_key,
          duration_seconds,
          review_status,
          customer_visible
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        body.consecrationJobId,
        body.daoYinId || null,
        body.r2ObjectKey,
        Number(body.durationSeconds || 0),
        body.reviewStatus || "uploaded",
        body.customerVisible ? 1 : 0,
      )
      .run();

    const recording = await db
      .prepare("SELECT * FROM consecration_recordings WHERE id = ?")
      .bind(id)
      .first();

    return json(
      {
        ok: true,
        recording,
      },
      { status: 201 },
    );
  });
}
