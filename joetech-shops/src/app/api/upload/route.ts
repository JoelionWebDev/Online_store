import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAnonServer, supabaseServer } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const BUCKET = "product-images";

/**
 * POST /api/upload — multipart form: { file, shopId }
 *
 * SECURITY:
 * - Requires a logged-in user (Bearer access token verified with Supabase).
 * - The shop must belong to that user (owner_id = auth user id).
 * - Only JPEG/PNG/WebP, max 5 MB.
 * - Files are renamed to a UUID filename — the original name is never used
 *   (no path tricks, no overwrites).
 * - Stored in the Supabase Storage bucket "product-images" (CDN), never on
 *   Vercel. Returns the public URL.
 */
export async function POST(req: NextRequest) {
  try {
    const anon = supabaseAnonServer();
    const server = supabaseServer();
    if (!anon || !server) {
      return NextResponse.json({ error: "Upload is not configured yet." }, { status: 503 });
    }

    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "You must be logged in to upload." }, { status: 401 });
    }
    const { data: userData, error: userError } = await anon.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Invalid login session." }, { status: 401 });
    }
    const userId = userData.user.id;

    const form = await req.formData();
    const file = form.get("file");
    const shopId = String(form.get("shopId") ?? "");
    if (!(file instanceof File) || !shopId) {
      return NextResponse.json({ error: "No file or shop given." }, { status: 400 });
    }

    // Ownership check: the shop must belong to the logged-in user.
    const { data: shop, error: shopError } = await server
      .from("shops")
      .select("id, owner_id")
      .eq("id", shopId)
      .maybeSingle();
    if (shopError) throw new Error(shopError.message);
    if (!shop || shop.owner_id !== userId) {
      return NextResponse.json({ error: "You do not own this shop." }, { status: 403 });
    }

    // Type + size validation.
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG and WebP images are allowed." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${shopId}/${randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await server.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicData } = server.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: publicData.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 },
    );
  }
}
