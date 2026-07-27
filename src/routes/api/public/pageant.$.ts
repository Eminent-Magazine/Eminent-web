import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = import.meta.env.VITE_API_URL || "";

async function proxy({ request, params }: { request: Request; params: { _splat?: string } }) {
  const splat = params._splat ?? "";
  const url = new URL(request.url);
  const target = `${UPSTREAM}/api/${splat}${url.search}`;

  const headers = new Headers();
  const ct = request.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const auth = request.headers.get("authorization");
  if (auth) headers.set("authorization", auth);
  headers.set("accept", "application/json");

  const init: RequestInit = { method: request.method, headers };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const buf = await upstream.arrayBuffer();
  const respHeaders = new Headers();
  const upCT = upstream.headers.get("content-type");
  if (upCT) respHeaders.set("content-type", upCT);
  return new Response(buf, { status: upstream.status, headers: respHeaders });
}

export const Route = createFileRoute("/api/public/pageant/$")({
  server: {
    handlers: {
      GET: proxy,
      POST: proxy,
      PUT: proxy,
      DELETE: proxy,
      PATCH: proxy,
    },
  },
});
