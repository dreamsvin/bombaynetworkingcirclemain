import { z } from "zod";

/** Server-side validation for every public form. The client mirrors HTML constraints; this is the authority. */

const name = z.string().trim().min(2, "Your name, please.").max(80, "80 characters max.");
const email = z.string().trim().toLowerCase().email("That email doesn't look complete.").max(254);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} characters max.`)
    .optional()
    .transform((v) => (v ? v : undefined));
const phone = z
  .string()
  .trim()
  .max(20)
  .optional()
  .transform((v) => (v ? v.replace(/[^\d+]/g, "") : undefined))
  .refine((v) => !v || /^\+?\d{10,15}$/.test(v), "Use 10–15 digits, country code optional.");

/** Anti-spam fields every form carries. Never shown to people. */
const antiSpam = {
  website: z.string().max(0).optional(), // honeypot
  startedAt: z.coerce.number().int().positive(), // ms epoch when the form rendered
};

export const INQUIRY_TYPES = ["contact", "sponsor", "start_chapter", "partner", "speak"] as const;

export const inquirySchema = z
  .object({
    type: z.enum(INQUIRY_TYPES),
    name,
    email,
    phone,
    city: optionalText(80),
    organisation: optionalText(120),
    message: z.string().trim().min(10, "A line or two is plenty — 10 characters minimum.").max(2000, "2,000 characters max."),
    consent: z.literal("true", { errorMap: () => ({ message: "Tick this so we can reply to you." }) }),
    sourcePath: optionalText(200),
    ...antiSpam,
  })
  .superRefine((v, ctx) => {
    if (v.type === "start_chapter" && !v.city) ctx.addIssue({ code: "custom", path: ["city"], message: "Which city would you lead?" });
    if ((v.type === "sponsor" || v.type === "partner") && !v.organisation)
      ctx.addIssue({ code: "custom", path: ["organisation"], message: "Which organisation is this for?" });
  });

export const LOOKING_FOR_VALUES = ["co-founder", "clients", "hires", "investors", "partners", "peers", "learning"] as const;

/** Request access — the profile intake that lets BNC match people to rooms. Mirrored client-side in components/request-access. */
export const accessRequestSchema = z.object({
  name,
  email,
  phone,
  city: z.string().trim().min(2, "Which city are you in?").max(80),
  role: z.string().trim().min(2, "Pick the role closest to yours.").max(60),
  company: optionalText(120),
  industry: optionalText(60),
  linkedin: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || /^https:\/\/(www\.|[a-z]{2}\.)?linkedin\.com\//.test(v), "Paste the full LinkedIn URL, starting with https://"),
  building: z.string().trim().min(10, "A sentence about what you're building — 10 characters minimum.").max(600, "600 characters max."),
  lookingFor: z.array(z.enum(LOOKING_FOR_VALUES)).min(1, "Pick at least one.").max(7),
  heardFrom: optionalText(60),
  charter: z.literal("true", { errorMap: () => ({ message: "Agree to the Charter to send your request." }) }),
  sourcePath: optionalText(200),
  ...antiSpam,
});
export type AccessRequestInput = z.input<typeof accessRequestSchema>;

export const subscribeSchema = z.object({
  email,
  city: optionalText(80),
  /** footer | rsvp:<event-slug> | city:<chapter-slug> | blog */
  source: z.string().trim().regex(/^[a-z]+(:[a-z0-9-]+)?$/).max(80).default("footer"),
  ...antiSpam,
});

export type FieldErrors = Partial<Record<string, string>>;
export type FormState = { status: "idle" | "ok" | "error"; message?: string; errors?: FieldErrors; redirect?: string };
export const initialFormState: FormState = { status: "idle" };

export function flatten(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const k = String(issue.path[0] ?? "form");
    out[k] ??= issue.message;
  }
  return out;
}
