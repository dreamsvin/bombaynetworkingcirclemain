import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "block w-full min-h-11 border-2 border-line-control bg-bg-card px-3 py-2 text-body text-fg placeholder:text-fg-subtle aria-[invalid=true]:border-danger";

type Common = { label: string; name: string; error?: string; hint?: ReactNode; optional?: boolean; className?: string };

function Wrap({ label, name, error, hint, optional, className, children }: Common & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-body-sm font-semibold text-fg">
        {label} {optional && <span className="font-regular text-fg-subtle">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-caption text-fg-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-caption font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (name: string, error?: string, hint?: ReactNode) => (error ? `${name}-error` : hint ? `${name}-hint` : undefined);

export function TextField({ label, name, error, hint, optional, className, ...input }: Common & Omit<ComponentProps<"input">, "name">) {
  return (
    <Wrap {...{ label, name, error, hint, optional, className }}>
      <input
        id={name}
        name={name}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={control}
        {...input}
      />
    </Wrap>
  );
}

export function TextArea({ label, name, error, hint, optional, className, ...input }: Common & Omit<ComponentProps<"textarea">, "name">) {
  return (
    <Wrap {...{ label, name, error, hint, optional, className }}>
      <textarea
        id={name}
        name={name}
        rows={5}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={cn(control, "min-h-32")}
        {...input}
      />
    </Wrap>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  optional,
  className,
  options,
  ...input
}: Common & Omit<ComponentProps<"select">, "name"> & { options: { value: string; label: string }[] }) {
  return (
    <Wrap {...{ label, name, error, hint, optional, className }}>
      <select
        id={name}
        name={name}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={control}
        {...input}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export function Checkbox({ label, name, error }: { label: ReactNode; name: string; error?: string }) {
  return (
    <div>
      <label className="flex min-h-11 items-start gap-3 text-body-sm text-fg-muted">
        <input
          type="checkbox"
          name={name}
          value="true"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${name}-error`} className="text-caption font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
