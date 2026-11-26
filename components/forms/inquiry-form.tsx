"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { submitInquiry } from "@/app/actions";
import { initialFormState } from "@/lib/schemas";
import { TextField, TextArea, Checkbox, SelectField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import Link from "next/link";

type Kind = "contact" | "sponsor" | "start_chapter" | "partner";

const COPY: Record<Kind, { message: string; messageHint: string; submit: string }> = {
  contact: { message: "How can we help?", messageHint: "Questions, press, speaking or hosting — say which.", submit: "Send message" },
  sponsor: { message: "What would you like to sponsor?", messageHint: "Event sponsorship, community sponsorship or a brand activation — and a rough budget, if you have one.", submit: "Send sponsorship enquiry" },
  start_chapter: { message: "Why you, why this city?", messageHint: "Your work, your network in the city, and how much time you can give each month.", submit: "Apply to start a chapter" },
  partner: { message: "What would the partnership look like?", messageHint: "Tools, credits, venues, or content for members.", submit: "Send partnership enquiry" },
};

/** One form component for every `inquiries` type. Server action does the real validation. */
export function InquiryForm({ kind, cities = [] }: { kind: Kind; cities?: string[] }) {
  const [state, action, pending] = useActionState(submitInquiry, initialFormState);
  const mountedAt = useRef(0);
  const path = usePathname();
  const [topic, setTopic] = useState<"contact" | "speak">("contact");
  const c = COPY[kind];
  const e = state.errors ?? {};

  // Time-trap for bots: stamped on mount, sent with the submission.
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  /**
   * Submit through the action dispatcher instead of <form action>, so React does not reset the form:
   * people keep what they typed when a field needs fixing.
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("startedAt", String(mountedAt.current || Date.now()));
    startTransition(() => action(fd));
  };
  useEffect(() => {
    if (state.status === "ok") track("form_submit", { form: kind });
  }, [state, kind]);

  if (state.status === "ok") {
    return (
      <div role="status" className="border-2 border-line-strong bg-bg-card p-6 sm:p-8">
        <h3 className="text-heading-sm text-fg">Received.</h3>
        <p className="mt-2 text-body text-fg-muted">{state.message}</p>
        <p className="mt-4 text-body-sm">
          <Link href="/rooms" className="font-semibold text-accent-text underline underline-offset-4">
            See upcoming rooms
          </Link>
        </p>
      </div>
    );
  }

  const type = kind === "contact" ? topic : kind;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 border-2 border-line-strong bg-bg-card p-6 sm:grid-cols-2 sm:p-8">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="sourcePath" value={path} />
      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`website-${kind}`}>Website</label>
        <input id={`website-${kind}`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {kind === "contact" && (
        <SelectField
          className="sm:col-span-2"
          label="Topic"
          name="topic"
          value={topic}
          onChange={(ev) => setTopic(ev.target.value as "contact" | "speak")}
          options={[
            { value: "contact", label: "General question" },
            { value: "speak", label: "Speak at or host a room" },
          ]}
        />
      )}
      <TextField label="Name" name="name" autoComplete="name" error={e.name} maxLength={80} />
      <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" error={e.email} />
      {(kind === "sponsor" || kind === "partner") && (
        <TextField label="Organisation" name="organisation" autoComplete="organization" error={e.organisation} maxLength={120} />
      )}
      {kind === "start_chapter" ? (
        <TextField label="City you'd lead" name="city" autoComplete="address-level2" error={e.city} hint={cities.length ? `Existing chapters: ${cities.join(", ")}.` : undefined} />
      ) : (
        <TextField label="City" name="city" autoComplete="address-level2" error={e.city} optional />
      )}
      <TextField label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" error={e.phone} optional hint="Only if you'd like a call back." />
      <TextArea className="sm:col-span-2" label={c.message} name="message" error={e.message} hint={c.messageHint} maxLength={2000} />
      <div className="sm:col-span-2">
        <Checkbox
          name="consent"
          error={e.consent}
          label={
            <>
              BNC may store these details to reply to me, as described in the{" "}
              <Link href="/privacy" className="text-accent-text underline underline-offset-4">
                privacy policy
              </Link>
              .
            </>
          }
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Sending…" : c.submit}
        </Button>
        <p aria-live="polite" className={state.status === "error" ? "text-body-sm font-semibold text-danger" : "sr-only"}>
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
