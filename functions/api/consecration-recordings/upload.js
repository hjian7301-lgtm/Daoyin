import { error, handleApi, json, newId, requireDb, requireOps, requireRecordingsBucket } from "../../_lib/api.js";

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm"]);

function safeFilename(name) {
  return String(name || "recording")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "recording";
}

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    requireOps(env, request);
    const db = requireDb(env);
    const bucket = requireRecordingsBucket(env);
    const form = await request.formData();
    const file = form.get("file");
    const consecrationJobId = String(form.get("consecrationJobId") || "");

    if (!consecrationJobId || !(file instanceof File)) {
      return error("consecrationJobId and file are required.", 400);
    }

    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      return error("Unsupported video type. Use mp4, mov, or webm.", 400);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return error("Video file is too large for this prototype upload endpoint.", 413);
    }

    const job = await db
      .prepare("SELECT * FROM consecration_jobs WHERE id = ?")
      .bind(consecrationJobId)
      .first();

    if (!job) {
      return error("Kai Guang job not found.", 404);
    }

    const id = newId("KGV");
    const objectKey = `consecration-recordings/${consecrationJobId}/${id}-${safeFilename(file.name)}`;
    const daoYinId = String(form.get("daoYinId") || job.dao_yin_id || "") || null;
    const reviewStatus = String(form.get("reviewStatus") || "uploaded");
    const customerVisible = form.get("customerVisible") === "true" || form.get("customerVisible") === "on";
    const durationSeconds = Number(form.get("durationSeconds") || 0);

    await bucket.put(objectKey, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        recordingId: id,
        consecrationJobId,
        daoYinId: daoYinId || "",
        originalFilename: file.name || "",
      },
    });

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
      .bind(id, consecrationJobId, daoYinId, objectKey, Number.isFinite(durationSeconds) ? durationSeconds : 0, reviewStatus, customerVisible ? 1 : 0)
      .run();

    const recording = await db
      .prepare("SELECT * FROM consecration_recordings WHERE id = ?")
      .bind(id)
      .first();

    return json(
      {
        ok: true,
        recording,
        upload: {
          objectKey,
          size: file.size,
          contentType: file.type,
        },
      },
      { status: 201 },
    );
  });
}
