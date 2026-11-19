// Order emails via Resend. Called from the Paystack webhook AFTER an order
// is marked paid — never before, and never in a way that can break payment
// processing: every send is wrapped in try/catch and failures are only
// logged. If RESEND_API_KEY is not set, sending is skipped silently (the
// app builds and runs fine without it).

import { Resend } from "resend";
import { formatNaira } from "./format";
import type { OrderItem } from "./types";

const EMAIL_FROM = process.env.EMAIL_FROM ?? "Joetech Shops <orders@joetech360.ng>";

let resend: Resend | null = null;
let warnedNoKey = false;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (!warnedNoKey) {
      warnedNoKey = true;
      console.log("Resend: RESEND_API_KEY not set — order emails skipped.");
    }
    return null;
  }
  if (!resend) resend = new Resend(key);
  return resend;
}

/** Escape buyer/shop-supplied text before it goes into an HTML email. */
function esc(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function itemsRows(items: OrderItem[]): string {
  return items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${esc(item.name)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:center;">${item.qty}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${formatNaira(item.price_kobo * item.qty)}</td>
      </tr>`,
    )
    .join("");
}

function emailShell(title: string, body: string): string {
  return `<!doctype html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;margin:0;padding:0;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <p style="font-size:20px;font-weight:800;margin:0 0 4px;">Joetech <span style="color:#2563EB;">Shops</span></p>
      <h1 style="font-size:20px;margin:16px 0 8px;">${title}</h1>
      ${body}
      <p style="margin-top:24px;font-size:12px;color:#64748b;">Joetech Shops — Built by Joetech360, Lekki, Lagos.</p>
    </div>
  </body></html>`;
}

export type OrderEmailArgs = {
  reference: string;
  shopName: string;
  buyerName: string;
  buyerPhone: string;
  buyerState: string;
  buyerEmail: string | null;
  sellerEmail: string | null;
  items: OrderItem[];
  totalKobo: number;
};

/**
 * Send the buyer confirmation and the seller "new paid order" notification.
 * Never throws: each email is attempted independently and failures are
 * logged only, so a mail outage can never fail an order or a webhook.
 */
export async function sendOrderEmails(args: OrderEmailArgs): Promise<void> {
  const client = getResend();
  if (!client) return;

  const total = formatNaira(args.totalKobo);
  const rows = itemsRows(args.items);

  // (a) Buyer confirmation — only when we have a buyer email.
  if (args.buyerEmail) {
    try {
      await client.emails.send({
        from: EMAIL_FROM,
        to: args.buyerEmail,
        subject: `Your Joetech Shops order is confirmed — ${args.reference}`,
        html: emailShell(
          "Your order is confirmed",
          `<p>Hi ${esc(args.buyerName)},</p>
           <p>Thanks for shopping with <strong>${esc(args.shopName)}</strong>. Your payment of <strong>${total}</strong> was received.</p>
           <table style="width:100%;border-collapse:collapse;font-size:14px;">
             <tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #2563EB;">Item</th><th style="padding:8px 0;border-bottom:2px solid #2563EB;">Qty</th><th style="text-align:right;padding:8px 0;border-bottom:2px solid #2563EB;">Amount</th></tr>
             ${rows}
             <tr><td colspan="2" style="padding:10px 0;font-weight:700;">Total</td><td style="padding:10px 0;text-align:right;font-weight:700;">${total}</td></tr>
           </table>
           <p>Order reference: <strong>${esc(args.reference)}</strong></p>
           <p>The seller will confirm delivery with you on WhatsApp.</p>`,
        ),
      });
    } catch (err) {
      console.error("Resend: buyer confirmation failed:", err);
    }
  }

  // (b) Seller notification — only when we resolved the owner's email.
  if (args.sellerEmail) {
    try {
      await client.emails.send({
        from: EMAIL_FROM,
        to: args.sellerEmail,
        subject: `New paid order — ${args.reference}`,
        html: emailShell(
          "You have a new paid order",
          `<p>A buyer just paid for an order on your shop, <strong>${esc(args.shopName)}</strong>.</p>
           <p><strong>Buyer:</strong> ${esc(args.buyerName)}<br>
           <strong>Phone (WhatsApp):</strong> ${esc(args.buyerPhone)}<br>
           <strong>State:</strong> ${esc(args.buyerState)}</p>
           <table style="width:100%;border-collapse:collapse;font-size:14px;">
             <tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #2563EB;">Item</th><th style="padding:8px 0;border-bottom:2px solid #2563EB;">Qty</th><th style="text-align:right;padding:8px 0;border-bottom:2px solid #2563EB;">Amount</th></tr>
             ${rows}
             <tr><td colspan="2" style="padding:10px 0;font-weight:700;">Total</td><td style="padding:10px 0;text-align:right;font-weight:700;">${total}</td></tr>
           </table>
           <p>Order reference: <strong>${esc(args.reference)}</strong></p>
           <p>Please confirm delivery with the buyer on WhatsApp.</p>`,
        ),
      });
    } catch (err) {
      console.error("Resend: seller notification failed:", err);
    }
  }
}
