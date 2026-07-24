"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeft, Eye } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: NavItem[];
  brandText?: string;
}

export function Sidebar({ navItems, brandText = "AntarEye" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground",
        "border-r border-sidebar-border",
        "relative shrink-0"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center size-8 rounded-lg bg-sidebar-primary/20">
          <Eye className="size-4 text-sidebar-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="font-heading text-lg font-semibold text-sidebar-foreground overflow-hidden whitespace-nowrap"
            >
              {brandText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2",
                    "text-sm font-medium transition-colors duration-150",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-2 pb-3 space-y-2 shrink-0">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-1 px-1")}>
          <ThemeToggle className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent" />
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className={cn(
                "ml-auto inline-flex items-center justify-center rounded-lg p-2",
                "text-sidebar-foreground/60 hover:text-sidebar-foreground",
                "hover:bg-sidebar-accent transition-colors duration-150"
              )}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="size-4" />
            </button>
          )}
        </div>

        <UserMenu collapsed={collapsed} />
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className={cn(
            "absolute -right-3 top-20 z-10",
            "flex items-center justify-center size-6 rounded-full",
            "bg-sidebar border border-sidebar-border",
            "text-sidebar-foreground/60 hover:text-sidebar-foreground",
            "shadow-sm transition-colors duration-150"
          )}
          aria-label="Expand sidebar"
        >
          <PanelLeft className="size-3" />
        </button>
      )}
    </motion.aside>
  );
}
