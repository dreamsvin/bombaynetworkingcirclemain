"use server";

import { headers } from "next/headers";
import { accessRequestSchema, inquirySchema, subscribeSchema, flatten, type FormState } from "@/lib/schemas";
import { serviceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { CONTACT, SITE } from "@/content/site";
import { sendConfirmation } from "@/lib/mail";
import { appendRow, nowIST } from "@/lib/sheets";

const MIN_FILL_MS = 2500; // humans take longer than this to fill a form

async function clientKey(prefix: string) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}

const unavailable: FormState = {
  status: "error",
  message: `The form isn't connected yet. Please email ${CONTACT.email} and we'll reply directly.`,
};

const fields = (fd: FormData) => Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string"));

/** Contact, sponsor, start-a-chapter, partner and speak/host forms all land in `inquiries`, discriminated by type. */
export async function submitInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = inquirySchema.safeParse(fields(fd));
  if (!parsed.success) return { status: "error", message: "Check the highlighted fields.", errors: flatten(parsed.error) };
  const v = parsed.data;

  // Bots: honeypot filled or impossibly fast. Pretend success so they don't retry.
  if (v.website || Date.now() - v.startedAt < MIN_FILL_MS) return { status: "ok", message: "Thanks — we've got it." };

  const rl = await rateLimit(await clientKey("inquiry"));
  if (!rl.ok) return { status: "error", message: "Too many submissions from this connection. Try again in a few minutes." };

  const sheetOk = await appendRow("Inquiries", {
    "Submitted at": nowIST(),
    Type: v.type,
    Name: v.name,
    Email: v.email,
    Phone: v.phone ?? "",
    City: v.city ?? "",
    Organisation: v.organisation ?? "",
    Message: v.message,
    Page: v.sourcePath ?? "",
  });
  const thanks: FormState = { status: "ok", message: `Thanks, ${v.name.split(" ")[0]}. ${CONTACT.responseTime}` };

  const db = serviceClient();
  if (!db) return sheetOk ? thanks : unavailable;

  const { error } = await db.from("inquiries").insert({
    type: v.type,
    name: v.name,
    email: v.email,
    phone: v.phone ?? null,
    city: v.city ?? null,
    organisation: v.organisation ?? null,
    message: v.message,
    source_path: v.sourcePath ?? null,
  });
  if (error) {
    console.error("inquiry insert failed", error.code);
    if (sheetOk) return thanks;
    return { status: "error", message: `Something went wrong on our side. Please email ${CONTACT.email}.` };
  }
  return thanks;
}

/**
 * Newsletter + RSVP-intent capture. Double opt-in: the row is stored unconfirmed and a confirmation link is
 * emailed (when an email provider is configured). For RSVP intent, the response carries the Luma URL so the
 * client can continue to RSVP straight away.
 */
export async function subscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(fields(fd));
  if (!parsed.success) return { status: "error", message: "Check the highlighted fields.", errors: flatten(parsed.error) };
  const v = parsed.data;
  const rsvpUrl = typeof fd.get("rsvpUrl") === "string" && /^https:\/\/(lu\.ma|luma\.com)\//.test(String(fd.get("rsvpUrl"))) ? String(fd.get("rsvpUrl")) : undefined;

  if (v.website || Date.now() - v.startedAt < 1200) return { status: "ok", message: "Check your inbox to confirm.", redirect: rsvpUrl };

  const rl = await rateLimit(await clientKey("subscribe"));
  if (!rl.ok) return { status: "error", message: "Too many attempts from this connection. Try again in a few minutes." };

  const sheetOk = await appendRow("Subscribers", { "Subscribed at": nowIST(), Email: v.email, City: v.city ?? "", Source: v.source });

  const db = serviceClient();
  if (!db) {
    if (rsvpUrl) return { status: "ok", message: "Continue to Luma to RSVP.", redirect: rsvpUrl };
    return sheetOk ? { status: "ok", message: "You're on the list. We'll write when your city has a date." } : unavailable;
  }

  const { data, error } = await db
    .from("subscribers")
    .upsert({ email: v.email, city: v.city ?? null, source: v.source }, { onConflict: "email", ignoreDuplicates: true })
    .select("confirm_token, confirmed_at")
    .maybeSingle();
  if (error) {
    console.error("subscribe failed", error.code);
    return rsvpUrl ? { status: "ok", message: "Continue to Luma to RSVP.", redirect: rsvpUrl } : { status: "error", message: `Something went wrong. Please email ${CONTACT.email}.` };
  }
  if (data && !data.confirmed_at) await sendConfirmation(v.email, `${SITE.url}/api/subscribe/confirm?token=${data.confirm_token}`).catch(() => {});

  return {
    status: "ok",
    message: rsvpUrl ? "Saved. Opening Luma to finish your RSVP." : "Almost done — check your inbox for a confirmation link.",
    redirect: rsvpUrl,
  };
}

/**
 * Request access. Written to the Google Sheet (the team's working copy) and, when configured, the private
 * access_requests table (service role only). Returns the first name for the confirmation screen.
 */
export async function requestAccess(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = accessRequestSchema.safeParse(fields(fd));
  if (!parsed.success) return { status: "error", message: "Check the highlighted fields.", errors: flatten(parsed.error) };
  const v = parsed.data;
  const ok: FormState = { status: "ok", message: v.name.split(" ")[0] };

  if (v.hp || Date.now() - v.startedAt < MIN_FILL_MS) return ok;

  const rl = await rateLimit(await clientKey("access"));
  if (!rl.ok) return { status: "error", message: "Too many submissions from this connection. Try again in a few minutes." };

  const sheetOk = await appendRow("Access Requests", {
    "Submitted at": nowIST(),
    Name: v.name,
    Email: v.email,
    LinkedIn: v.linkedin,
    City: v.city,
    "Company / profession": v.company,
    "What they're building": v.building,
    "Hoping to explore": v.explore,
    Industry: v.industry ?? "",
    Website: v.website ?? "",
    "Heard from": v.heardFrom ?? "",
    Status: "New",
  });

  const db = serviceClient();
  if (!db) return sheetOk ? ok : unavailable;

  const { error } = await db.from("access_requests").insert({
    name: v.name,
    email: v.email,
    phone: null,
    city: v.city,
    role: v.company,
    company: v.company,
    industry: v.industry ?? null,
    linkedin: v.linkedin,
    building: `${v.building}\n\nHoping to explore: ${v.explore}${v.website ? `\nWebsite: ${v.website}` : ""}`,
    looking_for: [],
    heard_from: v.heardFrom ?? null,
    // The form states that requesting access means agreeing to the house rules.
    charter_agreed_at: new Date().toISOString(),
    source_path: v.sourcePath ?? null,
  });
  if (error) {
    // The sheet is the team's working copy; if it got the row, the request isn't lost.
    console.error("access request insert failed", error.code);
    if (sheetOk) return ok;
    return { status: "error", message: `Something went wrong on our side. Please email ${CONTACT.email}.` };
  }
  return ok;
}
