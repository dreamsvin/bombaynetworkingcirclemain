"""Bombay Networking Circle — design tokens. Single source of truth for colour values.

Run:  python3 tokens/build_tokens.py
Writes: tokens/design-tokens.json and tokens/contrast-matrix.md, and FAILS (exit 1) if any
text pair the site uses drops below WCAG AA (4.5:1 body text, 3:1 large text / UI boundaries).

Change a value here, re-run, then mirror it in app/globals.css (the only other place hex values live).
Components never use hex — only the semantic Tailwind names wired in tailwind.config.ts.

Palette (finalised 27 Nov 2026): Primary #7A2E22 warm brown leads; Action #1B3A5C navy is the CTA colour;
Accent #CDE4F5 sky; Soft base #EDE3D6; Base #FFFFFF.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

PRIMITIVES = {
    # Text — warm near-black ink (body copy on light surfaces)
    "ink": "#1C1915",
    "ink-muted": "#4F473F",
    "ink-subtle": "#62594F",
    # Surfaces — Base white, Soft base beige
    "white": "#FFFFFF",
    "soft": "#EDE3D6",
    "soft-2": "#E3D6C5",
    # Primary — warm brown. Leads: headings accents, text links, the dark-tone sections and footer.
    "primary": "#7A2E22",
    "primary-2": "#6A271D",
    "primary-3": "#5C2118",
    # Text steps on primary
    "on-primary-muted": "#EDE3D6",
    "on-primary-subtle": "#E5CBC2",
    # Action — navy. Buttons and calls to action.
    "navy": "#1B3A5C",
    "navy-hover": "#15304D",
    "navy-press": "#10253C",
    # Accent — sky. Tags, badges, and the CTA on primary sections (with navy label).
    "sky": "#CDE4F5",
    "sky-hover": "#E2EFF9",
    "sky-deep": "#6F9FC8",
    # Lines
    "line": "#E3D6C5",
    "line-strong": "#CDBDA8",
    "line-control": "#857A6D",
    "line-dark": "#8F4235",
    "line-dark-strong": "#A0564A",
    "line-dark-control": "#D49E93",
    # Status
    "danger": "#A3362A",
    "success": "#2F6B45",
    "danger-light": "#FFD3CC",
    "success-light": "#CDEFD8",
}

# (foreground, background, minimum ratio, what it is)
PAIRS = [
    ("ink", "white", 4.5, "body text on base"),
    ("ink", "soft", 4.5, "body text on soft base (raised sections)"),
    ("ink", "soft-2", 4.5, "body text on overlay"),
    ("ink-muted", "white", 4.5, "muted text on base"),
    ("ink-muted", "soft", 4.5, "muted text on soft base"),
    ("ink-muted", "soft-2", 4.5, "muted text on overlay"),
    ("ink-subtle", "white", 4.5, "subtle text on base (captions)"),
    ("ink-subtle", "soft", 4.5, "subtle text on soft base"),
    ("white", "navy", 4.5, "primary button label"),
    ("white", "navy-hover", 4.5, "primary button hover"),
    ("primary", "white", 4.5, "accent text / link on base"),
    ("primary", "soft", 4.5, "accent text on soft base"),
    ("ink", "sky", 4.5, "tag text on sky"),
    ("navy", "sky", 4.5, "badge text on sky"),
    ("white", "primary", 4.5, "text on primary sections"),
    ("on-primary-muted", "primary", 4.5, "muted text on primary"),
    ("on-primary-subtle", "primary", 4.5, "subtle text on primary"),
    ("on-primary-subtle", "primary-2", 4.5, "subtle text on raised primary"),
    ("white", "primary-3", 4.5, "tag text on primary tint"),
    ("navy", "sky", 4.5, "primary button label on primary sections"),
    ("navy", "sky-hover", 4.5, "primary button hover on primary sections"),
    ("sky", "primary", 4.5, "accent text on primary"),
    ("line-control", "white", 3.0, "form control border on base"),
    ("line-control", "soft", 3.0, "form control border on soft base"),
    ("line-dark-control", "primary", 3.0, "form control border on primary"),
    ("navy", "white", 3.0, "primary button boundary vs page"),
    ("navy", "soft", 3.0, "primary button boundary vs soft base"),
    ("sky", "primary", 3.0, "primary button boundary vs primary section"),
    ("danger", "white", 4.5, "error text"),
    ("danger", "soft", 4.5, "error text on soft base"),
    ("success", "white", 4.5, "success text"),
    ("danger-light", "primary", 4.5, "error text on primary"),
    ("success-light", "primary", 4.5, "success text on primary"),
    ("navy", "white", 3.0, "focus ring on base"),
    ("sky", "primary", 3.0, "focus ring on primary"),
]


def lum(h):
    h = h.lstrip("#")
    c = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    A, B = sorted((lum(a), lum(b)), reverse=True)
    return (A + 0.05) / (B + 0.05)


def main():
    rows, failures = [], []
    for fg, bg, need, what in PAIRS:
        r = ratio(PRIMITIVES[fg], PRIMITIVES[bg])
        ok = r >= need
        rows.append(f"| {fg} `{PRIMITIVES[fg]}` | {bg} `{PRIMITIVES[bg]}` | {r:.2f}:1 | {need}:1 | {'PASS' if ok else 'FAIL'} | {what} |")
        if not ok:
            failures.append(f"{fg} on {bg}: {r:.2f} < {need} ({what})")

    with open(os.path.join(HERE, "design-tokens.json"), "w") as f:
        json.dump({"$description": "BNC colour primitives. Edit build_tokens.py, not this file.", "color": PRIMITIVES}, f, indent=2)
        f.write("\n")
    with open(os.path.join(HERE, "contrast-matrix.md"), "w") as f:
        f.write("# Contrast matrix (generated by tokens/build_tokens.py)\n\n")
        f.write("Every text/background pair the site uses, checked against WCAG 2.1 AA.\n\n")
        f.write("| Foreground | Background | Ratio | Needs | Result | Used for |\n|---|---|---|---|---|---|\n")
        f.write("\n".join(rows) + "\n")

    if failures:
        print("Contrast failures:\n  " + "\n  ".join(failures))
        sys.exit(1)
    print(f"All {len(PAIRS)} pairs pass WCAG AA.")


if __name__ == "__main__":
    main()
