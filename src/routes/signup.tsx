import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "@/pages/Signup";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — EyeX Technologies" },
      { name: "description", content: "Create your EyeX Technologies account." },
    ],
  }),
  component: SignupPage,
});
