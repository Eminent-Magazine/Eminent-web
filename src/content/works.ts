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

import M1 from "@/assets/EminentImages/fashion1.jpeg";
import M2 from "@/assets/EminentImages/fashion2.jpeg";
import M3 from "@/assets/EminentImages/fashion3.jpeg";
import M4 from "@/assets/EminentImages/fashion4.jpeg";
import M5 from "@/assets/EminentImages/fashion5.jpeg";
import M6 from "@/assets/EminentImages/fashion6.jpeg"; 
import M7 from "@/assets/EminentImages/fashion7.jpeg";
import M8 from "@/assets/EminentImages/fashion8.jpeg";
import M9 from "@/assets/EminentImages/fashion10.jpeg";
import M10 from "@/assets/EminentImages/fashion15.jpeg"; 

import F1 from "@/assets/EminentImages/fashion11.jpeg";
import F2 from "@/assets/EminentImages/fashion12.jpeg";
import F3 from "@/assets/EminentImages/fashion13.jpeg";
import F4 from "@/assets/EminentImages/fashion14.jpeg";
import F5 from "@/assets/EminentImages/fashion16.jpeg";


import E1 from "@/assets/EminentImages/Ent1.jpeg";
import E2 from "@/assets/EminentImages/Ent2.jpeg";
import E3 from "@/assets/EminentImages/Ent3.jpeg";
import E4 from "@/assets/EminentImages/Ent4.jpeg";
import E5 from "@/assets/EminentImages/Ent5.jpeg";


import L1 from "@/assets/EminentImages/fashionShow.jpeg";
import L2 from "@/assets/EminentImages/fashionShow1.jpeg";
import L3 from "@/assets/EminentImages/fashionShow2.jpeg";
import L4 from "@/assets/EminentImages/fashionShow3.jpeg";

import P1 from "@/assets/EminentImages/P1.jpeg";
import P2 from "@/assets/EminentImages/P2.jpeg";
import P3 from "@/assets/EminentImages/P3.jpeg";
import P4 from "@/assets/EminentImages/P4.jpeg";
import P5 from "@/assets/EminentImages/P5.jpeg";
import P6 from "@/assets/EminentImages/P6.jpeg";
import P7 from "@/assets/EminentImages/P7.jpeg";
import P8 from "@/assets/EminentImages/P8.jpeg";
import P9 from "@/assets/EminentImages/P9.jpeg";
import P10 from "@/assets/EminentImages/P10.jpeg";
import P11 from "@/assets/EminentImages/P11.jpeg";
import P12 from "@/assets/EminentImages/P12.jpeg";


import MP1 from "@/assets/EminentImages/event1.jpeg";
import MP2 from "@/assets/EminentImages/event2.jpeg";
import MP3 from "@/assets/EminentImages/event3.jpeg";
import MP4 from "@/assets/EminentImages/event4.jpeg";
import MP5 from "@/assets/EminentImages/event5.jpeg";
import MP6 from "@/assets/EminentImages/event6.jpeg";
import MP7 from "@/assets/EminentImages/event7.jpeg";
import MP8 from "@/assets/EminentImages/event8.jpeg";
import MP9 from "@/assets/EminentImages/event9.jpeg";
import MP10 from "@/assets/EminentImages/event10.jpeg";

// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";
// import pageantQueens from "@/assets/EminentImages/";


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
  url?: string;
}

// export const WORKS: Record<string, WorkSample[]> = {
//   fashion: [
//     { img: p1, title: "Traditional Bridal Portrait", meta: "Studio · Awka" },
//     { img: p2, title: "White Lace Editorial", meta: "Couple session" },
//     { img: p7, title: "Ikemba Okwuazu Ceremony", meta: "Traditional wedding" },
//     { img: p4, title: "Eminent Ready-to-Wear", meta: "Brand campaign" },
//     { img: F1, title: "Eminent Ready-to-Wear", meta: "Brand campaign" },
//     { img: F2, title: "Runway Coverage", meta: "Fashion week" },
//     { img: F3, title: "Aso Oke, Reimagined", meta: "Studio series" },
//     { img: F4, title: "Aso Oke, Reimagined", meta: "Studio series" },
//     { img: F5, title: "Aso Oke, Reimagined", meta: "Studio series" },
//   ],
//   lifestyle: [
//     { img: p5, title: "Retro Interior Session", meta: "Lifestyle set build" },
//     { img: p6, title: "Celebration Portrait", meta: "Studio · Colour backdrop" },
//     { img: L1, title: "Quiet Luxury Series", meta: "Editorial" },
//     { img: L2, title: "A Weekend in Awka", meta: "Location shoot" },
//     { img: L3, title: "The Home as a Set", meta: "Interiors" },
//     { img: L4, title: "Holiday Diaries", meta: "Film" },
//   ],
//   entertainment: [
//     { img: p3, title: "Edition 21 Feature", meta: "Cover story shoot" },
//     { img: pageantWinner, title: "13th Face of Eminent Winner", meta: "Awards night" },
//     { img: E1, title: "Red Carpet Coverage", meta: "Awards season" },
//     { img: E2, title: "Cool C Traditional Wedding", meta: "Eminent TV" },
//     { img: E3, title: "The Eminent TV Year", meta: "Event films" },
//     { img: E4, title: "Sound of the South-East", meta: "Music feature" },
//     { img: E5, title: "Sound of the South-East", meta: "Music feature" },
//   ],
//   photography: [
//     { img: p7, title: "Golden Backdrop Portrait", meta: "Studio lighting" },
//     { img: p2, title: "All-White Couple Session", meta: "Location" },
//     { img: p6, title: "Joy in Coral", meta: "One-light portrait" },
//     { img: p1, title: "Bridal Detail Study", meta: "Studio" },
//     { img: p5, title: "Set Design Portrait", meta: "Concept shoot" },
//     { img: p4, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P1, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P2, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P3, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P4, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P5, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P6, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P7, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P8, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P9, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P10, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P11, title: "Daylight Portraiture", meta: "Window light" },
//     { img: P12, title: "Daylight Portraiture", meta: "Window light" },
//   ],
//   modelling: [
//     { img: pageantQueens, title: "Face of Eminent & Brand Ambassador", meta: "Pageant portraits" },
//     { img: pageantWinner, title: "Queen Michelle Kenneth", meta: "Crowning night" },
//     { img: M1, title: "Academy New Faces", meta: "Portfolio session" },
//     { img: M2, title: "Composite Card Set", meta: "Studio" },
//     { img: M3, title: "Poise & Posture Training", meta: "Academy" },
//     { img: M4, title: "Casting Test Shots", meta: "Digitals" },
//     { img: M5, title: "Casting Test Shots", meta: "Digitals" },
//     { img: M6, title: "Casting Test Shots", meta: "Digitals" },
//     { img: M7, title: "Casting Test Shots", meta: "Digitals" },
//     { img: M8, title: "Casting Test Shots", meta: "Digitals" },
//     { img: M9, title: "Casting Test Shots", meta: "Digitals" },
//     { img: M10, title: "Casting Test Shots", meta: "Digitals" },
//   ],
//   "media-pr": [
//     { img: cover, title: "Eminent Magazine, Edition 26", meta: "Cover & print production" },
//     { img: p3, title: "Edition 21 in Circulation", meta: "Distribution campaign" },
//     { img: magStack, title: "Branding & Print", meta: "In-house press" },
//     { img: pageantWinner, title: "Event Media Coverage", meta: "Awards & fashion show" },
//     { img: services, title: "Video Production", meta: "Full crew coverage" },
//     { img: MP1, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP2, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP3, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP4, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP5, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP6, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP7, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP8, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP9, title: "Advertising Campaigns", meta: "Online & in print" },
//     { img: MP10, title: "Advertising Campaigns", meta: "Online & in print" },
//   ],
// };

export const WORKS: Record<string, WorkSample[]> = {
  fashion: [
    { img: p1, title: "Traditional Bridal Portrait", meta: "Studio · Awka" },
    { img: p2, title: "White Lace Editorial", meta: "Couple session" },
    { img: p7, title: "Ikemba Okwuazu Ceremony", meta: "Traditional wedding" },
    { img: p4, title: "Eminent Ready-to-Wear", meta: "Brand campaign" },
    { img: F1, title: "Eminent Capsule Collection", meta: "Lookbook" },
    { img: F2, title: "Runway Coverage", meta: "Fashion week" },
    { img: F3, title: "Aso Oke, Reimagined", meta: "Studio series" },
    { img: F4, title: "Woven Heritage", meta: "Studio series" },
    { img: F5, title: "Aso Oke Detail Study", meta: "Texture & drape" },
  ],
  lifestyle: [
    { img: p5, title: "Retro Interior Session", meta: "Lifestyle set build" },
    { img: p6, title: "Celebration Portrait", meta: "Studio · Colour backdrop" },
    { img: L1, title: "Quiet Luxury Series", meta: "Editorial" },
    { img: L2, title: "A Weekend in Awka", meta: "Location shoot" },
    { img: L3, title: "The Home as a Set", meta: "Interiors" },
    { img: L4, title: "Holiday Diaries", meta: "Film" },
  ],
  entertainment: [
    { img: p3, title: "Edition 21 Feature", meta: "Cover story shoot" },
    { img: pageantWinner, title: "13th Face of Eminent Winner", meta: "Awards night" },
    { img: E1, title: "Red Carpet Coverage", meta: "Awards season" },
    { img: E2, title: "Award night", meta: "Eminent TV" },
    { img: E3, title: "The Eminent TV Year", meta: "Event films" },
    { img: E4, title: "Runway Show", meta: "Music feature" },
    { img: E5, title: "Traditional Wedding", meta: "Eminent TV couple", url: "https://youtu.be/Kp6venRp2BA?si=gGIZE1M5cEJShU1V" },
  ],
  photography: [
    { img: p7, title: "Golden Backdrop Portrait", meta: "Studio lighting" },
    { img: p2, title: "All-White Couple Session", meta: "Location" },
    { img: p6, title: "Joy in Coral", meta: "One-light portrait" },
    { img: p1, title: "Bridal Detail Study", meta: "Studio" },
    { img: p5, title: "Set Design Portrait", meta: "Concept shoot" },
    { img: p4, title: "Daylight Portraiture", meta: "Window light" },
    { img: P1, title: "Natural Light Study", meta: "Window light" },
    { img: P2, title: "Soft Shadow Portrait", meta: "Available light" },
    { img: P3, title: "Morning Light Session", meta: "Window light" },
    { img: P4, title: "Backlit Silhouette", meta: "Available light" },
    { img: P5, title: "Golden Hour Portrait", meta: "Window light" },
    { img: P6, title: "Diffused Light Study", meta: "Studio window" },
    { img: P7, title: "Profile in Light", meta: "Window light" },
    { img: P8, title: "Contrast & Calm", meta: "Available light" },
    { img: P9, title: "Window Seat Portrait", meta: "Natural light" },
    { img: P10, title: "Quiet Light Series", meta: "Window light" },
    { img: P11, title: "Afternoon Portrait", meta: "Available light" },
    { img: P12, title: "Light & Texture", meta: "Window light" },
  ],
  modelling: [
    { img: pageantQueens, title: "Face of Eminent & Brand Ambassador", meta: "Pageant portraits" },
    { img: pageantWinner, title: "Queen Michelle Kenneth", meta: "Crowning night" },
    { img: M1, title: "Academy New Faces", meta: "Portfolio session" },
    { img: M2, title: "Composite Card Set", meta: "Studio" },
    { img: M3, title: "Poise & Posture Training", meta: "Academy" },
    { img: M4, title: "Casting Test Shots", meta: "Digitals" },
    { img: M5, title: "Portfolio Digitals", meta: "Casting prep" },
    { img: M6, title: "Look Test", meta: "Digitals" },
    { img: M7, title: "Runway Casting", meta: "Digitals" },
    { img: M8, title: "Composite Test Shots", meta: "Digitals" },
    { img: M9, title: "Agency Submission Shots", meta: "Digitals" },
    { img: M10, title: "Final Casting Round", meta: "Digitals" },
  ],
  "media-pr": [
    { img: cover, title: "Eminent Magazine, Edition 26", meta: "Cover & print production" },
    { img: p3, title: "Edition 21 in Circulation", meta: "Distribution campaign" },
    { img: magStack, title: "Branding & Print", meta: "In-house press" },
    { img: pageantWinner, title: "Event Media Coverage", meta: "Awards & fashion show" },
    { img: services, title: "Video Production", meta: "Full crew coverage" },
    { img: MP1, title: "Advertising Campaigns", meta: "Online & in print" },
    { img: MP2, title: "Print Ad Series", meta: "Magazine placement" },
    { img: MP3, title: "Digital Ad Campaign", meta: "Social & web" },
    { img: MP4, title: "Brand Partnership Ads", meta: "Online & in print" },
    { img: MP5, title: "Sponsored Feature", meta: "Print edition" },
    { img: MP6, title: "Campaign Rollout", meta: "Multi-platform" },
    { img: MP7, title: "Event Sponsorship Ads", meta: "Print & digital" },
    { img: MP8, title: "Client Ad Placement", meta: "Online & in print" },
    { img: MP9, title: "Seasonal Campaign", meta: "Print edition" },
    { img: MP10, title: "Year-End Ad Wrap", meta: "Online & in print" },
  ],
};

export function getWorks(slug: string): WorkSample[] {
  return WORKS[slug] ?? [];
}
