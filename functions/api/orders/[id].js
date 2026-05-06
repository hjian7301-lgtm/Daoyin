import { error, handleApi, json, readJson, requireDb } from "../../_lib/api.js";

const ORDER_STATUS = new Set([
  "draft",
  "pending_payment",
  "paid",
  "kai_guang_pending",
  "recording_pending",
  "fulfillment_pending",
  "shipped",
  "completed",
  "cancelled",
]);

async function loadOrder(db, orderId, userId) {
  const order = await db
    .prepare(
      `SELECT *
       FROM orders
       WHERE id = ? AND (? IS NULL OR user_id = ?)`,
    )
    .bind(orderId, userId || null, userId || null)
    .first();

  if (!order) {
    return null;
  }

  const { results: items } = await db
    .prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC")
    .bind(orderId)
    .all();

  return { ...order, items };
}

export function onRequestGet({ env, params, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const order = await loadOrder(db, params.id, userId);

    if (!order) {
      return error("Order not found.", 404);
    }

    return json({
      ok: true,
      order,
    });
  });
}

export function onRequestPatch({ env, params, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const body = await readJson(request);

    if (body.status && !ORDER_STATUS.has(body.status)) {
      return error("Unsupported order status.", 400);
    }

    await db
      .prepare(
        `UPDATE orders
         SET
           status = COALESCE(?, status),
           shipping_total = COALESCE(?, shipping_total),
           shipping_address_json = COALESCE(?, shipping_address_json),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(
        body.status || null,
        body.shippingTotal === undefined ? null : Number(body.shippingTotal),
        body.shippingAddress === undefined ? null : JSON.stringify(body.shippingAddress),
        params.id,
      )
      .run();

    const order = await loadOrder(db, params.id, body.userId || null);

    if (!order) {
      return error("Order not found.", 404);
    }

    return json({
      ok: true,
      order,
    });
  });
}
