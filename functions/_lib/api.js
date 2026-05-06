export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

export function error(message, status = 400, details = undefined) {
  return json(
    {
      ok: false,
      error: details ? { message, details } : { message },
    },
    { status },
  );
}

export async function readJson(request) {
  const text = await request.text();

  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    const parseError = new Error("Request body must be valid JSON.");
    parseError.status = 400;
    throw parseError;
  }
}

export function requireDb(env) {
  if (!env.DB) {
    const dbError = new Error("Cloudflare D1 binding DB is not configured.");
    dbError.status = 503;
    throw dbError;
  }

  return env.DB;
}

export async function handleApi(handler) {
  try {
    return await handler();
  } catch (err) {
    return error(err.message || "Unexpected API error.", err.status || 500, err.details);
  }
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function newId(prefix) {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}

export function shareToken() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 24);
}

export function parseJsonField(value, fallback) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function publicReadingRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    readingDate: row.reading_date,
    questionType: row.question_type,
    questionText: row.question_visibility === "public" ? row.question_text : "",
    questionVisibility: row.question_visibility,
    lines: parseJsonField(row.lines_json, []),
    changedLines: parseJsonField(row.changed_lines_json, []),
    hexagramId: row.hexagram_id,
    changedHexagramId: row.changed_hexagram_id,
    oracleSlip: {
      grade: row.slip_grade,
      poem: row.slip_poem,
      guidance: row.slip_guidance,
    },
    publicShareToken: row.public_share_token,
    createdAt: row.created_at,
  };
}

export function privateReadingRow(row) {
  if (!row) {
    return null;
  }

  return {
    ...publicReadingRow(row),
    userId: row.user_id,
    questionText: row.question_text,
    birth: {
      date: row.birth_date,
      time: row.birth_time,
      country: row.birth_country,
      city: row.birth_city,
      patternSummary: row.birth_pattern_summary,
    },
  };
}

export async function upsertUser(db, body) {
  if (!body.userId || !body.email) {
    const userError = new Error("userId and email are required.");
    userError.status = 400;
    throw userError;
  }

  await db
    .prepare(
      `INSERT INTO users (id, email, display_name, locale, last_login_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         display_name = COALESCE(excluded.display_name, users.display_name),
         locale = COALESCE(excluded.locale, users.locale),
         last_login_at = CURRENT_TIMESTAMP`,
    )
    .bind(body.userId, body.email, body.displayName || null, body.locale || "en")
    .run();
}
