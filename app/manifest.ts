import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bombay Networking Circle",
    short_name: "BNC",
    description: "Founder networking events in eight Indian cities.",
    start_url: "/",
    display: "browser",
    background_color: "#F9F5EF",
    theme_color: "#F9F5EF",
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  };
}
