import p1 from "@/assets/EminentImages/photoGraphy1.jpg";
import p2 from "@/assets/EminentImages/photoGraphy2.jpg";
import p3 from "@/assets/EminentImages/photoGraphy3.jpg";
import p4 from "@/assets/EminentImages/photoGraphy4.jpg";
import p5 from "@/assets/EminentImages/photoGraphy5.jpg";
import p6 from "@/assets/EminentImages/photoGraphy6.jpg";
import p7 from "@/assets/EminentImages/photoGraphy7.jpg";
import cover from "@/assets/EminentImages/eminentMagazineCover.jpg";
import pageantWinner from "@/assets/EminentImages/immediatePastQueen.jpg";
import pageantQueens from "@/assets/EminentImages/76f0213c-390c-4617-819e-50411b931704.jpg";

import hero from "@/assets/em-hero.jpg";
import storyFashion from "@/assets/em-story-fashion.jpg";
import storyPhoto from "@/assets/em-story-photo.jpg";
import storyModel from "@/assets/em-story-model.jpg";
import storyCulture from "@/assets/em-story-culture.jpg";
import storyLifestyle from "@/assets/em-story-lifestyle.jpg";
import services from "@/assets/services-videography.jpg";
import magStack from "@/assets/magazine-stack.jpg";

export interface WorkSample {
  img: string;
  title: string;
  meta: string;
}

export const WORKS: Record<string, WorkSample[]> = {
  fashion: [
    { img: p1, title: "Traditional Bridal Portrait", meta: "Studio · Awka" },
    { img: p2, title: "White Lace Editorial", meta: "Couple session" },
    { img: p7, title: "Ikemba Okwuazu Ceremony", meta: "Traditional wedding" },
    { img: p4, title: "Eminent Ready-to-Wear", meta: "Brand campaign" },
    { img: storyFashion, title: "Runway Coverage", meta: "Fashion week" },
    { img: storyModel, title: "Aso Oke, Reimagined", meta: "Studio series" },
  ],
  lifestyle: [
    { img: p5, title: "Retro Interior Session", meta: "Lifestyle set build" },
    { img: p6, title: "Celebration Portrait", meta: "Studio · Colour backdrop" },
    { img: storyLifestyle, title: "Quiet Luxury Series", meta: "Editorial" },
    { img: hero, title: "A Weekend in Awka", meta: "Location shoot" },
    { img: magStack, title: "The Home as a Set", meta: "Interiors" },
    { img: services, title: "Holiday Diaries", meta: "Film" },
  ],
  entertainment: [
    { img: p3, title: "Edition 21 Feature", meta: "Cover story shoot" },
    { img: pageantWinner, title: "13th Face of Eminent Winner", meta: "Awards night" },
    { img: storyCulture, title: "Red Carpet Coverage", meta: "Awards season" },
    { img: services, title: "Cool C Traditional Wedding", meta: "Eminent TV" },
    { img: storyPhoto, title: "The Eminent TV Year", meta: "Event films" },
    { img: hero, title: "Sound of the South-East", meta: "Music feature" },
  ],
  photography: [
    { img: p7, title: "Golden Backdrop Portrait", meta: "Studio lighting" },
    { img: p2, title: "All-White Couple Session", meta: "Location" },
    { img: p6, title: "Joy in Coral", meta: "One-light portrait" },
    { img: p1, title: "Bridal Detail Study", meta: "Studio" },
    { img: p5, title: "Set Design Portrait", meta: "Concept shoot" },
    { img: p4, title: "Daylight Portraiture", meta: "Window light" },
  ],
  modelling: [
    { img: pageantQueens, title: "Face of Eminent & Brand Ambassador", meta: "Pageant portraits" },
    { img: pageantWinner, title: "Queen Michelle Kenneth", meta: "Crowning night" },
    { img: storyModel, title: "Academy New Faces", meta: "Portfolio session" },
    { img: p5, title: "Composite Card Set", meta: "Studio" },
    { img: p6, title: "Poise & Posture Training", meta: "Academy" },
    { img: storyPhoto, title: "Casting Test Shots", meta: "Digitals" },
  ],
  "media-pr": [
    { img: cover, title: "Eminent Magazine, Edition 26", meta: "Cover & print production" },
    { img: p3, title: "Edition 21 in Circulation", meta: "Distribution campaign" },
    { img: magStack, title: "Branding & Print", meta: "In-house press" },
    { img: pageantWinner, title: "Event Media Coverage", meta: "Awards & fashion show" },
    { img: services, title: "Video Production", meta: "Full crew coverage" },
    { img: hero, title: "Advertising Campaigns", meta: "Online & in print" },
  ],
};

export function getWorks(slug: string): WorkSample[] {
  return WORKS[slug] ?? [];
}
