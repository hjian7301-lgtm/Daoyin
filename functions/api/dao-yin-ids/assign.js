import { error, handleApi, json, readJson, requireDb } from "../../_lib/api.js";

function parseProductSnapshot(row) {
  try {
    return JSON.parse(row.product_snapshot_json || "{}");
  } catch {
    return {};
  }
}

async function loadAssignment(db, body) {
  if (!body.orderId || !body.orderItemId) {
    const err = new Error("orderId and orderItemId are required.");
    err.status = 400;
    throw err;
  }

  const order = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(body.orderId).first();

  if (!order) {
    const err = new Error("Order not found.");
    err.status = 404;
    throw err;
  }

  const item = await db
    .prepare("SELECT * FROM order_items WHERE id = ? AND order_id = ?")
    .bind(body.orderItemId, body.orderId)
    .first();

  if (!item) {
    const err = new Error("Order item not found.");
    err.status = 404;
    throw err;
  }

  return { order, item, snapshot: parseProductSnapshot(item) };
}

async function selectDaoYinId(db, body, snapshot) {
  if (body.code) {
    return db
      .prepare("SELECT * FROM dao_yin_ids WHERE code = ? AND status = 'available'")
      .bind(String(body.code).trim().toUpperCase())
      .first();
  }

  const sku = body.productSku || snapshot.sku || null;

  if (sku) {
    const matched = await db
      .prepare(
        `SELECT *
         FROM dao_yin_ids
         WHERE status = 'available'
           AND (product_sku = ? OR product_sku IS NULL)
         ORDER BY
           CASE WHEN product_sku = ? THEN 0 ELSE 1 END,
           created_at ASC
         LIMIT 1`,
      )
      .bind(sku, sku)
      .first();

    if (matched) return matched;
  }

  return db
    .prepare(
      `SELECT *
       FROM dao_yin_ids
       WHERE status = 'available'
       ORDER BY created_at ASC
       LIMIT 1`,
    )
    .first();
}

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const body = await readJson(request);
    const { order, item, snapshot } = await loadAssignment(db, body);

    if (item.dao_yin_id) {
      return error("This order item already has a DaoYin ID.", 409, {
        daoYinId: item.dao_yin_id,
      });
    }

    const paid = order.payment_status === "paid" || order.status === "paid";

    if (!paid && !body.allowDraftAssignment) {
      return error("DaoYin ID assignment requires a paid order.", 409, {
        orderStatus: order.status,
        paymentStatus: order.payment_status,
        prototypeOverride: "Pass allowDraftAssignment:true before payment integration.",
      });
    }

    const daoYinId = await selectDaoYinId(db, body, snapshot);

    if (!daoYinId) {
      return error("No available DaoYin ID found for this order item.", 404);
    }

    const nextStatus = item.kai_guang_selected ? "kai_guang_pending" : paid ? "sold" : "reserved";

    await db
      .prepare(
        `UPDATE order_items
         SET dao_yin_id = ?, status = ?
         WHERE id = ?`,
      )
      .bind(daoYinId.id, item.kai_guang_selected ? "kai_guang_pending" : "reserved", item.id)
      .run();

    await db
      .prepare(
        `UPDATE dao_yin_ids
         SET
           status = ?,
           order_id = ?,
           order_item_id = ?,
           assigned_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(nextStatus, order.id, item.id, daoYinId.id)
      .run();

    await db
      .prepare(
        `UPDATE consecration_jobs
         SET dao_yin_id = ?, updated_at = CURRENT_TIMESTAMP
         WHERE order_item_id = ?`,
      )
      .bind(daoYinId.id, item.id)
      .run();

    const updatedItem = await db.prepare("SELECT * FROM order_items WHERE id = ?").bind(item.id).first();
    const updatedDaoYinId = await db.prepare("SELECT * FROM dao_yin_ids WHERE id = ?").bind(daoYinId.id).first();
    const { results: consecrationJobs } = await db
      .prepare("SELECT * FROM consecration_jobs WHERE order_item_id = ? ORDER BY created_at ASC")
      .bind(item.id)
      .all();

    return json({
      ok: true,
      daoYinId: updatedDaoYinId,
      item: updatedItem,
      consecrationJobs,
    });
  });
}
