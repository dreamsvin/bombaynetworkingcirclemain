"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Member } from "@/lib/data";
import { INDUSTRIES, PRIMARY_CTA, ROLES, STAGES } from "@/content/site";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/bnc";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Close } from "@/components/ui/icons";
import { MemberFace, MemberTile, lookingLabel, stageLabel } from "./member-tile";

type Filters = { city: string; industry: string; role: string; stage: string };
const ALL: Filters = { city: "", industry: "", role: "", stage: "" };

/**
 * Member directory. Filters run in the browser over consented, published profiles.
 * No contact details are shown — the drawer routes to Request access so BNC makes the introduction.
 */
export function MemberDirectory({ members, featured, cities, initialCity }: { members: Member[]; featured: Member[]; cities: string[]; initialCity?: string }) {
  const [f, setF] = useState<Filters>({ ...ALL, city: initialCity ?? "" });
  const [open, setOpen] = useState<Member | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const shown = useMemo(
    () =>
      members.filter(
        (m) =>
          (!f.city || m.city === f.city) &&
          (!f.industry || m.industry === f.industry) &&
          (!f.role || (m.role ?? "").toLowerCase().includes(f.role.toLowerCase())) &&
          (!f.stage || m.stage === f.stage),
      ),
    [members, f],
  );
  const active = Object.values(f).some(Boolean);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const select = (key: keyof Filters, label: string, options: { value: string; label: string }[]) => (
    <label className="block">
      <span className="mb-1.5 block font-mono text-label uppercase text-brand-text">{label}</span>
      <select value={f[key]} onChange={(e) => setF((p) => ({ ...p, [key]: e.target.value }))} className="block min-h-11 w-full border-2 border-line-control bg-bg-card px-3 text-body text-fg">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  const grid = (list: Member[]) => (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            className="block h-full w-full hover:[&>div]:bg-bg-raised"
            onClick={(e) => {
              opener.current = e.currentTarget;
              setOpen(m);
            }}
            aria-haspopup="dialog"
          >
            <MemberTile member={m} />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {select("city", "City", cities.map((c) => ({ value: c, label: c })))}
        {select("industry", "Industry", INDUSTRIES.map((i) => ({ value: i, label: i })))}
        {select("role", "Role", ROLES.map((r) => ({ value: r, label: r })))}
        {select("stage", "Stage", STAGES.map((s) => ({ value: s.value, label: s.label })))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <p className="text-body-sm text-fg-muted" aria-live="polite">
          {shown.length} {shown.length === 1 ? "member" : "members"}
          {active ? " match" : ""}
        </p>
        {active && (
          <button type="button" onClick={() => setF(ALL)} className="min-h-11 text-body-sm font-bold text-accent-text underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>

      {shown.length ? (
        grid(shown)
      ) : (
        <div className="mt-4 border-2 border-dashed border-line-strong p-6">
          <h2 className="text-heading-sm text-fg">No profiles match these filters yet.</h2>
          <p className="mt-2 text-body text-fg-muted">
            Only members who&rsquo;ve agreed to be listed appear here — most of the network isn&rsquo;t shown. Request access and tell us who you&rsquo;re looking for; we&rsquo;ll make the introduction.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <ButtonLink href={f.city ? `${PRIMARY_CTA.href}?city=${encodeURIComponent(f.city)}` : PRIMARY_CTA.href}>{PRIMARY_CTA.label}</ButtonLink>
            <button type="button" onClick={() => setF(ALL)} className="min-h-11 font-bold text-fg underline underline-offset-4">
              Clear filters
            </button>
          </div>
          {featured.length > 0 && (
            <>
              <h3 className="mt-8 font-mono text-label uppercase text-brand-text">Featured members</h3>
              {grid(featured.slice(0, 3))}
            </>
          )}
        </div>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="member-drawer-title"
        onClose={() => {
          setOpen(null);
          opener.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(null);
        }}
        className="fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full max-w-md border-l-2 border-line-strong bg-bg p-0 text-fg backdrop:bg-[var(--scrim)]"
      >
        {open && (
          <div className="flex h-full flex-col overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <MemberFace member={open} className="w-24" sizes="96px" />
              <button type="button" onClick={() => setOpen(null)} className="inline-flex h-11 w-11 items-center justify-center border-2 border-line-strong" aria-label="Close">
                <Close width={18} height={18} />
              </button>
            </div>
            {isPlaceholder(open) && <PlaceholderBadge className="mt-4 self-start" />}
            <h2 id="member-drawer-title" className="mt-4 font-display text-heading-lg text-fg">
              {clean(open.name)}
            </h2>
            <p className="text-body text-fg-muted">{[open.role, open.company].filter(Boolean).join(" · ")}</p>
            <dl className="mt-6 border-t-2 border-line-strong">
              {(
                [
                  ["City", open.city],
                  ["Industry", open.industry],
                  ["Stage", stageLabel(open.stage)],
                  ["Building", open.building],
                  ["Rooms attended", open.rooms_attended != null ? String(open.rooms_attended) : null],
                ] as const
              )
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 border-b-2 border-line-strong py-3">
                    <dt className="font-mono text-label uppercase text-brand-text">{k}</dt>
                    <dd className="text-body-sm text-fg">{v}</dd>
                  </div>
                ))}
            </dl>
            {open.looking_for.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-label uppercase text-brand-text">Looking for</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {open.looking_for.map((l) => (
                    <li key={l}>
                      <Chip>{lookingLabel(l)}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-auto pt-8">
              <ButtonLink href={open.city ? `${PRIMARY_CTA.href}?city=${encodeURIComponent(open.city)}` : PRIMARY_CTA.href} size="lg" className="w-full">
                Request access to get introduced
              </ButtonLink>
              <p className="mt-3 text-caption text-fg-subtle">Contact details are never shown. BNC makes every introduction.</p>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
