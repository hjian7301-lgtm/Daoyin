import { handleApi, json, newId, readJson, requireDb, upsertUser } from "../../_lib/api.js";

export function onRequestPost({ env, request }) {
  return handleApi(async () => {
    const db = requireDb(env);
    const body = await readJson(request);

    await upsertUser(db, body);

    const orderId = newId("O");
    const items = Array.isArray(body.items) ? body.items : [];
    const serviceTotal = items.reduce((sum, item) => {
      const kaiGuangFee = item.kaiGuangSelected ? Number(item.kaiGuangFee || 0) : 0;
      const recordingFee = item.recordingSelected ? Number(item.recordingFee || 0) : 0;
      return sum + kaiGuangFee + recordingFee;
    }, 0);
    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.unitPrice || 0) * Number(item.quantity || 1);
    }, 0);

    await db
      .prepare(
        `INSERT INTO orders (
          id,
          user_id,
          status,
          subtotal,
          service_total,
          shipping_total,
          currency,
          payment_status,
          customer_email,
          shipping_address_json
        )
        VALUES (?, ?, 'draft', ?, ?, ?, ?, 'not_connected', ?, ?)`,
      )
      .bind(
        orderId,
        body.userId,
        subtotal,
        serviceTotal,
        Number(body.shippingTotal || 0),
        body.currency || "USD",
        body.email,
        JSON.stringify(body.shippingAddress || {}),
      )
      .run();

    for (const item of items) {
      const itemId = newId("OI");
      await db
        .prepare(
          `INSERT INTO order_items (
            id,
            order_id,
            product_id,
            product_snapshot_json,
            quantity,
            kai_guang_selected,
            kai_guang_fee,
            recording_selected,
            recording_fee,
            estimated_days_min,
            estimated_days_max,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
        )
        .bind(
          itemId,
          orderId,
          item.productId || null,
          JSON.stringify(item.productSnapshot || item),
          Number(item.quantity || 1),
          item.kaiGuangSelected ? 1 : 0,
          item.kaiGuangSelected ? Number(item.kaiGuangFee || 0) : 0,
          item.recordingSelected ? 1 : 0,
          item.recordingSelected ? Number(item.recordingFee || 0) : 0,
          Number(item.estimatedDaysMin || 0),
          Number(item.estimatedDaysMax || 0),
        )
        .run();

      if (item.kaiGuangSelected) {
        await db
          .prepare(
            `INSERT INTO consecration_jobs (
              id,
              order_id,
              order_item_id,
              dao_yin_id,
              status,
              temple_location,
              operator_notes
            )
            VALUES (?, ?, ?, NULL, 'pending', ?, ?)`,
          )
          .bind(
            newId("KG"),
            orderId,
            itemId,
            item.templeLocation || null,
            item.recordingSelected
              ? "Auto-created from draft order. Recorded consecration requested after Kai Guang."
              : "Auto-created from draft order.",
          )
          .run();
      }
    }

    const order = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
    const { results: orderItems } = await db
      .prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC")
      .bind(orderId)
      .all();
    const { results: consecrationJobs } = await db
      .prepare("SELECT * FROM consecration_jobs WHERE order_id = ? ORDER BY created_at ASC")
      .bind(orderId)
      .all();

    return json(
      {
        ok: true,
        order,
        items: orderItems,
        consecrationJobs,
      },
      { status: 201 },
    );
  });
}
