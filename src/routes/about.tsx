import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: 'About EyeX Technologies — Origin' },
      { name: "description", content: 'The people, principles and origin story behind EyeX Technologies.' },
      { property: "og:title", content: 'About EyeX Technologies — Origin' },
      { property: "og:description", content: 'The people, principles and origin story behind EyeX Technologies.' },
    ],
  }),
  component: AboutPage,
});
