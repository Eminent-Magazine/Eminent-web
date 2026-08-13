import { CATEGORIES } from "@/content/categories";
import { imageSrc } from "@/sanity/client";
import type { PostCard } from "@/sanity/queries";

export interface StoryCard {
  slug: string;
  title: string;
  excerpt: string;
  img?: string;
  date: string;
  author: string;
  categoryLabel: string;
  categorySlug: string;
  readTime?: string;
  featured?: boolean;
}

export function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

export function fromSanity(p: PostCard, width = 1000, height?: number): StoryCard {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    img: imageSrc(p.coverImage, width, height),
    date: formatDate(p.publishedAt),
    author: p.author ?? "Eminent Editorial",
    categoryLabel: p.categoryTitle ?? "Story",
    categorySlug: p.categorySlug ?? "",
    readTime: p.readTime,
    featured: p.featured,
  };
}

/** Curated fallback content used until enough stories are published in the studio. */
export function fallbackStories(categorySlug?: string): StoryCard[] {
  const cats = categorySlug ? CATEGORIES.filter((c) => c.slug === categorySlug) : CATEGORIES;
  return cats.flatMap((c) =>
    c.stories.map((s) => ({
      slug: s.slug,
      title: s.title,
      excerpt: s.excerpt,
      img: s.img,
      date: s.date,
      author: s.author,
      categoryLabel: c.label,
      categorySlug: c.slug,
    })),
  );
}

export function findFallbackStory(slug: string) {
  for (const c of CATEGORIES) {
    const s = c.stories.find((x) => x.slug === slug);
    if (s) return { story: s, category: c };
  }
  return null;
}
