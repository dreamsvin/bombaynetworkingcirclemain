import { PLACEHOLDER } from "@/content/seed";

/** True when any string field still carries the placeholder marker. Safe on server and client. */
export const isPlaceholder = (row: object) => Object.values(row).some((v) => typeof v === "string" && v.includes(PLACEHOLDER));

/** Removes the marker for display (the badge says it instead). */
export const clean = (s: string) => s.replace(` ${PLACEHOLDER}`, "").replace(PLACEHOLDER, "").trim();
