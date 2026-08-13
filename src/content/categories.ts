import hero from "@/assets/em-hero.jpg";
import storyFashion from "@/assets/em-story-fashion.jpg";
import storyPhoto from "@/assets/em-story-photo.jpg";
import storyModel from "@/assets/em-story-model.jpg";
import storyCulture from "@/assets/em-story-culture.jpg";
import storyLifestyle from "@/assets/em-story-lifestyle.jpg";
import services from "@/assets/services-videography.jpg";
import magStack from "@/assets/magazine-stack.jpg";
import pageant from "@/assets/pageant.jpg";

export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  img: string;
  author: string;
}

export interface Category {
  slug: string;
  label: string;
  kicker: string;
  description: string;
  hero: string;
  stories: Story[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "fashion",
    label: "Fashion",
    kicker: "Runway, retail and the rail in between",
    description:
      "Collections, designers and the styling decisions shaping how Nigeria dresses — reported from the front row and the fitting room.",
    hero: storyFashion,
    stories: [
      { slug: "new-faces-fashion-week", title: "The New Faces of Fashion Week", excerpt: "Six debut designers turned a converted Awka warehouse into the most talked-about schedule of the season.", date: "Nov 12, 2026", img: storyFashion, author: "Eminent Editorial" },
      { slug: "front-row-must-see-looks", title: "Front Row: This Season's Must-See Looks", excerpt: "Tailoring softened, colour got louder, and accessories finally stopped whispering.", date: "Nov 08, 2026", img: storyLifestyle, author: "Eminent Editorial" },
      { slug: "the-tailors-of-arthur-eze", title: "The Tailors of Arthur Eze Avenue", excerpt: "A walking tour of the workshops quietly producing some of the region's finest bespoke garments.", date: "Oct 26, 2026", img: magStack, author: "Eminent Editorial" },
      { slug: "aso-oke-reimagined", title: "Aso Oke, Reimagined", excerpt: "Heritage weave meets contemporary silhouettes in a studio session built around movement.", date: "Oct 14, 2026", img: storyModel, author: "Eminent Editorial" },
      { slug: "bridal-beyond-white", title: "Bridal Beyond White", excerpt: "Our wedding crew on why the most photographed brides of the year abandoned the default palette.", date: "Sep 30, 2026", img: services, author: "Eminent Editorial" },
      { slug: "the-cover-shoot-diary", title: "The Cover Shoot Diary", excerpt: "Twelve hours, three locations and one cover — how an issue image actually gets made.", date: "Sep 18, 2026", img: hero, author: "Eminent Editorial" },
    ],
  },
  {
    slug: "lifestyle",
    label: "Lifestyle",
    kicker: "How the city actually lives",
    description:
      "Interiors, travel, food and the quiet rituals of a good life — documented with the same care we give a cover shoot.",
    hero: storyLifestyle,
    stories: [
      { slug: "inside-the-quiet-luxury-movement", title: "Inside the Quiet Luxury Movement", excerpt: "Logos are out. Fabric, finish and restraint are the new status symbols.", date: "Oct 28, 2026", img: storyLifestyle, author: "Eminent Editorial" },
      { slug: "a-weekend-in-awka", title: "A Weekend in Awka", excerpt: "Where to eat, shoot and stay in the city Eminent calls home.", date: "Oct 09, 2026", img: hero, author: "Eminent Editorial" },
      { slug: "the-home-as-a-set", title: "The Home as a Set", excerpt: "Three interiors designed by people who spend their lives building frames.", date: "Sep 22, 2026", img: magStack, author: "Eminent Editorial" },
      { slug: "table-for-twelve", title: "Table for Twelve", excerpt: "The return of the long lunch, and the hosts making it an art form again.", date: "Sep 05, 2026", img: storyCulture, author: "Eminent Editorial" },
      { slug: "holiday-diaries", title: "Holiday Diaries", excerpt: "Our crew films holidays the way it films weddings — here's what that looks like.", date: "Aug 21, 2026", img: services, author: "Eminent Editorial" },
    ],
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    kicker: "Screen, stage and the culture around them",
    description:
      "Film, music, red carpets and the people making the noise — covered by a team that films the events it writes about.",
    hero: storyCulture,
    stories: [
      { slug: "culture-now", title: "Culture Now: What's Trending", excerpt: "The releases, rumours and moments defining the quarter.", date: "Nov 05, 2026", img: storyCulture, author: "Eminent Editorial" },
      { slug: "red-carpet-awards-recap", title: "Red Carpet: Awards Season Recap", excerpt: "Every look, every upset, and the after-party that outshone the ceremony.", date: "Oct 20, 2026", img: hero, author: "Eminent Editorial" },
      { slug: "cool-c-weds-traditionally", title: "Fine Artist Cool C Weds Traditionally", excerpt: "Eminent TV's most-watched coverage of the year, revisited in stills.", date: "Oct 02, 2026", img: services, author: "Eminent TV" },
      { slug: "the-eminent-tv-year", title: "The Eminent TV Year", excerpt: "A look back at the events our cameras followed from first light to last dance.", date: "Sep 12, 2026", img: storyPhoto, author: "Eminent TV" },
      { slug: "sound-of-the-south-east", title: "Sound of the South-East", excerpt: "The producers turning regional highlife into a national export.", date: "Aug 28, 2026", img: storyLifestyle, author: "Eminent Editorial" },
    ],
  },
  {
    slug: "photography",
    label: "Photography",
    kicker: "It won't be a photo. It will be art.",
    description:
      "Studio craft, aerial work and reportage from the photographers behind our covers — plus the technique notes to go with them.",
    hero: storyPhoto,
    stories: [
      { slug: "behind-the-lens", title: "Behind the Lens: Studio Sessions", excerpt: "One light, one subject, and the discipline that separates a photo from a picture.", date: "Nov 10, 2026", img: storyPhoto, author: "Eminent Studio" },
      { slug: "studio-lighting-secrets", title: "Studio Lighting Secrets from Top Photographers", excerpt: "Four setups our team returns to on almost every commercial job.", date: "Nov 12, 2026", img: magStack, author: "Eminent Studio" },
      { slug: "from-the-air", title: "From the Air", excerpt: "Why aerial coverage changes the value of a film — and when it doesn't.", date: "Oct 18, 2026", img: hero, author: "Eminent Studio" },
      { slug: "the-wedding-frame", title: "The Wedding Frame", excerpt: "Years of shooting Nigerian weddings, distilled into ten frames.", date: "Oct 01, 2026", img: services, author: "Eminent Studio" },
      { slug: "portraiture-in-daylight", title: "Portraiture in Daylight", excerpt: "No strobes, no modifiers — just timing, and a wall facing north.", date: "Sep 08, 2026", img: storyModel, author: "Eminent Studio" },
    ],
  },
  {
    slug: "modelling",
    label: "Modelling",
    kicker: "The academy, the roster, the runway",
    description:
      "New faces, training notes and career reporting from the modelling academy and the castings that follow it.",
    hero: storyModel,
    stories: [
      { slug: "on-the-rise", title: "On the Rise: Model Spotlight", excerpt: "The graduates whose first year has already outpaced their agency projections.", date: "Nov 02, 2026", img: storyModel, author: "Eminent Academy" },
      { slug: "rising-model-to-watch", title: "Rising Model to Watch This Year", excerpt: "From an open call in Awka to a national campaign in eleven months.", date: "Nov 02, 2026", img: storyFashion, author: "Eminent Academy" },
      { slug: "inside-modeling-training", title: "Inside Modeling Training", excerpt: "Posture, pace and portfolio — what six weeks at the academy actually covers.", date: "Oct 12, 2026", img: pageant, author: "Eminent Academy" },
      { slug: "casting-notes", title: "Casting Notes", excerpt: "What our directors look for in the first thirty seconds of a casting.", date: "Sep 26, 2026", img: storyPhoto, author: "Eminent Academy" },
      { slug: "the-composite-card", title: "The Composite Card", excerpt: "How to build a book that gets you the second call.", date: "Sep 02, 2026", img: hero, author: "Eminent Academy" },
    ],
  },
  {
    slug: "media-pr",
    label: "Media & PR",
    kicker: "Coverage, branding and the business of attention",
    description:
      "Media coverage, branding and printing, online publishing and advertising — the working side of the house, explained.",
    hero: hero,
    stories: [
      { slug: "what-media-coverage-buys", title: "What Media Coverage Actually Buys You", excerpt: "A plain-language breakdown of what a full-coverage package includes and why it matters.", date: "Nov 01, 2026", img: hero, author: "Eminent Media" },
      { slug: "branding-and-print", title: "Branding & Print, In-House", excerpt: "From identity to press-quality production without leaving the building.", date: "Oct 22, 2026", img: magStack, author: "Eminent Media" },
      { slug: "the-press-release-that-works", title: "The Press Release That Works", excerpt: "Why most launches get ignored, and the structure that doesn't.", date: "Oct 05, 2026", img: storyCulture, author: "Eminent Media" },
      { slug: "ushering-as-brand-experience", title: "Ushering as Brand Experience", excerpt: "Trained talent is the first impression your guests actually remember.", date: "Sep 16, 2026", img: pageant, author: "Eminent Media" },
      { slug: "publishing-online-and-in-print", title: "Publishing, Online and In Print", excerpt: "How a story moves from our blog to the newsstand — and back again.", date: "Aug 30, 2026", img: services, author: "Eminent Media" },
    ],
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
