import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CURATION, EXPERIENCES_CTA, HERO, ROOM_STEPS, SECONDARY_CTA, SITE, STATS } from "@/content/site";
import { ALL_EVENT_PHOTOS, PHOTOS } from "@/content/photos";
import { getChapters, getFeaturedMembers, getPastEvents, getStories, getUpcomingEvents, isPlaceholder } from "@/lib/data";
import { fmtTime } from "@/lib/format";
import { pageMeta, orgJsonLd } from "@/lib/seo";
import { PrimaryCta } from "@/components/site/primary-cta";
import { JsonLd } from "@/components/site/json-ld";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { CityLights, type CityPin } from "@/components/house/city-lights";

export const revalidate = 600; // ISR; must be a literal (matches REVALIDATE in lib/data.ts)

export const metadata: Metadata = {
  ...pageMeta({
    title: "Bombay Networking Circle | The Right Rooms, The Right People",
    ogTitle: "The right rooms change everything. The right people make it happen.",
    description: "Discover Bombay Networking Circle, a growing network connecting people across cities, industries and experiences.",
    path: "/",
  }),
  title: { absolute: "Bombay Networking Circle | The Right Rooms, The Right People" },
};

/** §4 — who BNC is for. Aspirational, not exclusive for its own sake. */
const AUDIENCES = [
  { title: "Founders & business owners", body: "Expand your network, discover perspectives and build meaningful business relationships." },
  { title: "Creators & experts", body: "Meet people who value your expertise and understand the work you're building." },
  { title: "Operators & professionals", body: "Build relationships beyond your immediate workplace or industry." },
  { title: "Investors & ecosystem builders", body: "Explore new ideas, people and opportunities across the ecosystem." },
];

/** §5 — the ecosystem. Introductions are listed because hosts already make them after each room (see CURATION). */
const ECOSYSTEM = [
  { title: "Curated Rooms", body: "Purposeful gatherings built around people, ideas and conversations." },
  { title: "Introductions", body: "Connecting people who may have a reason to know each other." },
  { title: "Collaborations", body: "Creating space for partnerships, shared projects and new possibilities." },
  { title: "City Chapters", body: "A network that connects people across cities and local ecosystems." },
  { title: "Experiences & IPs", body: "Distinct BNC experiences built around specific interests, industries and themes." },
];

/** §6 fallback until members consent to be featured: the kinds of people in the circle, not individuals. */
const ARCHETYPES = [
  { initials: "DF", title: "The D2C founder", meta: "Consumer brand · Mumbai", tag: "Retail & distribution" },
  { initials: "RO", title: "The RevOps lead", meta: "B2B SaaS · Bangalore", tag: "Scaling sales" },
  { initials: "BD", title: "The brand designer", meta: "Independent studio · Pune", tag: "Brand & identity" },
  { initials: "AN", title: "The angel investor", meta: "Early-stage · Delhi NCR", tag: "First cheques" },
];

/** §7 fallback: the three kinds of story BNC is collecting, shown as the format, never as invented outcomes. */
const STORY_FORMATS = [
  {
    kind: "A business collaboration",
    people: "Two members from different businesses or industries.",
    connection: "Seated together because one had a need the other had already solved.",
    next: "A project, partnership or client relationship that started at the table.",
  },
  {
    kind: "A professional introduction",
    people: "A member with a specific ask, and someone a host knew could help.",
    connection: "A direct introduction made by the host after hearing the ask in the room.",
    next: "A hire, an adviser or a first customer, followed up within a week.",
  },
  {
    kind: "A relationship beyond the room",
    people: "Members who met at one experience and kept showing up.",
    connection: "Shared rooms across months, and a reason to keep talking.",
    next: "An ongoing working relationship that neither would have found alone.",
  },
];

/** §12 — the doubts visitors have but rarely ask. Answers state the real access model, no promised timelines. */
const FAQS = [
  {
    q: "What is Bombay Networking Circle?",
    a: "A growing community of founders, operators, creators and professionals across Indian cities. BNC brings people together through curated rooms: small, hosted experiences built around a theme and the people who should be in the room.",
  },
  {
    q: "Who can be part of BNC?",
    a: "People who are building something and want meaningful relationships: founders and business owners, creators and experts, operators and professionals, and investors and ecosystem builders. What matters is what you bring and how you take part.",
  },
  {
    q: "What does curated mean at BNC?",
    a: "Every room starts with an intention: a theme, a conversation, a group of people with different perspectives on it. We decide who should be in the room using what people tell us when they request access, and a host runs the conversation so people connect beyond introductions.",
  },
  {
    q: "Is BNC only for founders?",
    a: "No. Founders are a big part of the circle, but rooms bring together people across industries and professional backgrounds, because the useful introductions are often across them.",
  },
  {
    q: "Do I need to attend an experience to be part of BNC?",
    a: "Requesting access is free. Once we've read your request, we'll share the next step, usually an invitation to a room that fits you. After your first room you join the member community and hear about new experiences first.",
  },
  {
    q: "Are BNC experiences paid?",
    a: "Joining is free. Experiences are paid, and pricing depends on the experience. Every experience shows its price before you commit.",
  },
  {
    q: "How do I request access?",
    a: "Fill in the short Request Access form: who you are, what you're working on and what you'd like to explore through BNC. It takes a few minutes.",
  },
  {
    q: "What happens after I request access?",
    a: "A person on the BNC team reads every request. We'll review your details and share the next step by email, including experiences that may be relevant to you.",
  },
];

const day = (iso: string) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" }).format(new Date(iso));
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default async function HomePage() {
  const [chapters, upcoming, past, members, stories] = await Promise.all([
    getChapters(),
    getUpcomingEvents({ limit: 3 }),
    getPastEvents({ limit: 1 }),
    getFeaturedMembers(),
    getStories(),
  ]);
  const featured = members.filter((m) => m.is_published && !isPlaceholder(m)).slice(0, 12);
  const realStories = stories.filter((s) => s.is_published && !isPlaceholder(s)).slice(0, 3);
  const room = past.find((e) => e.is_published && !isPlaceholder(e));
  const pins: CityPin[] = chapters.map((c) => ({
    slug: c.slug,
    city: c.city,
    tag: c.is_flagship ? "Flagship · where it started" : c.lead_name ? `Led by ${c.lead_name}` : "City chapter",
    lat: c.latitude,
    lng: c.longitude,
    flagship: c.is_flagship,
  }));
  const [membersStat, citiesStat, eventsStat] = STATS.items;

  return (
    <>
      <JsonLd data={orgJsonLd()} />

      {/* ───── 1. Hero ───── */}
      <section className="hr-hero2" aria-labelledby="hero-title">
        <div className="hr-wrap hr-hero2-grid">
          <div className="hr-hero2-copy">
            <p className="hr-name">Bombay Networking Circle</p>
            <h1 id="hero-title">
              The right rooms change everything.<span className="hr-second">The right people make it happen.</span>
            </h1>
            <p className="hr-lede">{HERO.sub}</p>
            <div className="hr-ctas">
              <PrimaryCta size="lg" placement="home-hero" className="hr-btn hr-btn-primary" />
              <Link href={SECONDARY_CTA.href} className="hr-btn hr-btn-quiet">
                {SECONDARY_CTA.label}
              </Link>
            </div>
            <div className="hr-stats">
              {[membersStat, citiesStat, eventsStat].map((s) => (
                <div key={s.label}>
                  <b>{s.value}</b>
                  <span>{s.label === "events held" ? "experiences hosted" : s.label}</span>
                </div>
              ))}
              <small>As of {STATS.asOf}. Joining is free; experiences are paid.</small>
            </div>
          </div>
          <div className="hr-hero2-visual">
            <div className="hr-photo hr-hp-main">
              <Image src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} fill priority sizes="(max-width: 900px) 90vw, 46vw" />
            </div>
            <div className="hr-photo hr-hp-side">
              <Image src={PHOTOS.gardenTable.src} alt={PHOTOS.gardenTable.alt} fill sizes="(max-width: 900px) 40vw, 20vw" />
            </div>
            <p className="hr-hp-note">
              <b>Inside a BNC room</b>
              One theme. The right people. A conversation that keeps going after.
            </p>
          </div>
        </div>
      </section>

      {/* ───── 2. What is BNC? ───── */}
      <section className="hr-section-tight" aria-labelledby="what-title">
        <div className="hr-wrap hr-what-grid">
          <h2 id="what-title" className="hr-d2">
            More than being in the room.
          </h2>
          <div className="hr-what-body">
            <p>{HERO.lede.replace("meaningful relationships", "the right relationships")}</p>
            <p>Across cities, industries and experiences, BNC brings people together through curated rooms, meaningful conversations and opportunities to connect beyond the obvious.</p>
            <p className="hr-pull">
              Your network should not be limited to who you already know. It should introduce you to perspectives, people and possibilities you haven&rsquo;t encountered yet.
            </p>
          </div>
        </div>
      </section>

      {/* ───── 3. What are curated rooms? ───── */}
      <section id="curated-rooms" className="hr-section hr-curated" aria-labelledby="curated-title">
        <div className="hr-wrap">
          <div className="hr-curated-head">
            <h2 id="curated-title" className="hr-d2">
              Not every room is the right room.
            </h2>
            <div>
              <p className="hr-lede">Every BNC room begins with an intention. A theme. A conversation. A group of people who can bring different perspectives to the same table.</p>
              <p>
                We think about who should be in the room, what the room should explore, and how people can connect beyond introductions. The result is an experience designed around meaningful interaction, not simply attendance.
              </p>
            </div>
          </div>
          <ol className="hr-steps">
            {CURATION.map((c, i) => (
              <li key={c.title}>
                <span className="hr-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ol>
          <article className="hr-case" aria-labelledby="case-title">
            <div className="hr-case-photos">
              <div className="hr-photo">
                <Image src={PHOTOS.gardenTalk.src} alt={PHOTOS.gardenTalk.alt} fill sizes="(max-width: 900px) 60vw, 30vw" />
              </div>
              <div className="hr-photo">
                <Image src={PHOTOS.roomE.src} alt={PHOTOS.roomE.alt} fill sizes="(max-width: 900px) 40vw, 18vw" />
              </div>
            </div>
            <div className="hr-case-info">
              <span className="hr-plate">{room ? `A real BNC room · ${room.chapter.city}` : "Anatomy of a BNC room"}</span>
              <h3 id="case-title" className="hr-d3">
                {room ? room.title : "How a room comes together"}
              </h3>
              <dl>
                <div>
                  <dt>The theme</dt>
                  <dd>{room ? (room.theme ?? room.title) : "One theme per room, set before anyone is invited, so everyone arrives for the same conversation."}</dd>
                </div>
                <div>
                  <dt>Who was in the room</dt>
                  <dd>{room?.who_attends ?? "People whose work overlaps with the theme: someone who needs what you know, and someone who knows what you need."}</dd>
                </div>
                <div>
                  <dt>Why these people</dt>
                  <dd>{room?.summary ?? CURATION[1].detail}</dd>
                </div>
                <div>
                  <dt>How it was structured</dt>
                  <dd>{ROOM_STEPS.map((s) => s.title).join(" → ")}.</dd>
                </div>
                <div>
                  <dt>What happened after</dt>
                  <dd>{CURATION[3].detail}</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </section>

      {/* ───── 4. Who is BNC for? ───── */}
      <section className="hr-section hr-for hr-dark" aria-labelledby="for-title">
        <div className="hr-wrap hr-for-grid">
          <div className="hr-for-head">
            <h2 id="for-title" className="hr-d2">
              For people building what&rsquo;s next.
            </h2>
            <p className="hr-lede" style={{ color: "inherit" }}>
              You&rsquo;re welcome here because you have something meaningful to contribute, and you&rsquo;re interested in building relationships that last.
            </p>
          </div>
          <ul className="hr-for-list">
            {AUDIENCES.map((a) => (
              <li key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───── 5. The BNC ecosystem ───── */}
      <section className="hr-section" aria-labelledby="eco-title">
        <div className="hr-wrap hr-eco-grid">
          <div className="hr-eco-head">
            <span className="hr-plate">The BNC ecosystem</span>
            <h2 id="eco-title" className="hr-d2">
              One network. Many ways to experience it.
            </h2>
          </div>
          <ol className="hr-eco-list">
            {ECOSYSTEM.map((e) => (
              <li key={e.title}>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── 6. Meet the people ───── */}
      <section className="hr-section hr-people" aria-labelledby="people-title">
        <div className="hr-wrap">
          <div className="hr-head-row">
            <h2 id="people-title" className="hr-d2">
              Meet the people who make the circle.
            </h2>
            <Link href="/members" className="hr-link">
              See all people
            </Link>
          </div>
          <ul className="hr-people-grid">
            {featured.length
              ? featured.map((m) => (
                  <li key={m.id} className="hr-person-card">
                    {m.photo ? (
                      <div className="hr-photo">
                        <Image src={m.photo} alt={m.name} fill sizes="(max-width: 520px) 100vw, (max-width: 1020px) 50vw, 25vw" />
                      </div>
                    ) : (
                      <div className="hr-initials" aria-hidden="true">
                        {initials(m.name)}
                      </div>
                    )}
                    <div className="hr-person-body">
                      <h3>{m.name}</h3>
                      <p className="hr-meta">{[m.role, m.company].filter(Boolean).join(", ")}</p>
                      <p className="hr-meta">{[m.industry, m.city].filter(Boolean).join(" · ")}</p>
                      {m.building && <span className="hr-tag">{m.building.length > 40 ? `${m.building.slice(0, 40)}…` : m.building}</span>}
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="hr-link">
                          LinkedIn<span className="sr-only"> profile of {m.name} (opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                  </li>
                ))
              : ARCHETYPES.map((a) => (
                  <li key={a.title} className="hr-person-card">
                    <div className="hr-initials" aria-hidden="true">
                      {a.initials}
                    </div>
                    <div className="hr-person-body">
                      <h3>{a.title}</h3>
                      <p className="hr-meta">{a.meta}</p>
                      <span className="hr-tag">{a.tag}</span>
                    </div>
                  </li>
                ))}
          </ul>
          <div className="hr-people-note">
            <p className="hr-caption">
              {featured.length
                ? "Members featured here have agreed to be shown."
                : "The kinds of people in the circle. Member profiles appear here as members agree to be featured."}
            </p>
            <Link href="/members" className="hr-link">
              Browse the People page
            </Link>
          </div>
        </div>
      </section>

      {/* ───── 7. What happens when people connect? ───── */}
      <section className="hr-section" aria-labelledby="stories-title">
        <div className="hr-wrap">
          <div className="hr-head-row">
            <h2 id="stories-title" className="hr-d2" style={{ maxWidth: "18ch" }}>
              The value of a connection is what happens next.
            </h2>
            <Link href="/stories" className="hr-link">
              All stories
            </Link>
          </div>
          <div className="hr-stories">
            {realStories.length
              ? realStories.map((s) => (
                  <article key={s.id} className="hr-story-card">
                    <span className="hr-plate">Member story</span>
                    <h3 className="hr-d4">
                      <Link href={`/stories/${s.slug}`}>{s.headline}</Link>
                    </h3>
                    <dl>
                      <div>
                        <dt>The people</dt>
                        <dd>{s.problem}</dd>
                      </div>
                      <div>
                        <dt>The connection</dt>
                        <dd>{s.connection}</dd>
                      </div>
                      <div>
                        <dt>What happened next</dt>
                        <dd>{s.outcome}</dd>
                      </div>
                    </dl>
                  </article>
                ))
              : STORY_FORMATS.map((s) => (
                  <article key={s.kind} className="hr-story-card">
                    <span className="hr-plate">Story format</span>
                    <h3 className="hr-d4">{s.kind}</h3>
                    <dl>
                      <div>
                        <dt>The people</dt>
                        <dd>{s.people}</dd>
                      </div>
                      <div>
                        <dt>The connection</dt>
                        <dd>{s.connection}</dd>
                      </div>
                      <div>
                        <dt>What happens next</dt>
                        <dd>{s.next}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
          </div>
          {!realStories.length && (
            <p className="hr-caption" style={{ marginTop: 32 }}>
              We&rsquo;re collecting verified member stories in these three shapes. Have one? <Link href="/contact" className="hr-link">Tell us</Link>.
            </p>
          )}
        </div>
      </section>

      {/* ───── 8. Chapters ───── */}
      <section className="hr-cities" aria-labelledby="cities-title" style={{ paddingTop: 0 }}>
        <div className="hr-wrap hr-cities-grid">
          <CityLights cities={pins} />
        </div>
      </section>

      {/* ───── 9. Experiences ───── */}
      <section className="hr-section hr-people" aria-labelledby="xp-title">
        <div className="hr-wrap">
          <div className="hr-head-row">
            <h2 id="xp-title" className="hr-d2">
              Find your next BNC experience.
            </h2>
            <Link href="/rooms" className="hr-link">
              All experiences
            </Link>
          </div>
          <div className="hr-xp-grid">
            {upcoming.length ? (
              upcoming.map((r) => (
                <Link key={r.id} href={`/rooms/${r.slug}`} className="hr-xp">
                  <div className="hr-xp-top">
                    <span className="hr-xp-theme">{r.theme ?? r.chapter.city}</span>
                    <h3>{r.title}</h3>
                  </div>
                  <dl>
                    <div>
                      <dt>City</dt>
                      <dd>{r.chapter.city}</dd>
                    </div>
                    {r.who_attends && (
                      <div>
                        <dt>Designed for</dt>
                        <dd>{r.who_attends}</dd>
                      </div>
                    )}
                    {r.summary && (
                      <div>
                        <dt>Expect</dt>
                        <dd>{r.summary}</dd>
                      </div>
                    )}
                    <div>
                      <dt>When</dt>
                      <dd>
                        {day(r.starts_at)}, {fmtTime(r.starts_at)}
                        {r.venue ? ` · ${r.venue}` : ""}
                      </dd>
                    </div>
                  </dl>
                  <div className="hr-xp-foot">
                    <span className="hr-caption">{r.capacity ? `${r.capacity} seats` : "Limited seats"}</span>
                    <b>{r.price_inr != null ? `₹${r.price_inr.toLocaleString("en-IN")}` : "Price on invite"}</b>
                  </div>
                </Link>
              ))
            ) : (
              <div className="hr-xp-empty">
                <b>The next experiences are being planned.</b>
                <p className="hr-caption">New experiences go to members first. Request access, or leave your email below, and you&rsquo;ll hear when your city has one.</p>
              </div>
            )}
          </div>
          <div className="hr-head-row" style={{ marginTop: 96, marginBottom: 32 }}>
            <h3 className="hr-d3">From past rooms.</h3>
            <p className="hr-caption">
              {eventsStat.value} experiences hosted as of {STATS.asOf}.
            </p>
          </div>
          <div className="hr-wall-grid">
            {ALL_EVENT_PHOTOS.map((p) => (
              <figure key={p.src} className="hr-photo">
                <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 10. How to become part of BNC ───── */}
      <section className="hr-section hr-join hr-dark" data-tone="ink" aria-labelledby="join-title">
        <div className="hr-wrap hr-join-grid">
          <div className="hr-join-copy">
            <h2 id="join-title" className="hr-d2">
              Find your place in the circle.
            </h2>
            <p>BNC is built around the people who make the network meaningful.</p>
            <p>Tell us a little about yourself, what you&rsquo;re building, and what you&rsquo;re looking to explore through BNC. We&rsquo;ll help you understand the experiences and opportunities that may be relevant to you.</p>
            <div className="hr-ctas">
              <PrimaryCta size="lg" placement="home-join" className="hr-btn hr-btn-primary" />
              <Link href={EXPERIENCES_CTA.href} className="hr-btn hr-btn-quiet">
                {EXPERIENCES_CTA.label}
              </Link>
            </div>
          </div>
          <ol className="hr-join-steps">
            <li>
              <div>
                <b>Tell us about yourself</b>
                <p>A short form: who you are, what you&rsquo;re working on, what you&rsquo;d like to explore. Free, and a few minutes.</p>
              </div>
            </li>
            <li>
              <div>
                <b>A person reads it</b>
                <p>Someone on the BNC team reviews every request. No automated filters.</p>
              </div>
            </li>
            <li>
              <div>
                <b>We share the next step</b>
                <p>Usually an invitation to an experience that fits you, with the price shown up front.</p>
              </div>
            </li>
          </ol>
          <div className="hr-join-stay">
            <SubscribeForm variant="city" source="home" id="home-stay" label="Not ready yet? Stay connected: get new experiences in your city by email." />
          </div>
        </div>
      </section>

      {/* ───── 11. Why BNC exists ───── */}
      <section className="hr-founder" aria-labelledby="why-title">
        <div className="hr-wrap hr-founder-grid">
          <div className="hr-photo">
            <Image src={PHOTOS.roomG.src} alt={PHOTOS.roomG.alt} fill sizes="(max-width: 900px) 70vw, 30vw" />
          </div>
          <div className="hr-founder-text">
            <h2 id="why-title" className="hr-d2">
              Because growth doesn&rsquo;t happen in isolation.
            </h2>
            <div className="hr-why-body">
              <p>We started BNC with a simple belief. The people you meet can influence the things you build, the opportunities you discover and the way you see the world.</p>
              <p>But meaningful relationships don&rsquo;t happen by accident. They happen when the right people come together with the right intention.</p>
              <p>BNC exists to create more of those moments, across cities, industries and experiences.</p>
            </div>
            <p className="hr-founder-cite">
              <b>Isha Vijay Ostwal</b>
              <span>Founder, {SITE.name} · National Convenor, JIIF (JITO Apex) · Global Shaper, World Economic Forum</span>
            </p>
          </div>
        </div>
      </section>

      {/* ───── 12. FAQ ───── */}
      <section className="hr-faq" aria-labelledby="faq-title">
        <div className="hr-wrap hr-faq-grid">
          <div>
            <h2 id="faq-title" className="hr-d2">
              Questions people ask.
            </h2>
            <p style={{ marginTop: 24 }}>
              <Link href="/faq" className="hr-link">
                All questions
              </Link>
            </p>
          </div>
          <div className="hr-faq-list">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* ───── 13. Final CTA ───── */}
      <section className="hr-final" aria-labelledby="final-title">
        <div className="hr-wrap">
          <h2 id="final-title" className="hr-d1">
            A network worth being part of.
          </h2>
          <p className="hr-lede">The right rooms change everything. The right people make it happen.</p>
          <div className="hr-ctas">
            <PrimaryCta size="lg" placement="home-closing" className="hr-btn hr-btn-primary" />
          </div>
        </div>
      </section>
    </>
  );
}
