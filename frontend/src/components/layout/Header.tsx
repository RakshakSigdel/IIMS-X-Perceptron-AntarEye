"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbSegment[] = [];

  // Map path segments to human-readable labels
  const labelMap: Record<string, string> = {
    doctor: "Doctor",
    admin: "Admin",
    patients: "Patients",
    doctors: "Doctors",
    diagnosis: "Diagnosis",
    new: "New",
    edit: "Edit",
    profile: "Profile",
  };

  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Skip dynamic segments for now — they get replaced by actual data
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment
      );

    breadcrumbs.push({
      label: isUUID ? "Details" : (labelMap[segment] ?? segment),
      href: currentPath,
    });
  }

  return breadcrumbs;
}

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header
      className={cn(
        "flex items-center justify-between h-14 px-6",
        "border-b border-border bg-background/80 backdrop-blur-sm",
        "shrink-0 sticky top-0 z-10"
      )}
    >
      <div className="flex flex-col gap-0.5">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={crumb.href} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="size-3 text-muted-foreground/50" />
                  )}
                  {isLast || !crumb.href ? (
                    <span className="text-foreground font-medium">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title */}
        {title && (
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            {title}
          </h1>
        )}
      </div>

      {/* Right actions */}
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
