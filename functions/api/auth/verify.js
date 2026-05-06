import {
  error,
  handleApi,
  isValidEmail,
  json,
  normalizeEmail,
  readJson,
  requireDb,
  sessionToken,
  stableUserId,
} from "../../_lib/api.js";

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const body = await readJson(request);
    const email = normalizeEmail(body.email);
    const code = String(body.code || "").trim();

    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
      return error("Valid email and 6-digit code are required.", 400);
    }

    const authRow = await db
      .prepare(
        `SELECT *
         FROM auth_codes
         WHERE email = ?
           AND code = ?
           AND consumed_at IS NULL
           AND expires_at > CURRENT_TIMESTAMP
         ORDER BY created_at DESC
         LIMIT 1`,
      )
      .bind(email, code)
      .first();

    if (!authRow) {
      return error("Invalid or expired code.", 401);
    }

    const userId = await stableUserId(email);

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
      .bind(userId, email, body.displayName || null, body.locale || "en")
      .run();

    await db
      .prepare("UPDATE auth_codes SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(authRow.id)
      .run();

    const token = sessionToken();

    await db
      .prepare(
        `INSERT INTO auth_sessions (token, user_id, expires_at, last_seen_at)
         VALUES (?, ?, datetime('now', '+30 days'), CURRENT_TIMESTAMP)`,
      )
      .bind(token, userId)
      .run();

    const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();

    return json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.display_name || user.email,
        locale: user.locale || "en",
      },
      session: {
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  });
}
