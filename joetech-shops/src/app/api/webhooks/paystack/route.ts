import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseServer } from "@/lib/supabase";
import { verifyTransaction } from "@/lib/paystack";

/**
 * POST /api/webhooks/paystack
 *
 * Paystack sends this on every payment event. An order is marked PAID only
 * after TWO independent checks:
 *   1. The x-paystack-signature header is a valid HMAC-SHA512 of the raw
 *      request body, keyed with PAYSTACK_SECRET_KEY.
 *   2. The transaction is re-verified with Paystack's API
 *      (GET /transaction/verify/:reference) and the verified amount matches
 *      the order total stored in our database.
 * A forged or replayed webhook can pass neither check.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  // Raw body — required for the HMAC check (JSON parsing would change it).
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  let signatureOk = false;
  try {
    signatureOk =
      signature.length === expected.length &&
      timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    signatureOk = false;
  }
  if (!signatureOk) {
    console.warn("Paystack webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; status?: string } };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only successful charges can mark an order paid.
  if (event.event !== "charge.success" || !event.data?.reference) {
    return NextResponse.json({ received: true });
  }
  const reference = event.data.reference;

  try {
    // Re-verify with Paystack directly — never trust the webhook payload.
    const verified = await verifyTransaction(reference);
    if (verified.status !== "success") {
      console.warn(`Paystack webhook: ${reference} verified as ${verified.status}, not paid`);
      return NextResponse.json({ received: true });
    }

    const sb = supabaseServer();
    if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    const { data: order, error: orderError } = await sb
      .from("orders")
      .select("id, total_kobo, status")
      .eq("paystack_reference", reference)
      .maybeSingle();
    if (orderError) throw new Error(orderError.message);
    if (!order) {
      console.warn(`Paystack webhook: no order for reference ${reference}`);
      return NextResponse.json({ received: true });
    }
    // The verified amount must match the order total exactly.
    if (verified.amount !== order.total_kobo) {
      console.warn(
        `Paystack webhook: amount mismatch for ${reference} (verified ${verified.amount} vs order ${order.total_kobo})`,
      );
      return NextResponse.json({ received: true });
    }
    if (order.status !== "paid") {
      const { error: updateError } = await sb
        .from("orders")
        .update({ status: "paid" })
        .eq("id", order.id);
      if (updateError) throw new Error(updateError.message);
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
