import type { CSSProperties } from "react";

type Props = {
  count: number;
  /** Distance from the centre, in % of the table's width. */
  radius: number;
  you?: number;
  matches?: number[];
};

/**
 * Seats round a table. Positions are computed here (no runtime JS), and each seat carries a scatter origin
 * so CSS can fly it in from "wherever that person was" (house.css, M1).
 */
export function Seats({ count, radius, you, matches = [] }: Props) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / count;
        const style = {
          "--x": `${(50 + radius * Math.cos(a)).toFixed(2)}%`,
          "--y": `${(50 + radius * Math.sin(a)).toFixed(2)}%`,
          "--i": i,
          "--sx": `${Math.round(Math.cos(a) * 180 + (((i * 37) % 60) - 30))}px`,
          "--sy": `${Math.round(Math.sin(a) * 140 + (((i * 53) % 50) - 25))}px`,
        } as CSSProperties;
        return <span key={i} className="hr-seat" style={style} data-you={i === you ? "" : undefined} data-match={matches.includes(i) ? "" : undefined} />;
      })}
    </>
  );
}
