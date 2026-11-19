import type { Product, Shop } from "./types";

// ---------------------------------------------------------------------------
// DEMO MODE ONLY.
// Shown when Supabase is not configured (no NEXT_PUBLIC_SUPABASE_URL), so the
// site is viewable with zero setup. These are fictional preview shops, always
// labelled "Demo" in the UI. They are NEVER written to the database and NEVER
// shown once Supabase is connected: on the live platform a shop only exists
// after its owner creates an account (shops.owner_id is NOT NULL), so only
// products of registered owners ever appear in public lists.
// ---------------------------------------------------------------------------

function pic(seed: string, w = 600, h = 400) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const DEMO_SHOPS: Shop[] = [
  {
    id: "demo-shop-1",
    owner_id: null,
    name: "Adaeze Fashion Hub",
    slug: "adaeze-fashion-hub",
    description:
      "Ready-to-wear Ankara dresses, gowns and two-piece sets, sewn in Lagos and delivered nationwide.",
    state: "Lagos",
    city: "Lekki",
    whatsapp_number: "2348167099131",
    paystack_subaccount_code: null,
    logo_url: pic("adaeze-logo", 200, 200),
    created_at: "2026-11-01T09:00:00Z",
    is_demo: true,
  },
  {
    id: "demo-shop-2",
    owner_id: null,
    name: "Lekki Gadgets",
    slug: "lekki-gadgets",
    description:
      "Phones, accessories and small electronics at honest prices, with a 30-day warranty on every item.",
    state: "Lagos",
    city: "Ikeja",
    whatsapp_number: "2348167099131",
    paystack_subaccount_code: null,
    logo_url: pic("lekki-gadgets-logo", 200, 200),
    created_at: "2026-11-02T09:00:00Z",
    is_demo: true,
  },
  {
    id: "demo-shop-3",
    owner_id: null,
    name: "Zuma Agro Mart",
    slug: "zuma-agro-mart",
    description:
      "Fresh farm produce from Abuja outskirts — yams, grains and vegetables, sold in retail and wholesale bags.",
    state: "FCT - Abuja",
    city: "Gwagwalada",
    whatsapp_number: "2348167099131",
    paystack_subaccount_code: null,
    logo_url: pic("zuma-logo", 200, 200),
    created_at: "2026-11-03T09:00:00Z",
    is_demo: true,
  },
  {
    id: "demo-shop-4",
    owner_id: null,
    name: "Kano Leather Works",
    slug: "kano-leather-works",
    description:
      "Handmade leather bags, sandals and wallets from Kano's famous tanneries. Built to last.",
    state: "Kano",
    city: "Kano",
    whatsapp_number: "2348167099131",
    paystack_subaccount_code: null,
    logo_url: pic("kano-leather-logo", 200, 200),
    created_at: "2026-11-04T09:00:00Z",
    is_demo: true,
  },
  {
    id: "demo-shop-5",
    owner_id: null,
    name: "Nwanyi Kitchen",
    slug: "nwanyi-kitchen",
    description:
      "Homemade soups, foodstuff and party packs from Enugu. Order today, eat today.",
    state: "Enugu",
    city: "Enugu",
    whatsapp_number: "2348167099131",
    paystack_subaccount_code: null,
    logo_url: pic("nwanyi-logo", 200, 200),
    created_at: "2026-11-05T09:00:00Z",
    is_demo: true,
  },
  {
    id: "demo-shop-6",
    owner_id: null,
    name: "PH Beauty Store",
    slug: "ph-beauty-store",
    description:
      "Skincare, hair and cosmetics for every skin tone, with honest advice on what actually works.",
    state: "Rivers",
    city: "Port Harcourt",
    whatsapp_number: "2348167099131",
    paystack_subaccount_code: null,
    logo_url: pic("ph-beauty-logo", 200, 200),
    created_at: "2026-11-06T09:00:00Z",
    is_demo: true,
  },
];

export const DEMO_PRODUCTS: Product[] = [
  // Adaeze Fashion Hub (Lagos)
  { id: "demo-p1", shop_id: "demo-shop-1", name: "Ankara Midi Dress", description: "Flared midi dress in bold Ankara print. Sizes S–XL.", price_kobo: 2500000, stock: 12, image_url: pic("ankara-dress"), category: "Fashion", created_at: "2026-11-01T09:00:00Z" },
  { id: "demo-p2", shop_id: "demo-shop-1", name: "Two-Piece Ankara Set", description: "Matching top and wide-leg trousers, comfortable all-day fit.", price_kobo: 3200000, stock: 8, image_url: pic("ankara-set"), category: "Fashion", created_at: "2026-11-01T09:00:00Z" },
  { id: "demo-p3", shop_id: "demo-shop-1", name: "Aso-Oke Gown", description: "Elegant Aso-Oke gown for weddings and owambe weekends.", price_kobo: 4500000, stock: 5, image_url: pic("aso-oke-gown"), category: "Fashion", created_at: "2026-11-01T09:00:00Z" },
  // Lekki Gadgets (Lagos)
  { id: "demo-p4", shop_id: "demo-shop-2", name: "Wireless Earbuds Pro", description: "Noise-cancelling earbuds, 24-hour battery with case.", price_kobo: 1850000, stock: 25, image_url: pic("earbuds"), category: "Electronics", created_at: "2026-11-02T09:00:00Z" },
  { id: "demo-p5", shop_id: "demo-shop-2", name: "20,000mAh Power Bank", description: "Fast-charging power bank with two USB ports and Type-C.", price_kobo: 1500000, stock: 30, image_url: pic("powerbank"), category: "Electronics", created_at: "2026-11-02T09:00:00Z" },
  { id: "demo-p6", shop_id: "demo-shop-2", name: "Smart Watch Fit", description: "Fitness tracking, heart-rate monitor and 7-day battery.", price_kobo: 2200000, stock: 15, image_url: pic("smartwatch"), category: "Electronics", created_at: "2026-11-02T09:00:00Z" },
  // Zuma Agro Mart (Abuja)
  { id: "demo-p7", shop_id: "demo-shop-3", name: "Bag of Yams (10 tubers)", description: "Fresh white yams, medium size, straight from the farm.", price_kobo: 1200000, stock: 40, image_url: pic("yams"), category: "Foodstuff", created_at: "2026-11-03T09:00:00Z" },
  { id: "demo-p8", shop_id: "demo-shop-3", name: "50kg Bag of Rice", description: "Clean long-grain rice, stone-free and ready to cook.", price_kobo: 4800000, stock: 20, image_url: pic("rice-bag"), category: "Foodstuff", created_at: "2026-11-03T09:00:00Z" },
  { id: "demo-p9", shop_id: "demo-shop-3", name: "Fresh Tomatoes Basket", description: "A full basket of firm, ripe tomatoes. Same-day harvest.", price_kobo: 800000, stock: 18, image_url: pic("tomatoes"), category: "Foodstuff", created_at: "2026-11-03T09:00:00Z" },
  // Kano Leather Works (Kano)
  { id: "demo-p10", shop_id: "demo-shop-4", name: "Handmade Leather Bag", description: "Full-grain leather tote, hand-stitched in Kano.", price_kobo: 3800000, stock: 7, image_url: pic("leather-bag"), category: "Fashion", created_at: "2026-11-04T09:00:00Z" },
  { id: "demo-p11", shop_id: "demo-shop-4", name: "Leather Sandals", description: "Comfortable handcrafted sandals with cushioned sole.", price_kobo: 1450000, stock: 20, image_url: pic("leather-sandals"), category: "Fashion", created_at: "2026-11-04T09:00:00Z" },
  { id: "demo-p12", shop_id: "demo-shop-4", name: "Leather Wallet", description: "Slim bifold wallet in genuine leather, 6 card slots.", price_kobo: 950000, stock: 35, image_url: pic("leather-wallet"), category: "Fashion", created_at: "2026-11-04T09:00:00Z" },
  // Nwanyi Kitchen (Enugu)
  { id: "demo-p13", shop_id: "demo-shop-5", name: "Ofe Nsala (2L)", description: "White soup with catfish and utazi. Cooked fresh to order.", price_kobo: 650000, stock: 10, image_url: pic("ofe-nsala"), category: "Food", created_at: "2026-11-05T09:00:00Z" },
  { id: "demo-p14", shop_id: "demo-shop-5", name: "Abacha (African Salad)", description: "Abacha with ugba, garden egg and palm oil. 1.5L pack.", price_kobo: 400000, stock: 14, image_url: pic("abacha"), category: "Food", created_at: "2026-11-05T09:00:00Z" },
  { id: "demo-p15", shop_id: "demo-shop-5", name: "Party Pack (Feeds 10)", description: "Jollof rice, chicken, salad and drinks for small gatherings.", price_kobo: 5500000, stock: 6, image_url: pic("party-pack"), category: "Food", created_at: "2026-11-05T09:00:00Z" },
  // PH Beauty Store (Rivers)
  { id: "demo-p16", shop_id: "demo-shop-6", name: "Glow Body Lotion 500ml", description: "Shea-butter body lotion for soft, even-toned skin.", price_kobo: 1200000, stock: 22, image_url: pic("body-lotion"), category: "Beauty", created_at: "2026-11-06T09:00:00Z" },
  { id: "demo-p17", shop_id: "demo-shop-6", name: "Human Hair Wig 18\"", description: "Virgin human hair wig, straight, with free cap.", price_kobo: 8500000, stock: 4, image_url: pic("hair-wig"), category: "Beauty", created_at: "2026-11-06T09:00:00Z" },
  { id: "demo-p18", shop_id: "demo-shop-6", name: "Vitamin C Serum 30ml", description: "Brightening face serum for a clear, even glow.", price_kobo: 980000, stock: 28, image_url: pic("vitamin-c"), category: "Beauty", created_at: "2026-11-06T09:00:00Z" },
];
