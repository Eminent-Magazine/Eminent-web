import { sanityClient } from "./client";

export interface SanityImage {
  asset?: { _ref: string };
  alt?: string;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImage;
  author?: string;
  publishedAt?: string;
  readTime?: string;
  featured?: boolean;
  categoryTitle?: string;
  categorySlug?: string;
}

export interface PostDetail extends PostCard {
  body?: any[];
}

export interface CategoryDoc {
  _id: string;
  title: string;
  slug: string;
  kicker?: string;
  description?: string;
  heroImage?: SanityImage;
}

export interface EventDoc {
  _id: string;
  title: string;
  status?: string;
  snippet?: string;
  image?: SanityImage;
  ctaLabel?: string;
  ctaHref?: string;
  endDate?: string;
}

const CARD_FIELDS = `
  _id, title, "slug": slug.current, excerpt, coverImage, author, publishedAt, readTime, featured,
  "categoryTitle": category->title, "categorySlug": category->slug.current
`;

export async function fetchPosts(opts: { categorySlug?: string; limit?: number } = {}) {
  const filter = opts.categorySlug
    ? `*[_type == "post" && defined(slug.current) && category->slug.current == $categorySlug]`
    : `*[_type == "post" && defined(slug.current)]`;
  const slice = opts.limit ? `[0...${opts.limit}]` : "";
  return sanityClient.fetch<PostCard[]>(
    `${filter} | order(coalesce(publishedAt, _createdAt) desc)${slice}{${CARD_FIELDS}}`,
    { categorySlug: opts.categorySlug ?? null },
  );
}

export async function fetchPost(slug: string) {
  return sanityClient.fetch<PostDetail | null>(
    `*[_type == "post" && slug.current == $slug][0]{${CARD_FIELDS}, body}`,
    { slug },
  );
}

export async function fetchRelated(categorySlug: string | undefined, excludeSlug: string) {
  return sanityClient.fetch<PostCard[]>(
    `*[_type == "post" && slug.current != $excludeSlug && ($categorySlug == null || category->slug.current == $categorySlug)]
      | order(coalesce(publishedAt, _createdAt) desc)[0...3]{${CARD_FIELDS}}`,
    { categorySlug: categorySlug ?? null, excludeSlug },
  );
}

export async function fetchCategory(slug: string) {
  return sanityClient.fetch<CategoryDoc | null>(
    `*[_type == "category" && slug.current == $slug][0]{_id, title, "slug": slug.current, kicker, description, heroImage}`,
    { slug },
  );
}

export async function fetchEvents() {
  return sanityClient.fetch<EventDoc[]>(
    `*[_type == "event" && active == true] | order(coalesce(order, 0) asc, _createdAt desc){
      _id, title, status, snippet, image, ctaLabel, ctaHref, endDate
    }`,
  );
}

export const storiesQueryOptions = (categorySlug?: string) => ({
  queryKey: ["sanity", "posts", categorySlug ?? "all"] as const,
  queryFn: () => fetchPosts({ categorySlug }),
});

export const eventsQueryOptions = {
  queryKey: ["sanity", "events"] as const,
  queryFn: () => fetchEvents(),
};
