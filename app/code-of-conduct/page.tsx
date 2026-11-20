import type { Metadata } from "next";
import { CONTACT } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = pageMeta({
  title: "Code of conduct",
  description: "How everyone at Bombay Networking Circle events and community channels is expected to behave, how to report a problem, and what happens next.",
  path: "/code-of-conduct",
});

export default function ConductPage() {
  return (
    <LegalPage
      title="Code of conduct"
      path="/code-of-conduct"
      updated="20 November 2026"
      intro="BNC rooms work because people trust them. This code applies to everyone — members, guests, hosts, speakers, sponsors and partners — at every BNC event and in every BNC community channel, including the WhatsApp community."
    >
      <h2>The short version</h2>
      <ol>
        <li>Help before you ask.</li>
        <li>No pitching services to the room.</li>
        <li>Introductions are made with both people&apos;s agreement.</li>
        <li>Respect everyone&apos;s time, data and boundaries.</li>
      </ol>

      <h2>What we expect</h2>
      <ul>
        <li>Be specific about what you need and generous with what you know.</li>
        <li>Listen to other people&apos;s asks; make an introduction if you can.</li>
        <li>Treat everyone with respect regardless of gender, gender identity, sexual orientation, disability, appearance, age, caste, religion, region, language or background.</li>
        <li>Ask before you take someone&apos;s photo, record them, or share their contact details.</li>
        <li>Keep what&apos;s shared in confidence in the room, in the room.</li>
      </ul>

      <h2>What isn&apos;t allowed</h2>
      <ul>
        <li>Harassment of any kind: unwelcome sexual attention or contact, intimidation, stalking, slurs, or offensive comments.</li>
        <li>Discrimination, or jokes and content that demean any group.</li>
        <li>Hard selling: pitching services to the room, mass direct-messaging members, or adding members to lists or groups without consent.</li>
        <li>Scraping or exporting member details from WhatsApp groups or event guest lists.</li>
        <li>Misrepresenting yourself, your company or your relationship with BNC.</li>
        <li>Attending while intoxicated to the point of disrupting others.</li>
      </ul>

      <h2>In the WhatsApp community</h2>
      <ul>
        <li>Post asks and offers that are specific and useful. One post per ask; no repeated promotions.</li>
        <li>Take one-to-one conversations to direct messages — only when the other person has agreed to talk.</li>
        <li>No forwards, chain messages, political content or unrelated links.</li>
      </ul>

      <h2>Reporting a problem</h2>
      <p>
        At an event, tell the host or any BNC organiser — they will act straight away. Afterwards, or about a community channel, email{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with &ldquo;Conduct&rdquo; in the subject. Include what happened, when, and who was
        involved if you know. You can report anonymously, though it limits how much we can follow up.
      </p>
      <p>We treat every report confidentially and share details only with the people who need them to act. We will not tolerate retaliation against anyone who reports in good faith.</p>

      <h2>What happens next</h2>
      <p>Depending on what happened, BNC may:</p>
      <ul>
        <li>talk to the person and give a warning;</li>
        <li>ask them to leave an event, without refund where a fee was paid;</li>
        <li>remove them from community channels;</li>
        <li>bar them from future events;</li>
        <li>where a law may have been broken, support the person affected in going to the police.</li>
      </ul>
      <p>We aim to acknowledge reports within 48 hours and tell the person who reported what we did, while respecting everyone&apos;s privacy.</p>
    </LegalPage>
  );
}
