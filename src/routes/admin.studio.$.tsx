import { createFileRoute } from "@tanstack/react-router";
import { AdminStudio } from "@/components/admin/AdminStudio";

export const Route = createFileRoute("/admin/studio/$")({
  head: () => ({
    meta: [
      { title: "Content Studio · Eminent Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminStudio,
});

