import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/** On-demand ISR after editing Supabase rows. POST /api/revalidate with header x-revalidate-secret. */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag("content", "max");
  return NextResponse.json({ ok: true });
}
