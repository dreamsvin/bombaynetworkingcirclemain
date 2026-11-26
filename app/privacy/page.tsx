import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, SITE } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  description: "How Bombay Networking Circle collects, uses, stores and protects personal data, and your rights under India's Digital Personal Data Protection Act, 2023.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      path="/privacy"
      updated="20 November 2026"
      intro={`${SITE.name} ("BNC", "we") is a community for founders and builders in India that is free to join and runs small, paid rooms (events). This policy explains what personal data we collect, why, who we share it with, how long we keep it, and the rights you have. We process personal data in line with India's Digital Personal Data Protection Act, 2023 (DPDP Act) and the rules made under it.`}
    >
      <h2>1. Who is responsible</h2>
      <p>
        BNC is the data fiduciary for personal data collected through this website and our events. For any privacy question or request, write to{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with &ldquo;Privacy&rdquo; in the subject line. This address also reaches our grievance
        contact (section 9).
      </p>

      <h2>2. What we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Request access:</strong> name, email, city, role and what you&apos;re building, and optionally phone number, company, industry,
          LinkedIn link, what you&apos;re looking for and how you heard about BNC, plus the time you agreed to the BNC Charter. We use it only to match
          you to a room; it is never shown publicly.
        </li>
        <li>
          <strong>Forms</strong> (contact, sponsorship, partnership, start-a-chapter): name, email, and optionally phone number, city, organisation and your
          message.
        </li>
        <li>
          <strong>Email updates and RSVP reminders:</strong> your email address, optionally your city, and which page you signed up from.
        </li>
        <li>
          <strong>Member profiles and stories</strong> (only if you agree to be featured): name, role, company, city, photo, LinkedIn link, and the story
          or quote you approved.
        </li>
      </ul>
      <h3>Information collected through third-party services</h3>
      <ul>
        <li>
          <strong>Event registration</strong> runs on Luma. When you RSVP, Luma collects the details its form asks for and shares the guest list with BNC
          as the event host. Luma&apos;s own privacy policy also applies.
        </li>
        <li>
          <strong>The WhatsApp community</strong> runs on WhatsApp (Meta). Members of a group can see each other&apos;s phone numbers and names as WhatsApp
          displays them. WhatsApp&apos;s privacy policy applies.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <p>
        We use Vercel Web Analytics to count page views and a few named actions (for example, clicking &ldquo;Request access&rdquo; or an RSVP link).
        It does not use cookies and does not build a profile of you across sites. Our hosting provider keeps short-lived server logs (including IP
        address) for security and to stop abuse such as form spam.
      </p>
      <h3>Photos at events</h3>
      <p>
        We photograph some events and use the photos on this site and our social channels. Hosts announce photography at the start of each event. If you
        don&apos;t want to appear, tell the host or email us and we will remove or not publish images where you can be identified.
      </p>

      <h2>3. Why we use it</h2>
      <ul>
        <li>To reply to you and handle your enquiry or application.</li>
        <li>To send event reminders and updates you asked for (you can unsubscribe at any time).</li>
        <li>To run events: managing RSVPs, check-in and introductions between members.</li>
        <li>To publish member stories and quotes — only with your written consent, recorded with a date.</li>
        <li>To keep the site and forms secure and stop spam and abuse.</li>
        <li>To understand, in aggregate, which pages and events are useful.</li>
      </ul>
      <p>
        Our basis is your consent, which you give when you submit a form or opt in, and which you can withdraw at any time. We do not sell personal data
        and we do not share member contact details with sponsors.
      </p>

      <h2>4. Who we share it with</h2>
      <p>We use these service providers (data processors) to run BNC. They process data on our instructions:</p>
      <ul>
        <li>Supabase — database hosting for form submissions and subscriber lists.</li>
        <li>Vercel — website hosting and privacy-friendly analytics.</li>
        <li>Luma — event listings, RSVPs and reminders.</li>
        <li>An email delivery provider — confirmation and update emails.</li>
        <li>WhatsApp (Meta) — the community group you choose to join.</li>
      </ul>
      <p>
        Some of these providers store data outside India. Where they do, we rely on the transfer being permitted under the DPDP Act and on the provider&apos;s
        security commitments. We may also disclose data if Indian law requires it.
      </p>

      <h2>5. How long we keep it</h2>
      <ul>
        <li>Enquiries and applications: up to 24 months after our last exchange, then deleted.</li>
        <li>Email subscriptions: until you unsubscribe; unconfirmed sign-ups are deleted after 30 days.</li>
        <li>Published stories, quotes and profiles: until you ask us to remove them.</li>
        <li>Server logs: as short as our hosting provider allows, typically days.</li>
      </ul>

      <h2>6. Your rights</h2>
      <p>Under the DPDP Act you can:</p>
      <ul>
        <li>ask what personal data we hold about you and how we use it;</li>
        <li>ask us to correct, complete or update it;</li>
        <li>ask us to erase it, and withdraw consent at any time (this doesn&apos;t affect anything we did before you withdrew);</li>
        <li>nominate another person to exercise your rights if you die or become unable to;</li>
        <li>raise a grievance with us, and then with the Data Protection Board of India if you are not satisfied.</li>
      </ul>
      <p>
        Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. We will respond within 30 days.
      </p>

      <h2>7. Security</h2>
      <p>
        Form data is stored in a database that the public website cannot read: access is restricted at the database level, and only BNC organisers with a
        need to see it can. Connections are encrypted. No system is perfectly secure; if a breach affecting your data occurs, we will notify you and the
        Data Protection Board as the law requires.
      </p>

      <h2>8. Children</h2>
      <p>
        BNC events and this site are meant for adults. We do not knowingly collect personal data from anyone under 18. If you believe a child has given us
        their data, contact us and we will delete it.
      </p>

      <h2>9. Grievances</h2>
      <p>
        Contact our grievance officer at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> (subject: &ldquo;Grievance&rdquo;). We acknowledge
        grievances within 48 hours and aim to resolve them within 30 days.
      </p>

      <h2>10. Changes</h2>
      <p>
        If we change this policy, we will update the date above and, for significant changes, tell subscribers by email. See also our{" "}
        <Link href="/terms">terms</Link> and <Link href="/code-of-conduct">code of conduct</Link>.
      </p>
    </LegalPage>
  );
}
