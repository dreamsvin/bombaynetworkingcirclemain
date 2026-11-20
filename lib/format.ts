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
