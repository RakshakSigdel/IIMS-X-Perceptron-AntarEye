import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Eye } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/10 mb-4">
            <Eye className="size-6 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            AntarEye
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-assisted retinal disease diagnosis
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
