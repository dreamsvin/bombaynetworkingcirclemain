"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { requestAccess } from "@/app/actions";
import { initialFormState, type FieldErrors } from "@/lib/schemas";
import { CHARTER, HEARD_FROM, INDUSTRIES, LINKS, LOOKING_FOR, NEXT_STEPS, ROLES } from "@/content/site";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Values = {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  company: string;
  industry: string;
  linkedin: string;
  building: string;
  lookingFor: string[];
  heardFrom: string;
  charter: boolean;
};
type Key = keyof Values;

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  city: "",
  role: "",
  company: "",
  industry: "",
  linkedin: "",
  building: "",
  lookingFor: [],
  heardFrom: "",
  charter: false,
};

const STEPS: { title: string; fields: Key[] }[] = [
  { title: "About you", fields: ["name", "email", "phone", "city"] },
  { title: "What you're building", fields: ["role", "company", "industry", "linkedin", "building", "lookingFor"] },
  { title: "The Charter", fields: ["heardFrom", "charter"] },
];

const DRAFT_KEY = "bnc:request-access:v1";

/** Client mirror of accessRequestSchema. The server is the authority; this gives errors on blur. */
function validate(k: Key, v: Values): string | undefined {
  const s = (x: string) => x.trim();
  switch (k) {
    case "name":
      return s(v.name).length < 2 ? "Your name, please." : undefined;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s(v.email)) ? undefined : "That email doesn't look complete.";
    case "phone":
      return !s(v.phone) || /^\+?\d{10,15}$/.test(v.phone.replace(/[^\d+]/g, "")) ? undefined : "Use 10–15 digits, country code optional.";
    case "city":
      return s(v.city).length < 2 ? "Which city are you in?" : undefined;
    case "role":
      return v.role ? undefined : "Pick the role closest to yours.";
    case "linkedin":
      return !s(v.linkedin) || /^https:\/\/(www\.|[a-z]{2}\.)?linkedin\.com\//.test(s(v.linkedin)) ? undefined : "Paste the full LinkedIn URL, starting with https://";
    case "building":
      return s(v.building).length < 10 ? "A sentence about what you're building — 10 characters minimum." : undefined;
    case "lookingFor":
      return v.lookingFor.length ? undefined : "Pick at least one.";
    case "charter":
      return v.charter ? undefined : "Agree to the Charter to send your request.";
    default:
      return undefined;
  }
}

const control =
  "block w-full min-h-11 border-2 border-line-control bg-bg-card px-3 py-2 text-body text-fg placeholder:text-fg-subtle aria-[invalid=true]:border-danger";

export function RequestAccessForm({ cities, initialCity }: { cities: string[]; initialCity?: string }) {
  const [state, action, pending] = useActionState(requestAccess, initialFormState);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(() => ({ ...EMPTY, city: initialCity ?? "" }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [restored, setRestored] = useState(false);
  const mountedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Restore a local draft (this browser only), then keep it updated. Cleared on success.
  useEffect(() => {
    mountedAt.current = Date.now();
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<Values> & { step?: number };
        setValues((v) => ({ ...v, ...draft, city: initialCity || draft.city || v.city, charter: false }));
        setRestored(true);
      }
    } catch {
      /* storage unavailable: no draft */
    }
  }, [initialCity]);

  useEffect(() => {
    try {
      const { charter: _c, ...rest } = values;
      void _c;
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }, [values]);

  // Server errors: jump to the step holding the first one.
  useEffect(() => {
    if (state.status === "error" && state.errors) {
      const first = STEPS.findIndex((s) => s.fields.some((f) => state.errors?.[f]));
      setErrors(state.errors);
      if (first >= 0) setStep(first);
    }
    if (state.status === "ok") {
      track("form_submit", { form: "request_access", city: values.city });
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      window.scrollTo({ top: 0 });
      headingRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const set = <K extends Key>(k: K, v: Values[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: validate(k, { ...values, [k]: v }) }));
  };
  const blur = (k: Key) => setErrors((e) => ({ ...e, [k]: validate(k, values) }));

  /** Validate a step; on failure, show every error and move focus to the first. */
  const check = (i: number) => {
    const found: FieldErrors = {};
    for (const f of STEPS[i].fields) {
      const msg = validate(f, values);
      if (msg) found[f] = msg;
    }
    setErrors((e) => ({ ...e, ...Object.fromEntries(STEPS[i].fields.map((f) => [f, found[f]])) }));
    const first = STEPS[i].fields.find((f) => found[f]);
    if (first) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus());
      return false;
    }
    return true;
  };

  const next = () => {
    if (!check(step)) return;
    setStep((s) => s + 1);
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[data-step-title]")?.focus());
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    if (!check(step)) return;
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      if (k === "lookingFor") (v as string[]).forEach((x) => fd.append("lookingFor", x));
      else if (k === "charter") fd.set("charter", v ? "true" : "");
      else fd.set(k, String(v));
    }
    fd.set("website", (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "");
    fd.set("startedAt", String(mountedAt.current || Date.now()));
    fd.set("sourcePath", "/request-access");
    startTransition(() => action(fd));
  };

  if (state.status === "ok") {
    const first = state.message ?? values.name.split(" ")[0];
    return (
      <div data-tone="brown" className="border-2 border-line-strong p-6 sm:p-10">
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-display-md text-fg outline-none">
          Thanks, {first}. Here&rsquo;s what happens next.
        </h2>
        <ol className="mt-8 border-t-2 border-line-strong">
          {NEXT_STEPS.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3rem_1fr] border-b-2 border-line-strong py-5">
              <span className="font-mono text-label text-brand-text">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-heading-sm font-bold text-fg">{i === 1 ? `You're matched to a room in ${values.city}` : s.title}</p>
                <p className="mt-1 text-body-sm text-fg-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { placement: "request-access-success" })}
            className={buttonClass("secondary", "lg")}
          >
            Join the WhatsApp community<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href={`/members?city=${encodeURIComponent(values.city)}`} className="inline-flex min-h-11 items-center font-bold text-fg underline underline-offset-4">
            See who&rsquo;s in {values.city} →
          </Link>
        </div>
      </div>
    );
  }

  const err = (k: Key) => errors[k];
  const field = (k: Key) => ({
    id: `ra-${k}`,
    "data-field": k,
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": err(k) ? `ra-${k}-error` : undefined,
    onBlur: () => blur(k),
  });
  const label = (k: Key, text: string, optional = false) => (
    <label htmlFor={`ra-${k}`} className="mb-1.5 block text-body-sm font-bold text-fg">
      {text} {optional && <span className="font-regular text-fg-subtle">(optional)</span>}
    </label>
  );
  const errorFor = (k: Key) =>
    err(k) ? (
      <p id={`ra-${k}-error`} className="mt-1.5 text-caption font-semibold text-danger">
        {err(k)}
      </p>
    ) : null;

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="border-2 border-line-strong bg-bg-card p-5 sm:p-8" aria-describedby="ra-progress-label">
      <div>
        <p id="ra-progress-label" className="font-mono text-label uppercase text-brand-text">
          Step {step + 1} of {STEPS.length} · {STEPS[step].title}
        </p>
        <div className="mt-3 h-2 border-2 border-line-strong" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Progress">
          <div className="h-full bg-accent transition-[width] duration-base" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {restored && step === 0 && <p className="mt-4 text-caption text-fg-subtle">We restored what you typed last time on this device.</p>}

      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend data-step-title tabIndex={-1} className="font-display text-heading-lg text-fg outline-none">
          {STEPS[step].title}
        </legend>

        {step === 0 && (
          <div className="mt-6 grid gap-5">
            <div>
              {label("name", "Full name")}
              <input {...field("name")} className={control} autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} />
              {errorFor("name")}
            </div>
            <div>
              {label("email", "Email")}
              <input {...field("email")} type="email" inputMode="email" className={control} autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
              {errorFor("email")}
            </div>
            <div>
              {label("phone", "Phone", true)}
              <input {...field("phone")} type="tel" inputMode="tel" className={control} autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
              {errorFor("phone")}
            </div>
            <div>
              {label("city", "City")}
              <input {...field("city")} list="ra-cities" className={control} autoComplete="address-level2" value={values.city} onChange={(e) => set("city", e.target.value)} />
              <datalist id="ra-cities">
                {cities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <p className="mt-1.5 text-caption text-fg-subtle">No chapter in your city yet? Tell us anyway — it decides where we open next.</p>
              {errorFor("city")}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                {label("role", "Role")}
                <select {...field("role")} className={control} value={values.role} onChange={(e) => set("role", e.target.value)}>
                  <option value="">Choose…</option>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                {errorFor("role")}
              </div>
              <div>
                {label("company", "Company", true)}
                <input {...field("company")} className={control} autoComplete="organization" value={values.company} onChange={(e) => set("company", e.target.value)} />
              </div>
              <div>
                {label("industry", "Industry", true)}
                <select {...field("industry")} className={control} value={values.industry} onChange={(e) => set("industry", e.target.value)}>
                  <option value="">Choose…</option>
                  {INDUSTRIES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                {label("linkedin", "LinkedIn", true)}
                <input {...field("linkedin")} type="url" inputMode="url" placeholder="https://www.linkedin.com/in/…" className={control} value={values.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
                {errorFor("linkedin")}
              </div>
            </div>
            <div>
              {label("building", "What are you building?")}
              <textarea {...field("building")} rows={4} maxLength={600} className={cn(control, "min-h-28")} value={values.building} onChange={(e) => set("building", e.target.value)} />
              {errorFor("building")}
            </div>
            <fieldset aria-describedby={err("lookingFor") ? "ra-lookingFor-error" : undefined}>
              <legend className="mb-2 text-body-sm font-bold text-fg">What are you looking for?</legend>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR.map((l, i) => {
                  const on = values.lookingFor.includes(l.value);
                  return (
                    <label
                      key={l.value}
                      className={cn(
                        "inline-flex min-h-11 cursor-pointer items-center border-2 px-3 font-mono text-label uppercase has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
                        on ? "border-accent bg-accent text-on-accent" : "border-line-strong text-fg",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        data-field={i === 0 ? "lookingFor" : undefined}
                        checked={on}
                        onChange={() => set("lookingFor", on ? values.lookingFor.filter((x) => x !== l.value) : [...values.lookingFor, l.value])}
                      />
                      {l.label}
                    </label>
                  );
                })}
              </div>
              {errorFor("lookingFor")}
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 grid gap-5">
            <div>
              {label("heardFrom", "How did you hear about BNC?", true)}
              <select {...field("heardFrom")} className={control} value={values.heardFrom} onChange={(e) => set("heardFrom", e.target.value)}>
                <option value="">Choose…</option>
                {HEARD_FROM.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div data-tone="sand" className="border-2 border-line-strong p-5">
              <p className="font-mono text-label uppercase text-brand-text">The BNC Charter</p>
              <ol className="mt-3 space-y-2 text-body-sm">
                {CHARTER.map((c) => (
                  <li key={c.title}>
                    <strong className="text-fg">{c.title}</strong> <span className="text-fg-muted">{c.body}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 text-body font-bold text-fg">
                <input
                  {...field("charter")}
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]"
                  checked={values.charter}
                  onChange={(e) => set("charter", e.target.checked)}
                />
                I agree to the BNC Charter
              </label>
              {errorFor("charter")}
            </div>
          </div>
        )}
      </fieldset>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-6 border-2 border-danger p-3 text-body-sm font-semibold text-danger">
          {state.message}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className={buttonClass("ghost")}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" disabled={pending} aria-disabled={pending} className={buttonClass("primary", "lg")}>
          {pending ? "Sending…" : step < STEPS.length - 1 ? "Next" : "Request access"}
          {!pending && <span aria-hidden="true">→</span>}
        </button>
      </div>
    </form>
  );
}
