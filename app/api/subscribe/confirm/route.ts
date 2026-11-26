import { NextResponse, type NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/server";

/** Double opt-in confirmation. GET /api/subscribe/confirm?token=<uuid> */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const ok = /^[0-9a-f-]{36}$/i.test(token);
  const db = serviceClient();
  if (ok && db) {
    await db.from("subscribers").update({ confirmed_at: new Date().toISOString() }).eq("confirm_token", token).is("confirmed_at", null);
  }
  return NextResponse.redirect(new URL(ok ? "/?subscribed=1" : "/", req.url), 303);
}
