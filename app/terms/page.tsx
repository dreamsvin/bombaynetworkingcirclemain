import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, SITE } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = pageMeta({
  title: "Terms of use",
  description: "The terms for using the Bombay Networking Circle website, attending BNC events and joining the BNC community.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      path="/terms"
      updated="20 November 2026"
      intro={`These terms apply when you use this website, RSVP to or attend a ${SITE.name} ("BNC") event, or join a BNC community channel. By doing any of those, you agree to them. If you don't agree, please don't use the site or attend.`}
    >
      <h2>1. What BNC is</h2>
      <p>
        BNC is a community-led network that organises small, hosted, in-person rooms for founders, operators, freelancers, creators and students in cities across
        India. Joining is free; rooms are paid, and each room shows its price before you commit. BNC is not a recruitment agency, investment adviser or broker, and nothing said at an event or on this site is
        professional, legal, financial or investment advice.
      </p>

      <h2>2. Events</h2>
      <ul>
        <li>RSVPs are handled on Luma. An RSVP does not guarantee a place where capacity is limited; hosts may confirm, waitlist or decline.</li>
        <li>Event details (date, venue, agenda, speakers) can change. We&apos;ll update the event page and notify registered guests where we can.</li>
        <li>Rooms are paid. The price is shown on the room page and in your invite, and any refund terms are shown before you pay.</li>
        <li>You attend at your own risk and are responsible for your belongings, travel and conduct. Venues may have their own rules.</li>
        <li>Everyone who attends agrees to the <Link href="/code-of-conduct">code of conduct</Link>. Hosts may ask anyone who breaks it to leave.</li>
      </ul>

      <h2>3. Photography and recording</h2>
      <p>
        BNC may photograph or film events and use the images to report on and promote BNC. Hosts announce this at the start of an event. Tell the host,
        or email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, if you don&apos;t want to appear and we will not publish identifiable images of
        you. Don&apos;t record other attendees, talks or private conversations without their permission.
      </p>

      <h2>4. Community channels</h2>
      <p>
        The WhatsApp community and any other BNC channels are run under the code of conduct. Admins may remove messages or members who break it. Other
        members can see your name and phone number in WhatsApp groups; share only what you are comfortable sharing.
      </p>

      <h2>5. Introductions and collaborations</h2>
      <p>
        BNC hosts make introductions in good faith. Any agreement you reach with another member — employment, investment, partnership, client work — is
        between you and them. BNC is not a party to it and is not responsible for its outcome. Do your own due diligence.
      </p>

      <h2>6. Content you share</h2>
      <p>
        If you submit a story, quote, photo or other content for BNC to publish, you confirm you have the right to share it and give BNC a non-exclusive,
        royalty-free licence to publish it on BNC&apos;s site and channels. We publish only with your written consent, and you can ask us to remove it at
        any time.
      </p>

      <h2>7. This website</h2>
      <ul>
        <li>The BNC name, logo and site content belong to BNC or its licensors. Don&apos;t use them to suggest BNC endorses you without our permission.</li>
        <li>Don&apos;t misuse the site: no scraping of personal data, spam through the forms, attempts to break security, or automated abuse.</li>
        <li>We try to keep information accurate, including the figures we publish (each carries an as-of date), but the site is provided as is.</li>
        <li>Links to other sites (Luma, WhatsApp, partners) are provided for convenience; their terms apply there.</li>
      </ul>

      <h2>8. Liability</h2>
      <p>
        To the extent the law allows, BNC is not liable for indirect or consequential loss arising from your use of the site, attendance at events, or
        dealings with other members. Nothing in these terms limits liability that cannot be limited under Indian law.
      </p>

      <h2>9. Personal data</h2>
      <p>
        How we handle personal data is set out in our <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in Mumbai, Maharashtra have jurisdiction over any dispute.</p>

      <h2>11. Changes and contact</h2>
      <p>
        We may update these terms; the date above shows the latest version. Questions: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </p>
    </LegalPage>
  );
}
