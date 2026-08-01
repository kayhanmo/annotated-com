import type { MediaType } from "@/lib/annotations";
import { SAMPLE_VIDEOS } from "@/lib/media";

export type DemoSource = {
  id: string;
  mediaType: MediaType;
  url: string;
  domain: string;
  title: string;
  description: string;
  body: string;
  highlight?: string;
  durationSec?: number;
  channel?: string;
  clipVideoUrl?: string;
  defaultStart?: number;
  defaultEnd?: number;
};

export { SAMPLE_VIDEOS };

export const DEMO_SOURCES: DemoSource[] = [
  {
    id: "yt-allin",
    mediaType: "video",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    domain: "youtube.com",
    title: "All-In style debate — Is this an AI bubble?",
    description:
      "Clip a ≤90s moment from long-form video. Exports intentionally at 240p.",
    body: "We're not measuring vibes — we're measuring whether the returns on GPU clusters show up before the cost of capital resets.",
    durationSec: 10,
    channel: "Open media sample",
    clipVideoUrl: SAMPLE_VIDEOS.bunny,
    defaultStart: 1,
    defaultEnd: 9,
  },
  {
    id: "article-fair-use",
    mediaType: "text",
    url: "https://www.eff.org/issues/fair-use",
    domain: "eff.org",
    title: "Fair Use — Electronic Frontier Foundation",
    description: "A plain-language overview of fair use for creators and critics.",
    body: "Fair use is a legal doctrine that promotes freedom of expression by permitting the unlicensed use of copyright-protected works in certain circumstances. Courts consider purpose, nature, amount, and market effect. Commentary, criticism, and transformative uses often weigh in favor of fair use — especially when the secondary work adds new meaning and attributes the original.",
    highlight:
      "Fair use is a legal doctrine that promotes freedom of expression by permitting the unlicensed use of copyright-protected works in certain circumstances.",
  },
  {
    id: "podcast-twist",
    mediaType: "audio",
    url: "https://thisweekinstartups.com/",
    domain: "thisweekinstartups.com",
    title: "This Week in Startups — Founder interview",
    description: "A founder describes discovery as annotation of the open web.",
    body: "The open web is already the largest library humans have ever built. The product opportunity is not more content — it's better marginalia.",
    durationSec: 6,
    channel: "This Week in Startups",
    clipVideoUrl: SAMPLE_VIDEOS.blazes,
    defaultStart: 0,
    defaultEnd: 5,
  },
  {
    id: "article-criticism",
    mediaType: "text",
    url: "https://www.newyorker.com/",
    domain: "newyorker.com",
    title: "Criticism in the feed era",
    description: "Why short, attributed commentary still matters.",
    body: "Criticism is not the opposite of enjoyment; it is the careful documentation of how a work lands in a particular mind at a particular time. When the feed flattens everything into reaction, the durable form is the annotated clip — a fragment with a voice attached.",
    highlight:
      "Criticism is not the opposite of enjoyment; it is the careful documentation of how a work lands in a particular mind at a particular time.",
  },
  {
    id: "yt-shortform",
    mediaType: "video",
    url: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    domain: "youtube.com",
    title: "How short-form commentary actually works",
    description: "Constraints as craft: 90 seconds, low-res, high signal.",
    body: "If your argument needs ten minutes of someone else's footage, you don't have an argument — you have a re-upload.",
    durationSec: 30,
    channel: "Creator Economy Lab",
    clipVideoUrl: SAMPLE_VIDEOS.elephants,
    defaultStart: 2,
    defaultEnd: 20,
  },
  {
    id: "yt-joyride",
    mediaType: "video",
    url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    domain: "youtube.com",
    title: "Product demo moment — clip the reveal",
    description: "Another video source for testing the sidebar clipper.",
    body: "The reveal is the only part worth annotating. Everything else is setup.",
    durationSec: 30,
    channel: "Sample library",
    clipVideoUrl: SAMPLE_VIDEOS.escape,
    defaultStart: 3,
    defaultEnd: 25,
  },
];
