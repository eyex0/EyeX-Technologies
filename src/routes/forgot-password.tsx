import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "@/pages/ForgotPassword";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — EyeX Technologies" },
      { name: "description", content: "Reset your EyeX Technologies password." },
    ],
  }),
  component: ForgotPasswordPage,
});
