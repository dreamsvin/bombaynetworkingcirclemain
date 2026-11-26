import "server-only";

/**
 * Google Sheets backend. Form submissions are POSTed to a Google Apps Script web app bound to the
 * "BNC – Access Requests" spreadsheet (script: scripts/google-sheets-webhook.gs). The script appends one row per
 * submission to the named tab, matching columns by header name.
 *
 * Env (Vercel → Project → Settings → Environment Variables):
 *   SHEETS_WEBHOOK_URL     the web app URL ending in /exec
 *   SHEETS_WEBHOOK_SECRET  the same random string set as SECRET in the script
 */
const URL_ = process.env.SHEETS_WEBHOOK_URL ?? "";
const SECRET = process.env.SHEETS_WEBHOOK_SECRET ?? "";

export const HAS_SHEETS = Boolean(URL_ && SECRET);

export type SheetTab = "Access Requests" | "Subscribers" | "Inquiries";

/** Appends a row. Returns true only when the script confirms the write. Never throws. */
export async function appendRow(tab: SheetTab, row: Record<string, string>): Promise<boolean> {
  if (!HAS_SHEETS) return false;
  try {
    const res = await fetch(URL_, {
      method: "POST",
      // text/plain avoids a CORS preflight and is what Apps Script reads most reliably from e.postData.contents.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret: SECRET, tab, row }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("sheets append failed", res.status);
      return false;
    }
    const out = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!out?.ok) console.error("sheets append rejected", out?.error ?? "no body");
    return Boolean(out?.ok);
  } catch (e) {
    console.error("sheets append error", e instanceof Error ? e.name : "unknown");
    return false;
  }
}

/** Sheet timestamps in India time, readable by a person. */
export const nowIST = () =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }).format(new Date());
