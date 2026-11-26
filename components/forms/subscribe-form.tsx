"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { subscribe } from "@/app/actions";
import { initialFormState } from "@/lib/schemas";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Email capture. Variants:
 *  - "newsletter": footer / blog. Double opt-in.
 *  - "rsvp": event pages. Captures the email, then continues to Luma (the RSVP system). Skippable.
 *  - "city": a city with no upcoming event. "Tell me when <city> has a date."
 */
export function SubscribeForm({
  variant = "newsletter",
  source = "footer",
  rsvpUrl,
  city,
  label,
  submitLabel,
  className,
  id = "subscribe",
}: {
  variant?: "newsletter" | "rsvp" | "city";
  source?: string;
  rsvpUrl?: string;
  city?: string;
  label?: string;
  submitLabel?: string;
  className?: string;
  id?: string;
}) {
  const [state, action, pending] = useActionState(subscribe, initialFormState);
  const mountedAt = useRef(0);
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
    if (state.status !== "ok") return;
    track("form_submit", { form: variant, source });
    if (state.redirect) {
      track("rsvp_click", { source, via: "form" });
      window.location.assign(state.redirect);
    }
  }, [state, variant, source]);

  const err = state.errors?.email;
  const inputId = `${id}-email`;

  if (state.status === "ok" && !state.redirect) {
    return (
      <p role="status" className={cn("text-body-sm text-fg", className)}>
        {state.message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <input type="hidden" name="source" value={source} />
      {city && <input type="hidden" name="city" value={city} />}
      {rsvpUrl && <input type="hidden" name="rsvpUrl" value={rsvpUrl} />}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor={inputId} className="mb-1.5 block text-body-sm font-semibold text-fg">
        {label ?? "Email"}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${inputId}-error` : undefined}
          className="block min-h-11 w-full min-w-0 flex-1 border-2 border-line-control bg-bg-card px-4 text-body text-fg placeholder:text-fg-subtle"
        />
        <button type="submit" disabled={pending} className={buttonClass(variant === "newsletter" ? "secondary" : "primary")}>
          {pending ? "Saving…" : (submitLabel ?? (variant === "rsvp" ? "RSVP on Luma" : variant === "city" ? "Notify me" : "Subscribe"))}
        </button>
      </div>
      <p aria-live="polite" id={`${inputId}-error`} className={err || state.status === "error" ? "mt-2 text-caption font-semibold text-danger" : "sr-only"}>
        {err ?? (state.status === "error" ? state.message : "")}
      </p>
    </form>
  );
}
