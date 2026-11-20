"use client";
import { track as vercelTrack } from "@vercel/analytics";

/** Funnel events. Names are stable — dashboards depend on them. */
export type FunnelEvent =
  | "cta_click" // primary CTA anywhere
  | "city_select" // picked a chapter in the directory or map
  | "rsvp_click" // click-out to Luma
  | "whatsapp_click" // click-out to the WhatsApp community (step 4)
  | "form_submit"; // any inquiry / newsletter / RSVP-intent form that succeeded

export function track(event: FunnelEvent, props: Record<string, string | number | boolean | null> = {}) {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics must never break navigation */
  }
}
