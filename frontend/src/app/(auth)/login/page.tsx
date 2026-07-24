import { LoginForm } from "@/modules/auth/components/LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — AntarEye",
  description: "Sign in to AntarEye to access the retinal disease diagnosis platform.",
};

export default function LoginPage() {
  return (
    <>
      <h2 className="text-lg font-semibold text-foreground mb-1">Welcome back</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Sign in to continue to your dashboard
      </p>
      <LoginForm />
    </>
  );
}
