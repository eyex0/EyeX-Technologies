import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EyeX Technologies" },
      {
        name: "description",
        content:
          "Get in touch with EyeX Technologies. Reach out for partnerships, support, or general inquiries.",
      },
      { property: "og:title", content: "Contact EyeX Technologies" },
      {
        property: "og:description",
        content:
          "Get in touch with EyeX Technologies. Reach out for partnerships, support, or general inquiries.",
      },
    ],
  }),
  component: ContactPage,
});
