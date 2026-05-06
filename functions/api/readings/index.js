import {
  error,
  handleApi,
  json,
  newId,
  privateReadingRow,
  readJson,
  requireDb,
  shareToken,
  todayKey,
  upsertUser,
} from "../../_lib/api.js";

export function onRequestGet({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return error("userId query parameter is required.", 400);
    }

    const { results } = await db
      .prepare(
        `SELECT *
         FROM oracle_readings
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 50`,
      )
      .bind(userId)
      .all();

    return json({
      ok: true,
      readings: results.map(privateReadingRow),
    });
  });
}

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const body = await readJson(request);

    await upsertUser(db, body);

    const readingDate = body.readingDate || todayKey();
    const existing = await db
      .prepare(
        `SELECT id
         FROM oracle_readings
         WHERE user_id = ? AND reading_date = ?`,
      )
      .bind(body.userId, readingDate)
      .first();

    if (existing) {
      return error("This account has already created one oracle reading today.", 409, {
        existingReadingId: existing.id,
      });
    }

    const requiredFields = [
      "questionType",
      "lines",
      "changedLines",
      "hexagramId",
      "changedHexagramId",
      "slipGrade",
      "slipPoem",
      "slipGuidance",
    ];
    const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === null);

    if (missing.length) {
      return error("Missing required reading fields.", 400, { missing });
    }

    const id = newId("R");
    const publicShareToken = shareToken();
    const questionVisibility = body.questionVisibility === "public" ? "public" : "private";

    await db
      .prepare(
        `INSERT INTO oracle_readings (
          id,
          user_id,
          reading_date,
          question_type,
          question_text,
          question_visibility,
          birth_date,
          birth_time,
          birth_country,
          birth_city,
          birth_pattern_summary,
          lines_json,
          changed_lines_json,
          hexagram_id,
          changed_hexagram_id,
          slip_grade,
          slip_poem,
          slip_guidance,
          public_share_token
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        body.userId,
        readingDate,
        body.questionType,
        body.questionText || "",
        questionVisibility,
        body.birthDate || null,
        body.birthTime || null,
        body.birthCountry || null,
        body.birthCity || null,
        body.birthPatternSummary || null,
        JSON.stringify(body.lines),
        JSON.stringify(body.changedLines),
        Number(body.hexagramId),
        Number(body.changedHexagramId),
        body.slipGrade,
        body.slipPoem,
        body.slipGuidance,
        publicShareToken,
      )
      .run();

    const row = await db.prepare("SELECT * FROM oracle_readings WHERE id = ?").bind(id).first();

    return json(
      {
        ok: true,
        reading: privateReadingRow(row),
      },
      { status: 201 },
    );
  });
}
