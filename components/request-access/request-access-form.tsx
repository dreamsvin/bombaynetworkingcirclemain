"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { requestAccess } from "@/app/actions";
import { initialFormState, type FieldErrors } from "@/lib/schemas";
import { CHARTER, HEARD_FROM, INDUSTRIES, LINKS, LOOKING_FOR, NEXT_STEPS, ROLES } from "@/content/site";
import { track } from "@/lib/analytics";
import type { CSSProperties } from "react";

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
  { title: "The house rules", fields: ["heardFrom", "charter"] },
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
      return v.charter ? undefined : "Agree to the house rules to send your request.";
    default:
      return undefined;
  }
}

const SUBS = ["The basics, so we can write back.", "This is how we decide who you sit with.", "Last thing. Everyone at the table agrees to these."];
const LABELS: Partial<Record<Key, string>> = {
  name: "Full name",
  email: "Email",
  phone: "Phone",
  city: "City",
  role: "Your role",
  linkedin: "LinkedIn",
  building: "What are you building",
  lookingFor: "What you're looking for",
  charter: "House rules",
};
/** Three seats round a small table, one per step (house.css, M5). */
const SEAT_POS = [
  { x: "50%", y: "6%" },
  { x: "88.1%", y: "72%" },
  { x: "11.9%", y: "72%" },
];

export function RequestAccessForm({ cities, initialCity }: { cities: string[]; initialCity?: string }) {
  const [summary, setSummary] = useState<Key[]>([]);
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
  const seatState = (i: number) => (done || i < step ? "done" : i === step ? "current" : undefined);

  return (
    <div className="hr-wrap hr-ra-grid">
      <aside className="hr-ra-side">
        <div className="hr-seat-progress" aria-hidden="true">
          <div className="hr-table-top">{done ? "Seat set" : "Setting your seat"}</div>
          {SEAT_POS.map((p, i) => (
            <span key={i} className="hr-seat" data-state={seatState(i)} style={{ "--x": p.x, "--y": p.y } as CSSProperties} />
          ))}
        </div>
        <h1 id="ra-title" className="hr-d2">
          Tell us who you are. We&rsquo;ll find your seat.
        </h1>
        <p className="hr-lede">Joining is free. Your answers let us seat you at a room in your city with people worth meeting.</p>
        <ul className="hr-assure">
          <li>About three minutes.</li>
          <li>A person reads every request.</li>
          <li>Nothing here is shown publicly or shared.</li>
          <li>Rooms are paid; your invite shows the price.</li>
        </ul>
      </aside>

      <div className="hr-ra-form" data-done={done}>
        {done ? (
          <div className="hr-success hr-dark">
            <h2 ref={headingRef} tabIndex={-1} className="hr-d2">
              Thanks, {first}. Your seat&rsquo;s being set.
            </h2>
            <ol>
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title}>
                  <span>{i + 1}</span>
                  <div>
                    <b>{i === 1 ? `You're matched to a room in ${values.city}.` : `${s.title}.`}</b>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="hr-ctas">
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { placement: "request-access-success" })}
                className="hr-btn hr-btn-quiet"
              >
                Join the WhatsApp community<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <Link href={`/members?city=${encodeURIComponent(values.city)}`} className="hr-link">
                See who&rsquo;s in {values.city}
              </Link>
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
            {restored && step === 0 && <p className="hr-hint" style={{ marginBottom: 24 }}>We restored what you typed last time on this device.</p>}

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
                Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
              <legend data-step-title tabIndex={-1} className="hr-step-title">
                {STEPS[step].title}
              </legend>
              <p className="hr-step-sub">{SUBS[step]}</p>

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
                    <p className="hr-hint">Your invite comes here.</p>
                    {errorFor("email")}
                  </div>
                  <div className="hr-field">
                    {label("phone", "Phone", true)}
                    <input {...field("phone")} type="tel" inputMode="tel" className="hr-input" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
                    {errorFor("phone")}
                  </div>
                  <div className="hr-field">
                    {label("city", "City")}
                    <input {...field("city")} list="ra-cities" className="hr-input" autoComplete="address-level2" value={values.city} onChange={(e) => set("city", e.target.value)} />
                    <datalist id="ra-cities">
                      {cities.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <p className="hr-hint">No chapter in your city yet? Tell us anyway. Requests decide where we open next.</p>
                    {errorFor("city")}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="hr-two">
                    <div className="hr-field">
                      {label("role", "Your role")}
                      <select {...field("role")} className="hr-input" value={values.role} onChange={(e) => set("role", e.target.value)}>
                        <option value="">Choose one</option>
                        {ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      {errorFor("role")}
                    </div>
                    <div className="hr-field">
                      {label("company", "Company", true)}
                      <input {...field("company")} className="hr-input" autoComplete="organization" value={values.company} onChange={(e) => set("company", e.target.value)} />
                    </div>
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
                      {label("linkedin", "LinkedIn", true)}
                      <input {...field("linkedin")} type="url" inputMode="url" placeholder="https://www.linkedin.com/in/…" className="hr-input" value={values.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
                      {errorFor("linkedin")}
                    </div>
                  </div>
                  <div className="hr-field">
                    {label("building", "What are you building?")}
                    <textarea {...field("building")} rows={4} maxLength={600} className="hr-input" value={values.building} onChange={(e) => set("building", e.target.value)} />
                    <p className="hr-counter">{values.building.length} / 600</p>
                    {errorFor("building")}
                  </div>
                  <fieldset className="hr-field" style={{ border: 0, padding: 0, minWidth: 0 }} aria-describedby={err("lookingFor") ? "ra-lookingFor-error" : undefined}>
                    <legend>What are you looking for?</legend>
                    <div className="hr-chips">
                      {LOOKING_FOR.map((l, i) => {
                        const on = values.lookingFor.includes(l.value);
                        return (
                          <label key={l.value} className="hr-chip">
                            <input
                              type="checkbox"
                              data-field={i === 0 ? "lookingFor" : undefined}
                              checked={on}
                              onChange={() => set("lookingFor", on ? values.lookingFor.filter((x) => x !== l.value) : [...values.lookingFor, l.value])}
                            />
                            <span>{l.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errorFor("lookingFor")}
                  </fieldset>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="hr-field">
                    {label("heardFrom", "How did you hear about BNC?", true)}
                    <select {...field("heardFrom")} className="hr-input" value={values.heardFrom} onChange={(e) => set("heardFrom", e.target.value)}>
                      <option value="">Choose one</option>
                      {HEARD_FROM.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hr-rules-mini">
                    <ol>
                      {CHARTER.map((c) => (
                        <li key={c.title}>
                          <b>{c.title}</b> {c.body}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="hr-field">
                    <label className="hr-check">
                      <input {...field("charter")} type="checkbox" checked={values.charter} onChange={(e) => set("charter", e.target.checked)} />I agree to the house rules
                    </label>
                    {errorFor("charter")}
                  </div>
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
                {pending ? "Sending…" : step < STEPS.length - 1 ? "Next" : "Request access"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
