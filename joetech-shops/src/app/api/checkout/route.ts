import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { initializeTransaction } from "@/lib/paystack";
import { randomUUID } from "crypto";

/**
 * POST /api/checkout
 * Body: { productId, qty, buyerName, buyerPhone, buyerEmail, buyerState }
 *
 * SECURITY: the browser only ever sends a product id and a quantity.
 * The price is read from the DATABASE and the total is computed HERE on the
 * server. A tampered price or total sent by the client is ignored entirely.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      productId?: string;
      qty?: number;
      buyerName?: string;
      buyerPhone?: string;
      buyerEmail?: string;
      buyerState?: string;
    };

    const productId = body.productId?.trim();
    const qty = Math.floor(Number(body.qty) || 0);
    const buyerName = body.buyerName?.trim();
    const buyerPhone = body.buyerPhone?.trim();
    const buyerEmail = body.buyerEmail?.trim();
    const buyerState = body.buyerState?.trim();

    if (!productId || qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Invalid product or quantity." }, { status: 400 });
    }
    if (!buyerName || !buyerPhone || !buyerEmail || !buyerState) {
      return NextResponse.json({ error: "Name, phone, email and state are all required." }, { status: 400 });
    }

    const sb = supabaseServer();
    if (!sb) {
      return NextResponse.json(
        { error: "Checkout is not configured yet. Connect Supabase and Paystack (see README.md)." },
        { status: 503 },
      );
    }

    // 1. Price lookup from the database — never from the request.
    const { data: product, error: productError } = await sb
      .from("products")
      .select("id, shop_id, name, price_kobo, stock")
      .eq("id", productId)
      .maybeSingle();
    if (productError) throw new Error(productError.message);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    if (product.stock < qty) {
      return NextResponse.json({ error: "Not enough stock for that quantity." }, { status: 400 });
    }

    // 2. Shop lookup (for the Paystack split) — the shop must belong to a
    // registered owner; anonymous/demo shops can never be checked out.
    const { data: shop, error: shopError } = await sb
      .from("shops")
      .select("id, name, paystack_subaccount_code, owner_id")
      .eq("id", product.shop_id)
      .not("owner_id", "is", null)
      .maybeSingle();
    if (shopError) throw new Error(shopError.message);
    if (!shop) {
      return NextResponse.json({ error: "This shop is not available for checkout." }, { status: 400 });
    }

    // 3. Server-side total. price_kobo is an integer; total is in kobo.
    const totalKobo = product.price_kobo * qty;

    // 4. Create the pending order (service-role client: trusted server work).
    const reference = `jshop_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const { error: orderError } = await sb.from("orders").insert({
      shop_id: shop.id,
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      buyer_state: buyerState,
      items: [{ product_id: product.id, name: product.name, qty, price_kobo: product.price_kobo }],
      total_kobo: totalKobo,
      status: "pending",
      paystack_reference: reference,
    });
    if (orderError) throw new Error(orderError.message);

    // 5. Initialise Paystack. Split payment: if the shop has a subaccount,
    // the seller is paid directly (5% platform transaction charge).
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
    const init = await initializeTransaction({
      email: buyerEmail,
      amountKobo: totalKobo,
      reference,
      callbackUrl: `${appUrl}/checkout/success?reference=${reference}`,
      subaccountCode: shop.paystack_subaccount_code,
    });

    return NextResponse.json({
      authorization_url: init.authorization_url,
      reference,
      total_kobo: totalKobo,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed." },
      { status: 500 },
    );
  }
}
