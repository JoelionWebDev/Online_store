import CheckoutForm from "./CheckoutForm";

// Server wrapper: reads the product id from the URL and passes it to the
// client form. Allowed to block navigation (no static shell).
export const instant = false;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  return <CheckoutForm productId={product ?? ""} />;
}
