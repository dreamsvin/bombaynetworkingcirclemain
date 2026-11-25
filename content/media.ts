/**
 * BNC's own photos, posters and video, collected from the team's Google Drive and Gmail (Nov 2026) and processed once
 * into public/media/ (WebP, warm grade per the brand guidelines; video H.264, muted). Sources:
 *  - Career Connect – Delhi: Drive folders "BNC X Re-Defined DELHI 10th JAN" and "BNC MASTERS UNION EVENT" (HEIC/MOV originals).
 *  - Pune (Sep 2025) and Nashik (Oct 2025): cropped from the team's recap carousels "Pune_Carousel.jpg" ("BNC Coffee Connect Pune")
 *    and "carousal.jpg" ("BNC Coffee Connect Nashik"). These crops are small — use them at tile sizes only.
 *  - Posters: BNC_Surat_Flyer.jpg, BNC_Hyd_Meetup_.jpg, BNC_Nashik_Meetup_.jpg, BNC_Pune_Meetup (1).jpg.
 * Alt text describes the frame and names no one who has not been identified. Swap in the high-resolution originals when the team has them.
 */
import type { Photo } from "@/content/photos";

const m = (src: string, width: number, height: number, alt: string): Photo => ({ src, width, height, alt });

export const MEDIA = {
  delhi_group: m("/media/events/career-connect-delhi-2026/group.webp", 1600, 1200, "The full room at Career Connect \u2013 Delhi, Masters' Union, Gurugram: about forty members standing together around a long table."),
  delhi_room: m("/media/events/career-connect-delhi-2026/room.webp", 1600, 1200, "Members seated around a long conference table at Career Connect \u2013 Delhi, listening to the hosts."),
  delhi_circle: m("/media/events/career-connect-delhi-2026/circle.webp", 1600, 1200, "The hosts and guest mentors talking with the room at Career Connect \u2013 Delhi."),
  delhi_talk: m("/media/events/career-connect-delhi-2026/talk.webp", 1400, 1050, "Hosts standing in front of the room during the open conversation at Career Connect \u2013 Delhi."),
  delhi_qna: m("/media/events/career-connect-delhi-2026/qna.webp", 1400, 1050, "A guest mentor answers a question from the room at Career Connect \u2013 Delhi."),
  delhi_host: m("/media/events/career-connect-delhi-2026/host.webp", 1000, 1120, "The host, in red, listening to a question at Career Connect \u2013 Delhi."),
  delhi_mentor: m("/media/events/career-connect-delhi-2026/mentor.webp", 1000, 1133, "A guest mentor speaking to members at Career Connect \u2013 Delhi."),
  delhi_panel: m("/media/events/career-connect-delhi-2026/panel.webp", 1400, 1050, "A three-person panel on stage at Masters' Union, Gurugram, with speaker slides on the screen behind."),
  delhi_conversation: m("/media/events/career-connect-delhi-2026/conversation.webp", 1000, 1120, "Two members in conversation at Career Connect \u2013 Delhi."),
  pune_group: m("/media/events/pune-meetup-2025-09/group.webp", 864, 484, "Members of the Pune meetup photographed together in a caf\u00e9 garden under string lights."),
  pune_talk: m("/media/events/pune-meetup-2025-09/talk.webp", 461, 430, "The host speaking to the room at the Pune meetup."),
  pune_circle: m("/media/events/pune-meetup-2025-09/circle.webp", 578, 564, "Members seated in a circle under a yellow canopy, listening to the host at the Pune meetup."),
  pune_hosts: m("/media/events/pune-meetup-2025-09/hosts.webp", 537, 631, "The hosts welcome members in the caf\u00e9 garden at the Pune meetup."),
  pune_chat: m("/media/events/pune-meetup-2025-09/chat.webp", 491, 489, "Two members in conversation at the Pune meetup."),
  pune_intros: m("/media/events/pune-meetup-2025-09/intros.webp", 467, 496, "Members comparing notes during the guided networking round at the Pune meetup."),
  pune_listening: m("/media/events/pune-meetup-2025-09/listening.webp", 442, 622, "A member takes notes during the insights session at the Pune meetup."),
  nashik_room: m("/media/events/nashik-meetup-2025-10/room.webp", 805, 556, "The full room at the Nashik meetup, standing behind round white caf\u00e9 tables."),
  nashik_six: m("/media/events/nashik-meetup-2025-10/members.webp", 751, 750, "Six members of the Nashik meetup smiling together."),
  nashik_seated: m("/media/events/nashik-meetup-2025-10/seated.webp", 489, 483, "Members seated at caf\u00e9 tables during the Nashik meetup."),
  nashik_tables: m("/media/events/nashik-meetup-2025-10/tables.webp", 427, 670, "Members in conversation around caf\u00e9 tables at the Nashik meetup."),
  nashik_lounge: m("/media/events/nashik-meetup-2025-10/lounge.webp", 470, 491, "Members talking in a caf\u00e9 lounge with round mirrored alcoves."),
  nashik_group: m("/media/events/nashik-meetup-2025-10/group.webp", 910, 432, "A group photo of the Nashik meetup room."),
  poster_surat: m("/media/posters/surat-2025-11.webp", 900, 1600, "Poster for the BNC Surat Edition, 9 November 2025: Isha Ostwal and CA Meher Kaur, theme 'Not your regular networking', \u20b9499 including coffee."),
  poster_hyderabad: m("/media/posters/hyderabad-2025-10.webp", 900, 1125, "Poster for the BNC Hyderabad meetup, 5 October 2025, presented by DreamSVin and Thirdspace."),
  poster_nashik: m("/media/posters/nashik-2025-10.webp", 900, 1125, "Poster for the BNC Nashik meetup, 12 October 2025 at Four Lost Cats, College Road, \u20b9499."),
  poster_pune_oct: m("/media/posters/pune-2025-10.webp", 900, 1125, "Poster for the Pune breakfast meetup, 25 October 2025 at Crazy Cheesy, Law College Road."),
} as const;

/** Per-event galleries (keys are event slugs in content/seed.ts). */
export const EVENT_GALLERIES: Record<string, Photo[]> = {
  "career-connect-delhi-2026": [MEDIA.delhi_group, MEDIA.delhi_circle, MEDIA.delhi_host, MEDIA.delhi_panel, MEDIA.delhi_room, MEDIA.delhi_mentor, MEDIA.delhi_talk, MEDIA.delhi_conversation, MEDIA.delhi_qna],
  "pune-meetup-2025-09": [MEDIA.pune_group, MEDIA.pune_talk, MEDIA.pune_circle, MEDIA.pune_hosts, MEDIA.pune_chat, MEDIA.pune_intros, MEDIA.pune_listening],
  "nashik-meetup-2025-10": [MEDIA.nashik_room, MEDIA.nashik_six, MEDIA.nashik_seated, MEDIA.nashik_tables, MEDIA.nashik_lounge, MEDIA.nashik_group],
};

export type Video = { src: string; poster: string; width: number; height: number; label: string; event: string };

export const VIDEOS = {
  room: {
    src: "/media/video/room-delhi-2026.mp4",
    poster: "/media/video/room-delhi-2026-poster.webp",
    width: 1280,
    height: 720,
    label: "The room at Career Connect – Delhi, Masters' Union, Gurugram, January 2026.",
    event: "career-connect-delhi-2026",
  },
  reel: {
    src: "/media/video/reel-delhi-2026.mp4",
    poster: "/media/video/reel-delhi-2026-poster.webp",
    width: 720,
    height: 1280,
    label: "Members and hosts at Career Connect – Delhi, January 2026.",
    event: "career-connect-delhi-2026",
  },
} satisfies Record<string, Video>;
