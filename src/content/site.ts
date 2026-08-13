/**
 * Single source of truth for company information.
 * Content ported from the legacy site: eminentmagazine.com
 */

export const SITE = {
  name: "Eminent Magazine",
  legalName: "Eminent International Media World Limited",
  tagline: "Everything you need in a media house, packed together as one.",
  positioning:
    "We bring our media outfit to your doorstep in cinematic form — entertaining you and sharing vital information along the way. It's all Eminent Cinematography and Eminent movies: an Eminent viewing experience.",
  email: "info@eminentmagazine.com",
  address: {
    line1: "No. 75 Arthur Eze Avenue, by Unizik Junction",
    line2: "Awka, Anambra State",
    country: "Nigeria",
    full: "No. 75 Arthur Eze Avenue, by Unizik Junction, Awka, Anambra State, Nigeria",
  },
  youtube: {
    label: "Eminent TV",
    url: "https://www.youtube.com/channel/UCZvQofRFM4WhQZKQkfEz9rg",
  },
  instagram: "https://instagram.com/eminentmagazine",
} as const;

/** The nine service lines listed on the legacy site. */
export const SERVICE_LINES = [
  "Magazine",
  "Media Coverage",
  "Studio Photos",
  "Branding / Printing",
  "Online Publishing & Blogging",
  "Modeling Training",
  "Pageantry",
  "Ushering Services",
  "Advertising / PR",
] as const;

/** Production capability blocks, ported from the legacy site copy. */
export const CAPABILITIES = [
  {
    title: "Videography",
    body: "With a multi-man crew skilled in the latest cameras, we create cinematic film — weddings, corporate work and holiday diaries. Talk to us about what we can do for your event.",
  },
  {
    title: "Aerial",
    body: "Aerial footage adds an unsurpassed level of production value and cinematic quality to the final product. We have skilled pilots on hand who can be added to any package.",
  },
  {
    title: "Wedding",
    body: "Fine photography and videography for Nigerian weddings and receptions. Years of experience filming and photographing weddings — it's our bread and butter.",
  },
  {
    title: "Photography",
    body: "We employ several skilled and experienced photographers who capture the moment through their lens. It won't be a photo — it will be art.",
  },
  {
    title: "Bespoke",
    body: "We are filmmakers, which means we go wherever the story takes us. If your brief is a little unusual, we're happy to open a dialogue and share ideas.",
  },
  {
    title: "International",
    body: "We're always prepared to travel — from a swanky London hotel to the romantic backstreets of Venice. Wherever your event takes place, our crew will get there.",
  },
] as const;
