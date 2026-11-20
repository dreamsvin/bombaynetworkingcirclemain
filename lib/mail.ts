import "server-only";
import { SITE } from "@/content/site";

/**
 * Double opt-in email via Resend's HTTP API. No-op until RESEND_API_KEY and MAIL_FROM are set
 * (rows stay unconfirmed — see CONTENT-TODO.md / docs/DEPLOY.md).
 */
export async function sendConfirmation(to: string, link: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: `Confirm your ${SITE.name} updates`,
      text: `Confirm you want event updates from ${SITE.name}:\n\n${link}\n\nIf you didn't ask for this, ignore this email and nothing happens.`,
    }),
    signal: AbortSignal.timeout(8000),
  });
}
