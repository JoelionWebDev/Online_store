export type Shop = {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  state: string;
  city: string;
  whatsapp_number: string | null;
  paystack_subaccount_code: string | null;
  logo_url: string | null;
  created_at: string;
  is_demo?: boolean;
};

export type Product = {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price_kobo: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  qty: number;
  price_kobo: number;
};

export type Order = {
  id: string;
  shop_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  buyer_state: string;
  items: OrderItem[];
  total_kobo: number;
  status: "pending" | "paid" | "cancelled";
  paystack_reference: string | null;
  created_at: string;
};
