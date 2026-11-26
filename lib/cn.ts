import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** tailwind-merge must know the custom font-size names, or it treats `text-body` and `text-fg` as one group. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-2xl", "display-xl", "display-lg", "display-md", "heading-lg", "heading-md", "heading-sm", "body-lg", "body", "body-sm", "caption", "label"] },
      ],
      shadow: [{ shadow: ["none", "e1", "e2"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
