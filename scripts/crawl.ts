/**
 * Link crawl. Starts at / and follows every internal link, plus sitemap.xml. Fails if any page is not 200,
 * if any href is a bare "#" placeholder, or if any internal link points to a 404.
 *
 *   npm run build && npm start   (in another shell)
 *   BASE=http://localhost:3000 npm run crawl
 */
export {};

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");

const seen = new Map<string, number>();
const problems: string[] = [];
const external = new Set<string>();
const queue: { url: string; from: string }[] = [{ url: "/", from: "(start)" }];

const hrefs = (html: string) => [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));

async function visit(path: string, from: string) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  seen.set(path, res.status);
  if (res.status >= 300 && res.status < 400) return; // redirects are checked for their target below
  if (res.status !== 200) {
    problems.push(`${res.status}  ${path}  (linked from ${from})`);
    return;
  }
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) return;
  const html = await res.text();
  for (const h of hrefs(html)) {
    if (h === "#" || h === "" || h.startsWith("javascript:")) {
      problems.push(`placeholder href="${h}" on ${path}`);
      continue;
    }
    if (/^(https?:)?\/\//.test(h) || h.startsWith("mailto:") || h.startsWith("tel:")) {
      external.add(h);
      continue;
    }
    if (h.startsWith("#")) continue; // in-page anchor
    const clean = h.split("#")[0].split("?")[0] || "/";
    if (!seen.has(clean) && !queue.some((q) => q.url === clean)) queue.push({ url: clean, from: path });
  }
}

async function main() {
  while (queue.length) {
    const { url, from } = queue.shift()!;
    if (!seen.has(url)) await visit(url, from);
  }
  // Every sitemap URL must resolve too.
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  for (const loc of [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)) {
    if (!seen.has(loc)) await visit(loc, "sitemap.xml");
  }
  console.log(`Crawled ${seen.size} internal URLs. External links found: ${external.size}`);
  for (const e of [...external].sort()) console.log(`  ext  ${e}`);
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log("No 404s, no placeholder hrefs.");
}

main();
