import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10 mb-6">
        <Eye className="size-7 text-primary" />
      </div>
      <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Check the URL or head back to the dashboard.
      </p>
      <Link href="/">
        <Button>
          <ArrowLeft className="size-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
