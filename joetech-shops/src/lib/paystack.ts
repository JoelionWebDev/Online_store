// Paystack helpers. All calls are server-side only — the secret key never
// reaches the browser. Card numbers are never collected or stored anywhere
// in this app; Paystack handles payment details on its own checkout page.

const PAYSTACK_BASE = "https://api.paystack.co";

/** Platform fee taken from each sale: 5% of the order total. */
export const PLATFORM_FEE_PERCENT = 5;

export type InitResult = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export async function initializeTransaction(args: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  subaccountCode?: string | null;
}): Promise<InitResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not set");

  // Split payment: when the shop has a Paystack subaccount, the seller's
  // money goes straight to their own Paystack account and the platform
  // keeps a 5% transaction charge. Without a subaccount, the full amount
  // goes to the platform account (the owner settles sellers manually).
  const body: Record<string, unknown> = {
    email: args.email,
    amount: args.amountKobo,
    reference: args.reference,
    callback_url: args.callbackUrl,
  };
  if (args.subaccountCode) {
    body.subaccount = args.subaccountCode;
    body.transaction_charge = Math.round(
      (args.amountKobo * PLATFORM_FEE_PERCENT) / 100,
    );
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data?: InitResult;
  };
  if (!res.ok || !data.status || !data.data) {
    throw new Error(`Paystack initialise failed: ${data.message}`);
  }
  return data.data;
}

export type VerifyResult = {
  status: string;
  reference: string;
  amount: number;
  customer: { email: string };
};

export async function verifyTransaction(
  reference: string,
): Promise<VerifyResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not set");
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );
  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data?: VerifyResult;
  };
  if (!res.ok || !data.status || !data.data) {
    throw new Error(`Paystack verify failed: ${data.message}`);
  }
  return data.data;
}
