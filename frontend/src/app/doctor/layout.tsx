"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LayoutDashboard, Users } from "lucide-react";
import { PAGE_ROUTES } from "@/lib/constants";

import type { NavItem } from "@/components/layout/Sidebar";

const DOCTOR_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: PAGE_ROUTES.DOCTOR.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Patients",
    href: PAGE_ROUTES.DOCTOR.PATIENTS,
    icon: Users,
  },
];

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar navItems={DOCTOR_NAV_ITEMS} />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
