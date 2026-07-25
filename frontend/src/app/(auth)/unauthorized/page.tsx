import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-destructive/10 mb-6">
        <ShieldAlert className="size-8 text-destructive" />
      </div>
      
      <h1 className="text-2xl font-bold text-foreground mb-3">
        Access Denied
      </h1>
      
      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        You do not have permission to access this page. If you believe this is an error, please contact your system administrator.
      </p>
      
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
