import {
  authCode,
  error,
  handleApi,
  isValidEmail,
  json,
  newId,
  normalizeEmail,
  readJson,
  requireDb,
} from "../../_lib/api.js";

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const body = await readJson(request);
    const email = normalizeEmail(body.email);

    if (!isValidEmail(email)) {
      return error("A valid email is required.", 400);
    }

    const code = authCode();

    await db
      .prepare(
        `INSERT INTO auth_codes (id, email, code, expires_at)
         VALUES (?, ?, ?, datetime('now', '+10 minutes'))`,
      )
      .bind(newId("AC"), email, code)
      .run();

    return json({
      ok: true,
      delivery: "development",
      email,
      devCode: code,
      expiresInMinutes: 10,
    });
  });
}
