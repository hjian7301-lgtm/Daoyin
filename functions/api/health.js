import { json } from "../_lib/api.js";

export function onRequestGet({ env }) {
  return json({
    ok: true,
    service: "daoyin-api",
    dbConfigured: Boolean(env.DB),
    recordingsBucketConfigured: Boolean(env.RECORDINGS_BUCKET),
    time: new Date().toISOString(),
  });
}
