import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CHARTER, CURATION, HERO, INDUSTRIES, MISSION, PILLARS, SECONDARY_CTA, SITE, STATS, TAGLINE } from "@/content/site";
import { ALL_EVENT_PHOTOS, PHOTOS } from "@/content/photos";
import { FAQ } from "@/content/faq";
import { getChapters, getSponsors, getStories, getUpcomingEvents, isPlaceholder } from "@/lib/data";
import { fmtTime } from "@/lib/format";
import { pageMeta, orgJsonLd } from "@/lib/seo";
import { PrimaryCta } from "@/components/site/primary-cta";
import { JsonLd } from "@/components/site/json-ld";
import { Seal } from "@/components/site/logo";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { Seats } from "@/components/house/seats";
import { InView } from "@/components/house/in-view";
import { SeatingPlan } from "@/components/house/seating-plan";
import { CityLights, type CityPin } from "@/components/house/city-lights";

export const revalidate = 600; // ISR; must be a literal (matches REVALIDATE in lib/data.ts)

export const metadata: Metadata = {
  ...pageMeta({
    title: "The right rooms change everything",
    ogTitle: "The right rooms change everything. The right people make it happen.",
    description: `${HERO.lede} ${STATS.items[0].value} members across ${STATS.items[1].value} cities as of ${STATS.asOf}. Free to join; rooms are paid.`,
    path: "/",
  }),
  title: { absolute: "Bombay Networking Circle — the right rooms change everything" },
};

const HOME_FAQ = ["Is it free?", "Who can join?", "What happens after I request access?", "Do I need a startup?", "How are rooms curated?", "Is there a WhatsApp group?"];

/** The kinds of people at a BNC table. Archetypes, not individual members. */
const PLACE_CARDS = [
  { title: "The D2C founder", meta: "Building a consumer brand", want: "retail and distribution partners" },
  { title: "The RevOps lead", meta: "Scaling sales at a B2B startup", want: "peers who've done it before" },
  { title: "The brand designer", meta: "Runs an independent studio", want: "early-stage clients" },
  { title: "The angel", meta: "Writes first cheques", want: "founders before the round" },
];

const ROMAN = ["i.", "ii.", "iii.", "iv."];
const day = (iso: string) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" }).format(new Date(iso));

export default async function HomePage() {
  const [chapters, rooms, stories, sponsors] = await Promise.all([getChapters(), getUpcomingEvents({ limit: 3 }), getStories(), getSponsors()]);
  const faq = HOME_FAQ.flatMap((q) => FAQ.filter((f) => f.q === q));
  const story = stories.find((s) => s.is_published && !isPlaceholder(s));
  const logos = sponsors.filter((s) => s.is_published && s.logo && !isPlaceholder(s));
  const pins: CityPin[] = chapters.map((c) => ({
    slug: c.slug,
    city: c.city,
    tag: c.is_flagship ? "Flagship · where it started" : "Chapter",
    lat: c.latitude,
    lng: c.longitude,
    flagship: c.is_flagship,
  }));
  const [members, cities] = STATS.items;

  return (
    <>
      <JsonLd data={orgJsonLd()} />

      {/* ───── 1. Hero: the table ───── */}
      <section className="hr-hero" aria-labelledby="hero-title">
        <div className="hr-wrap hr-hero-grid">
          <div className="hr-hero-copy">
            <p className="hr-hero-meta">
              Est. {SITE.founded}, Mumbai. Now {cities.value} cities and {members.value} members.
            </p>
            <h1 id="hero-title" className="hr-d1">
              The right rooms change everything.<span className="hr-second">The right people make it happen.</span>
            </h1>
            <p className="hr-lede">{HERO.lede} We seat you at a small, hosted table with people worth meeting, then make sure the conversation keeps going after you leave.</p>
            <div className="hr-ctas">
              <PrimaryCta size="lg" placement="home-hero" className="hr-btn hr-btn-primary" />
              <Link href={SECONDARY_CTA.href} className="hr-btn hr-btn-quiet">
                {SECONDARY_CTA.label}
              </Link>
            </div>
            <p className="hr-hero-fine">
              <strong>Free to join.</strong> Rooms are paid, and the price is on the menu before you sit down.
            </p>
          </div>
          <figure className="hr-table-wrap">
            <svg className="hr-steam" viewBox="0 0 60 50" aria-hidden="true">
              <path d="M15 48c-6-10 6-14 0-24s6-14 0-22" />
              <path d="M30 48c-6-10 6-14 0-24s6-14 0-22" />
              <path d="M45 48c-6-10 6-14 0-24s6-14 0-22" />
            </svg>
            <div className="hr-table" aria-hidden="true">
              <div className="hr-table-top hr-photo">
                <Image src={PHOTOS.roomG.src} alt="" fill priority sizes="(max-width: 900px) 80vw, 420px" />
              </div>
              <Seats count={30} radius={46.5} matches={[4, 11, 19]} />
            </div>
            <figcaption className="hr-table-caption">
              <b>Table for 30.</b> Every seat chosen for a reason.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ───── 2. What is BNC: the bill ───── */}
      <section className="hr-bill-section" aria-labelledby="bill-title">
        <div className="hr-wrap hr-bill-grid">
          <div className="hr-bill-intro">
            <h2 id="bill-title" className="hr-d2">
              Here&rsquo;s the whole deal, on one bill.
            </h2>
            <p className="hr-lede">No membership fee. No pitch decks at the door. You pay for the room you sit in, and nothing else.</p>
          </div>
          <article className="hr-bill" aria-label="What BNC is, as a bill">
            <header>
              <Seal />
              <p>{SITE.name} · Table 1</p>
            </header>
            <dl>
              <div className="hr-bill-line" data-wide="">
                <dt>Who</dt>
                <dd>Founders, operators and creators building something.</dd>
              </div>
              <div className="hr-bill-line" data-wide="">
                <dt>How</dt>
                <dd>Small, hosted rooms in your city. One theme, about 30 seats.</dd>
              </div>
              <div className="hr-bill-line" data-wide="">
                <dt>You get</dt>
                <dd>Introductions that continue after the room.</dd>
              </div>
              <div className="hr-bill-line">
                <dt>Joining</dt>
                <span className="hr-dots" />
                <dd>₹0</dd>
              </div>
              <div className="hr-bill-line">
                <dt>A room</dt>
                <span className="hr-dots" />
                <dd>priced up front</dd>
              </div>
              <div className="hr-bill-line">
                <dt>Follow-ups</dt>
                <span className="hr-dots" />
                <dd>on the house</dd>
              </div>
            </dl>
            <div className="hr-bill-total">
              <span>To join today</span>
              <span>
                ₹0<small>Rooms are paid separately.</small>
              </span>
            </div>
            <p className="hr-bill-thanks">Thank you. Visit again.</p>
          </article>
        </div>
      </section>

      {/* ───── 3. Inside BNC ───── */}
      <section className="hr-inside" aria-labelledby="inside-title">
        <div className="hr-wrap hr-inside-grid">
          <div className="hr-photo">
            <Image src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} fill sizes="(max-width: 900px) 100vw, 66vw" />
          </div>
          <div className="hr-inside-card">
            <h2 id="inside-title" className="hr-d3">
              A network you experience. Not just a community you join.
            </h2>
            <ol className="hr-pillars">
              {PILLARS.map((p, i) => (
                <li key={p.title}>
                  <span>{ROMAN[i]}</span>
                  <div>
                    <h3>{p.title.charAt(0) + p.title.slice(1).toLowerCase()}</h3>
                    <p>{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/inside" className="hr-link hr-inside-link">
              What happens in a room
            </Link>
          </div>
        </div>
      </section>

      {/* ───── 4. How a room is curated: the seating plan ───── */}
      <section className="hr-plan" aria-labelledby="plan-title">
        <div className="hr-wrap hr-plan-grid">
          <div className="hr-plan-head">
            <h2 id="plan-title" className="hr-d2">
              Nobody gets a random seat.
            </h2>
            <p className="hr-lede">Every room is planned like a dinner table. Four decisions, made before you walk in.</p>
          </div>
          <SeatingPlan steps={CURATION} />
        </div>
      </section>

      {/* ───── 5. Who's in the circle ───── */}
      <section className="hr-circle" aria-labelledby="members-title">
        <div className="hr-wrap">
          <div className="hr-head-row">
            <h2 id="members-title" className="hr-d2">
              Who&rsquo;s at the table.
            </h2>
            <Link href="/members" className="hr-link">
              Browse members
            </Link>
          </div>
          <p className="hr-industries">
            {INDUSTRIES.filter((i) => i !== "Other").map((i, n) => (
              <Fragment key={i}>
                {n > 0 && <span aria-hidden="true">/</span>}
                {i}
              </Fragment>
            ))}
          </p>
          <ul className="hr-place-cards">
            {PLACE_CARDS.map((c) => (
              <li key={c.title} className="hr-place">
                <div className="hr-fold" />
                <div className="hr-place-body">
                  <h3 className="hr-d4">{c.title}</h3>
                  <p className="hr-place-meta">{c.meta}</p>
                  <p className="hr-place-want">
                    <b>Looking for</b> {c.want}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="hr-caption" style={{ marginTop: 48 }}>
            The kinds of people you&rsquo;ll sit with. Member profiles appear only with each member&rsquo;s consent.
          </p>
        </div>
      </section>

      {/* ───── 6. The Circle in Motion ───── */}
      <section className="hr-story" aria-labelledby="story-title">
        <div className="hr-wrap hr-story-grid">
          <div className="hr-story-head">
            <h2 id="story-title" className="hr-d2">
              The Circle in Motion.
            </h2>
            <p className="hr-lede">{story ? story.headline : "What one good introduction looks like."}</p>
          </div>
          <InView className="hr-story-diagram">
            <svg className="hr-intro-svg" viewBox="0 0 640 200" aria-hidden="true">
              <path className="hr-linkline" d="M110 100 C 230 10, 410 10, 530 100" />
              <circle className="hr-spark" cx="320" cy="34" r="7" />
              <circle className="hr-person" cx="80" cy="100" r="36" />
              <text x="80" y="105" textAnchor="middle">
                A
              </text>
              <circle className="hr-person" cx="560" cy="100" r="36" />
              <text x="560" y="105" textAnchor="middle">
                B
              </text>
              <text className="hr-role" x="44" y="170" textAnchor="start">
                someone with an ask
              </text>
              <text className="hr-role" x="596" y="170" textAnchor="end">
                someone who can help
              </text>
            </svg>
            <div className="hr-story-cols">
              {story ? (
                <>
                  <div>
                    <h3 className="hr-d4">The people</h3>
                    <p>{story.problem}</p>
                  </div>
                  <div>
                    <h3 className="hr-d4">The connection</h3>
                    <p>{story.connection}</p>
                  </div>
                  <div>
                    <h3 className="hr-d4">What happened next</h3>
                    <p>{story.outcome}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="hr-d4">The ask</h3>
                    <p>Everyone arrives with one specific ask: a hire, a client, a partner, a piece of advice.</p>
                  </div>
                  <div>
                    <h3 className="hr-d4">The connection</h3>
                    <p>The host listens, then seats and introduces the two people who should meet.</p>
                  </div>
                  <div>
                    <h3 className="hr-d4">What happens next</h3>
                    <p>Within a week, someone writes the next message. That&rsquo;s where collaborations start.</p>
                  </div>
                </>
              )}
            </div>
            <p className="hr-story-more">
              <Link href="/stories" className="hr-link">
                Stories from the circle
              </Link>
            </p>
          </InView>
        </div>
      </section>

      {/* ───── 7. The Charter: house rules ───── */}
      <section className="hr-rules hr-dark" aria-labelledby="rules-title">
        <div className="hr-wrap">
          <div className="hr-board">
            <header>
              <span className="hr-plate">House rules · {SITE.name}</span>
              <h2 id="rules-title" className="hr-d2">
                How we show up.
              </h2>
            </header>
            <ol>
              {CHARTER.map((c) => (
                <li key={c.title}>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <footer>
              <span>By order, the hosts.</span>
              <span>Everyone who requests access agrees to these.</span>
            </footer>
          </div>
        </div>
      </section>

      {/* ───── 8. Chapters ───── */}
      <section className="hr-cities" aria-labelledby="cities-title">
        <div className="hr-wrap hr-cities-grid">
          <CityLights cities={pins} />
        </div>
      </section>

      {/* ───── From the rooms: every photo ───── */}
      <section className="hr-wall" aria-labelledby="wall-title">
        <div className="hr-wrap">
          <div className="hr-head-row">
            <h2 id="wall-title" className="hr-d3">
              From the rooms.
            </h2>
            <p className="hr-caption">
              {STATS.items[2].value} {STATS.items[2].label} as of {STATS.asOf}.
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

      {/* ───── 9. Upcoming rooms: the menu board ───── */}
      <section className="hr-menu-sec" aria-labelledby="menu-title">
        <div className="hr-wrap">
          <div className="hr-menu hr-dark">
            <header>
              <div>
                <span className="hr-plate">On the menu</span>
                <h2 id="menu-title" className="hr-d2">
                  Upcoming rooms.
                </h2>
              </div>
              <p>Small, hosted, one theme each. Members hear first; prices are always shown.</p>
            </header>
            {rooms.length ? (
              rooms.map((r) => (
                <Link key={r.id} href={`/rooms/${r.slug}`} className="hr-room-row">
                  <span className="hr-room-when">
                    <b>{day(r.starts_at)}</b>
                    {r.chapter.city} · {fmtTime(r.starts_at)}
                  </span>
                  <span className="hr-room-what">
                    <span className="hr-room-title">{r.title}</span>
                    <span className="hr-leader" />
                    <span className="hr-room-sub">{[r.who_attends, r.capacity ? `${r.capacity} seats` : null].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="hr-room-price">
                    {r.price_inr != null ? `₹${r.price_inr.toLocaleString("en-IN")}` : "₹—"}
                    <small>{r.price_inr != null ? "per seat" : "price on invite"}</small>
                  </span>
                </Link>
              ))
            ) : (
              <div className="hr-menu-empty">
                <b>The next menu is being written.</b>
                New rooms go to members first. Request access, or leave your email below, and you&rsquo;ll hear when your city has a date.
              </div>
            )}
            <footer>
              <span>Every room page shows the price before you commit.</span>
              <Link href="/rooms" className="hr-link">
                All rooms
              </Link>
            </footer>
          </div>
        </div>
      </section>

      {/* ───── 10. Founder ───── */}
      <section className="hr-founder" aria-labelledby="founder-title">
        <div className="hr-wrap hr-founder-grid">
          <div className="hr-photo">
            <Image src={PHOTOS.founder.src} alt={PHOTOS.founder.alt} fill sizes="(max-width: 900px) 70vw, 30vw" />
          </div>
          <div className="hr-founder-text">
            <h2 id="founder-title" className="sr-only">
              The mission
            </h2>
            <p className="hr-founder-q">
              <span className="hr-mark">“</span>
              {MISSION.line}
              <span className="hr-mark">”</span>
            </p>
            <p className="hr-founder-body">
              {SITE.name} started in Mumbai in {SITE.founded} with one idea: smaller rooms, one theme, a host who makes the introductions, and everyone saying out loud what they need.
            </p>
            <p className="hr-founder-cite">
              <b>Isha Vijay Ostwal</b>
              <span>Founder · National Convenor, JIIF (JITO Apex) · Global Shaper, World Economic Forum</span>
            </p>
            <p style={{ marginTop: 24 }}>
              <Link href="/about/story" className="hr-link">
                Read our story
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ───── 11. Partners ───── */}
      <section className="hr-partners" aria-labelledby="partners-title">
        <div className="hr-wrap">
          <div className="hr-partners-row">
            <h2 id="partners-title" className="sr-only">
              Partners
            </h2>
            <p>
              Want your brand at the table? <em>Rooms are open to sponsors who add something to them.</em>
            </p>
            <Link href="/sponsor" className="hr-btn hr-btn-quiet">
              Sponsor a room
            </Link>
          </div>
          {logos.length > 0 && (
            <div className="hr-logos">
              {logos.map((s) => (
                // eslint-disable-next-line @next/next/no-img-element -- partner logos vary in size; plain img keeps them crisp
                <img key={s.id} src={s.logo!} alt={s.name} loading="lazy" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───── 12. FAQ ───── */}
      <section className="hr-faq" aria-labelledby="faq-title">
        <div className="hr-wrap hr-faq-grid">
          <div>
            <h2 id="faq-title" className="hr-d2">
              Fair questions.
            </h2>
            <p style={{ marginTop: 24 }}>
              <Link href="/faq" className="hr-link">
                All questions
              </Link>
            </p>
          </div>
          <div className="hr-faq-list">
            {faq.map((f) => (
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
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* ───── 13. Close: the empty seat ───── */}
      <section className="hr-close" aria-labelledby="close-title">
        <div className="hr-wrap">
          <div className="hr-mini-table" aria-hidden="true">
            <div className="hr-table-top" />
            <Seats count={10} radius={44} you={7} />
          </div>
          <h2 id="close-title" className="hr-d1">
            Pull up a chair.
          </h2>
          <p className="hr-lede">There&rsquo;s a seat at the next table with your name on it. Tell us who you are and we&rsquo;ll find it.</p>
          <PrimaryCta size="lg" placement="home-closing" className="hr-btn hr-btn-primary" />
          <div className="hr-signup">
            <SubscribeForm variant="city" source="home" id="home-next-room" label="Not ready? Get the next room in your city by email." />
          </div>
          <p className="hr-caption" style={{ marginTop: 48 }}>
            {TAGLINE}
          </p>
        </div>
      </section>
    </>
  );
}
