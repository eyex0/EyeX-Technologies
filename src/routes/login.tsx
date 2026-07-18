import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/pages/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — EyeX Technologies" },
      { name: "description", content: "Sign in to your EyeX Technologies account." },
    ],
  }),
  component: LoginPage,
});
