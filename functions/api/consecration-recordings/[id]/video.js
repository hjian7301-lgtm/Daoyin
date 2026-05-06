import { error, handleApi, requireDb, requireOps, requireRecordingsBucket } from "../../../_lib/api.js";

async function canAccessRecording(db, request, env, recording) {
  try {
    requireOps(env, request);
    return true;
  } catch {
    // Fall through to customer visibility checks.
  }

  if (!recording.customer_visible) {
    return false;
  }

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const orderId = url.searchParams.get("orderId");

  if (!userId || !orderId) {
    return false;
  }

  const order = await db
    .prepare(
      `SELECT orders.id
       FROM orders
       JOIN consecration_jobs jobs ON jobs.order_id = orders.id
       WHERE orders.id = ?
         AND orders.user_id = ?
         AND jobs.id = ?`,
    )
    .bind(orderId, userId, recording.consecration_job_id)
    .first();

  return Boolean(order);
}

export function onRequestGet({ env, params, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const bucket = requireRecordingsBucket(env);
    const recording = await db
      .prepare("SELECT * FROM consecration_recordings WHERE id = ?")
      .bind(params.id)
      .first();

    if (!recording) {
      return error("Recording not found.", 404);
    }

    if (!(await canAccessRecording(db, request, env, recording))) {
      return error("Recording access is not allowed.", 403);
    }

    const object = await bucket.get(recording.r2_object_key);

    if (!object) {
      return error("Recording object not found.", 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "private, max-age=300");

    return new Response(object.body, {
      headers,
    });
  });
}
