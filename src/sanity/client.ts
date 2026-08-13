import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

type ImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

export function urlFor(source: ImageSource) {
  return builder.image(source);
}

export function imageSrc(source: ImageSource | undefined | null, width = 1200, height?: number) {
  if (!source) return undefined;
  let b = urlFor(source).width(width).auto("format").quality(80);
  if (height) b = b.height(height).fit("crop");
  return b.url();
}
