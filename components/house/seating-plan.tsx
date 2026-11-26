"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type Step = { title: string; body: string; detail: string };

const CX = 200;
const R = 200;
const r = 70;
const GAP = (2.2 * Math.PI) / 180;
const pt = (rad: number, a: number) => `${(CX + rad * Math.cos(a)).toFixed(1)} ${(CX + rad * Math.sin(a)).toFixed(1)}`;

/** Home §4. The four decisions behind a room, drawn as quarters of a table. ARIA tabs with roving tabindex. */
export function SeatingPlan({ steps }: { steps: readonly Step[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(SVGGElement | null)[]>([]);
  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) refs.current[i]?.focus();
  };
  const onKey = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
    const n = steps.length;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select((i + 1) % n, true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select((i + n - 1) % n, true);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(i);
    }
  };

  return (
    <>
      <div className="hr-plan-svg">
        <svg viewBox="-20 -20 440 440" role="tablist" aria-label="The four decisions behind a room">
          {steps.map((s, i) => {
            const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + GAP;
            const a1 = a0 + Math.PI / 2 - 2 * GAP;
            const am = (a0 + a1) / 2;
            const nx = CX + 135 * Math.cos(am);
            const ny = CX + 135 * Math.sin(am);
            const d = `M${pt(R, a0)} A${R} ${R} 0 0 1 ${pt(R, a1)} L${pt(r, a1)} A${r} ${r} 0 0 0 ${pt(r, a0)} Z`;
            return (
              <g
                key={s.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="hr-quad"
                role="tab"
                id={`plan-tab-${i}`}
                aria-controls={`plan-panel-${i}`}
                aria-selected={active === i}
                aria-label={`${i + 1}. ${s.title}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={onKey(i)}
              >
                <path d={d} />
                <text x={nx.toFixed(1)} y={(ny - 2).toFixed(1)} textAnchor="middle">
                  {i + 1}
                </text>
                <text className="hr-lbl" x={nx.toFixed(1)} y={(ny + 20).toFixed(1)} textAnchor="middle">
                  {s.title.replace(/^The /, "")}
                </text>
              </g>
            );
          })}
          <circle className="hr-plan-centre" cx={CX} cy={CX} r={r} />
          <text className="hr-plan-centre-text" x={CX} y={196} textAnchor="middle">
            your
          </text>
          <text className="hr-plan-centre-text" x={CX} y={220} textAnchor="middle">
            room
          </text>
        </svg>
      </div>
      <div className="hr-plan-panel">
        {steps.map((s, i) => (
          <div key={s.title} className="hr-tabpanel" role="tabpanel" id={`plan-panel-${i}`} aria-labelledby={`plan-tab-${i}`} hidden={active !== i}>
            <p className="hr-step-no" aria-hidden="true">
              {i + 1}
            </p>
            <h3 className="hr-d3">{s.title}</h3>
            <p className="hr-lede" style={{ marginBottom: 12 }}>
              {s.body}
            </p>
            <p>{s.detail}</p>
          </div>
        ))}
        <p className="hr-caption hr-plan-hint">Tap a quarter of the table, or use the arrow keys.</p>
      </div>
    </>
  );
}
