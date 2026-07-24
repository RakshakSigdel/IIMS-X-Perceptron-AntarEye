"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LayoutDashboard, Stethoscope } from "lucide-react";
import { PAGE_ROUTES } from "@/lib/constants";

import type { NavItem } from "@/components/layout/Sidebar";

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: PAGE_ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Doctors",
    href: PAGE_ROUTES.ADMIN.DOCTORS,
    icon: Stethoscope,
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar navItems={ADMIN_NAV_ITEMS} />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
