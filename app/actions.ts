"use server";

import { headers } from "next/headers";
import { inquirySchema, subscribeSchema, flatten, type FormState } from "@/lib/schemas";
import { serviceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { CONTACT, SITE } from "@/content/site";
import { sendConfirmation } from "@/lib/mail";

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

  const db = serviceClient();
  if (!db) return unavailable;

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
    return { status: "error", message: `Something went wrong on our side. Please email ${CONTACT.email}.` };
  }
  return { status: "ok", message: `Thanks, ${v.name.split(" ")[0]}. ${CONTACT.responseTime}` };
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

  const db = serviceClient();
  if (!db) return rsvpUrl ? { status: "ok", message: "Continue to Luma to RSVP.", redirect: rsvpUrl } : unavailable;

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

