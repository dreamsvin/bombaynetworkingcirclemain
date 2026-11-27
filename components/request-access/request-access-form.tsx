"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { requestAccess } from "@/app/actions";
import { initialFormState, type FieldErrors } from "@/lib/schemas";
import { HEARD_FROM, INDUSTRIES, LINKS } from "@/content/site";
import { track } from "@/lib/analytics";

type Values = {
  name: string;
  email: string;
  linkedin: string;
  city: string;
  company: string;
  building: string;
  explore: string;
  industry: string;
  website: string;
  heardFrom: string;
};
type Key = keyof Values;

const EMPTY: Values = { name: "", email: "", linkedin: "", city: "", company: "", building: "", explore: "", industry: "", website: "", heardFrom: "" };

/** Two short steps. It should feel like the beginning of a relationship, not a job application. */
const STEPS: { title: string; sub: string; fields: Key[] }[] = [
  { title: "About you", sub: "The basics, so we know who we're talking to.", fields: ["name", "email", "linkedin", "city", "company"] },
  { title: "What you're working on", sub: "This is how we find the experiences that fit you.", fields: ["building", "explore", "industry", "website", "heardFrom"] },
];

const DRAFT_KEY = "bnc:request-access:v2";

const LABELS: Partial<Record<Key, string>> = {
  name: "Full name",
  email: "Email",
  linkedin: "LinkedIn profile",
  city: "City",
  company: "Company / profession",
  building: "What you're working on",
  explore: "What you'd like to explore",
  website: "Website",
};

/** Client mirror of accessRequestSchema. The server is the authority; this gives errors on blur. */
function validate(k: Key, v: Values): string | undefined {
  const s = (x: string) => x.trim();
  switch (k) {
    case "name":
      return s(v.name).length < 2 ? "Your name, please." : undefined;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s(v.email)) ? undefined : "That email doesn't look complete.";
    case "linkedin":
      return /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.+/i.test(s(v.linkedin)) ? undefined : "Paste your LinkedIn profile link, e.g. linkedin.com/in/yourname";
    case "city":
      return s(v.city).length < 2 ? "Which city are you in?" : undefined;
    case "company":
      return s(v.company).length < 2 ? "Where do you work, or what do you do?" : undefined;
    case "building":
      return s(v.building).length < 10 ? "A sentence about what you're working on — 10 characters minimum." : undefined;
    case "explore":
      return s(v.explore).length < 5 ? "A few words on what you'd like to explore." : undefined;
    case "website":
      return !s(v.website) || /^(https?:\/\/)?[^\s.]+\.[^\s]+$/i.test(s(v.website)) ? undefined : "That website address doesn't look complete.";
    default:
      return undefined;
  }
}

export function RequestAccessForm({ cities, initialCity }: { cities: string[]; initialCity?: string }) {
  const [summary, setSummary] = useState<Key[]>([]);
  const [state, action, pending] = useActionState(requestAccess, initialFormState);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(() => ({ ...EMPTY, city: initialCity ?? "" }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [restored, setRestored] = useState(false);
  const mountedAt = useRef(0);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Restore a local draft (this browser only), then keep it updated. Cleared on success.
  useEffect(() => {
    mountedAt.current = Date.now();
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<Values>;
        setValues((v) => ({ ...v, ...draft, city: initialCity || draft.city || v.city }));
        setRestored(true);
      }
    } catch {
      /* storage unavailable: no draft */
    }
  }, [initialCity]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
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

  const set = (k: Key, v: string) => {
    // Application start: tracked once, on the first keystroke.
    if (!started.current) {
      started.current = true;
      track("cta_click", { placement: "request-access-form-start" });
    }
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
    const bad = STEPS[i].fields.filter((f) => found[f]);
    setSummary(bad);
    if (bad.length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[data-field="${bad[0]}"]`)?.focus());
      return false;
    }
    return true;
  };

  const next = () => {
    if (!check(step)) return;
    setStep((s) => s + 1);
    setSummary([]);
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[data-step-title]")?.focus());
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    if (!check(step)) return;
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) fd.set(k, v);
    fd.set("hp", (e.currentTarget.elements.namedItem("hp") as HTMLInputElement | null)?.value ?? "");
    fd.set("startedAt", String(mountedAt.current || Date.now()));
    fd.set("sourcePath", "/request-access");
    startTransition(() => action(fd));
  };

  const done = state.status === "ok";
  const first = state.message ?? values.name.split(" ")[0];
  const err = (k: Key) => errors[k];
  const field = (k: Key) => ({
    id: `ra-${k}`,
    "data-field": k,
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": err(k) ? `ra-${k}-error` : undefined,
    onBlur: () => blur(k),
  });
  const label = (k: Key, text: string, optional = false) => (
    <label htmlFor={`ra-${k}`}>
      {text} {optional && <span className="hr-opt">(optional)</span>}
    </label>
  );
  const errorFor = (k: Key) =>
    err(k) ? (
      <p id={`ra-${k}-error`} className="hr-err">
        {err(k)}
      </p>
    ) : null;
  const shown = summary.filter((k) => errors[k]);

  return (
    <div className="hr-wrap hr-ra-grid">
      <aside className="hr-ra-side">
        <p className="hr-name">Request Access</p>
        <h1 id="ra-title" className="hr-d2">
          Find your place in the circle.
        </h1>
        <p className="hr-lede">Tell us a little about yourself, what you&rsquo;re building, and what you&rsquo;re looking to explore through BNC.</p>
        <ul className="hr-assure">
          <li>A few minutes, two short steps.</li>
          <li>A person on the BNC team reads every request.</li>
          <li>Nothing here is shown publicly or shared.</li>
          <li>Joining is free; experiences are paid and priced up front.</li>
        </ul>
      </aside>

      <div className="hr-ra-form" data-done={done}>
        {done ? (
          <div className="hr-success hr-dark">
            <h2 ref={headingRef} tabIndex={-1} className="hr-d2">
              Thank you for your interest in BNC, {first}.
            </h2>
            <p style={{ fontSize: "1.125rem", maxWidth: "34rem" }}>We&rsquo;ll review your details and share the next step by email.</p>
            <div className="hr-ctas">
              <Link href="/rooms" className="hr-btn hr-btn-quiet">
                Explore upcoming experiences
              </Link>
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { placement: "request-access-success" })} className="hr-link">
                Join the WhatsApp community<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        ) : (
          <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="ra-progress-label">
            <p id="ra-progress-label" className="hr-progress-label" aria-live="polite">
              Step {step + 1} of {STEPS.length} · {STEPS[step].title}
            </p>
            <div className="hr-bar" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Progress">
              <i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
            {restored && step === 0 && (
              <p className="hr-hint" style={{ marginBottom: 24 }}>
                We restored what you typed last time on this device.
              </p>
            )}

            {shown.length > 0 && (
              <div className="hr-error-summary" role="alert">
                {shown.length === 1 ? "One thing to fix:" : `${shown.length} things to fix:`}
                <ul>
                  {shown.map((k) => (
                    <li key={k}>
                      <a
                        href={`#ra-${k}`}
                        onClick={(e) => {
                          e.preventDefault();
                          formRef.current?.querySelector<HTMLElement>(`[data-field="${k}"]`)?.focus();
                        }}
                      >
                        {LABELS[k] ?? k}
                      </a>
                      : {errors[k]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* honeypot */}
            <div aria-hidden="true" className="sr-only">
              <label>
                Leave empty <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
              <legend data-step-title tabIndex={-1} className="hr-step-title">
                {STEPS[step].title}
              </legend>
              <p className="hr-step-sub">{STEPS[step].sub}</p>

              {step === 0 && (
                <>
                  <div className="hr-field">
                    {label("name", "Full name")}
                    <input {...field("name")} className="hr-input" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} />
                    {errorFor("name")}
                  </div>
                  <div className="hr-field">
                    {label("email", "Email")}
                    <input {...field("email")} type="email" inputMode="email" className="hr-input" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
                    {errorFor("email")}
                  </div>
                  <div className="hr-field">
                    {label("linkedin", "LinkedIn profile")}
                    <input {...field("linkedin")} type="url" inputMode="url" placeholder="linkedin.com/in/yourname" className="hr-input" value={values.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
                    {errorFor("linkedin")}
                  </div>
                  <div className="hr-two">
                    <div className="hr-field">
                      {label("city", "City")}
                      <input {...field("city")} list="ra-cities" className="hr-input" autoComplete="address-level2" value={values.city} onChange={(e) => set("city", e.target.value)} />
                      <datalist id="ra-cities">
                        {cities.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      {errorFor("city")}
                    </div>
                    <div className="hr-field">
                      {label("company", "Company / profession")}
                      <input {...field("company")} className="hr-input" autoComplete="organization" value={values.company} onChange={(e) => set("company", e.target.value)} />
                      {errorFor("company")}
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="hr-field">
                    {label("building", "What are you currently building or working on?")}
                    <textarea {...field("building")} rows={3} maxLength={600} className="hr-input" value={values.building} onChange={(e) => set("building", e.target.value)} />
                    {errorFor("building")}
                  </div>
                  <div className="hr-field">
                    {label("explore", "What are you hoping to explore through BNC?")}
                    <textarea {...field("explore")} rows={3} maxLength={600} className="hr-input" value={values.explore} onChange={(e) => set("explore", e.target.value)} />
                    <p className="hr-hint">People to meet, conversations you want to be part of, places you want to be present.</p>
                    {errorFor("explore")}
                  </div>
                  <div className="hr-two">
                    <div className="hr-field">
                      {label("industry", "Industry", true)}
                      <select {...field("industry")} className="hr-input" value={values.industry} onChange={(e) => set("industry", e.target.value)}>
                        <option value="">Choose one</option>
                        {INDUSTRIES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="hr-field">
                      {label("website", "Website", true)}
                      <input {...field("website")} type="url" inputMode="url" className="hr-input" value={values.website} onChange={(e) => set("website", e.target.value)} />
                      {errorFor("website")}
                    </div>
                  </div>
                  <div className="hr-field">
                    {label("heardFrom", "How did you hear about BNC?", true)}
                    <select {...field("heardFrom")} className="hr-input" value={values.heardFrom} onChange={(e) => set("heardFrom", e.target.value)}>
                      <option value="">Choose one</option>
                      {HEARD_FROM.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <p className="hr-hint">
                    By requesting access you agree to BNC&rsquo;s{" "}
                    <Link href="/about#charter" className="hr-link">
                      house rules
                    </Link>
                    .
                  </p>
                </>
              )}
            </fieldset>

            {state.status === "error" && state.message && (
              <p role="alert" className="hr-server-error">
                {state.message}
              </p>
            )}

            <div className="hr-ra-actions">
              {step > 0 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="hr-back">
                  Back
                </button>
              ) : (
                <span />
              )}
              <button type="submit" disabled={pending} aria-disabled={pending} className="hr-btn hr-btn-primary">
                {pending ? "Sending…" : step < STEPS.length - 1 ? "Next" : "Request Access"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
