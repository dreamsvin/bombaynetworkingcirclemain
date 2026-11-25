/** All dates render in India time, whatever the server's zone. */
const TZ = "Asia/Kolkata";

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(iso)).toUpperCase();

export const fmtDay = (iso: string) => {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "2-digit" }).format(d),
    month: new Intl.DateTimeFormat("en-IN", { timeZone: TZ, month: "short" }).format(d).toUpperCase(),
  };
};

export const fmtLongDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

const inr = new Intl.NumberFormat("en-IN");

/** Ticket price as published on Luma. null = not published (we never guess), 0 = no ticket. */
export const fmtPrice = (price: number | null | undefined) =>
  price === null || price === undefined ? null : price === 0 ? "No ticket" : `₹${inr.format(price)}`;

export const fmtMonthYear = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, month: "short", year: "numeric" }).format(new Date(iso));
