"use client";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { PAGE_ROUTES } from "@/lib/constants";
import { UserRole } from "@/lib/constants";
import { LogOut, User } from "lucide-react";

interface UserMenuProps {
  collapsed?: boolean;
}

export function UserMenu({ collapsed = false }: UserMenuProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const profileRoute =
    user.role === UserRole.ADMIN
      ? PAGE_ROUTES.ADMIN.DASHBOARD
      : PAGE_ROUTES.DOCTOR.PROFILE;

  return (
    <div className={cn("border-t border-sidebar-border pt-3", collapsed && "px-1")}>
      {!collapsed && (
        <div className="mb-2 px-2">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        <a
          href={profileRoute}
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1.5",
            "text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground",
            "hover:bg-sidebar-accent transition-colors duration-150",
            collapsed && "justify-center"
          )}
        >
          <User className="size-4 shrink-0" />
          {!collapsed && <span>Profile</span>}
        </a>

        <button
          type="button"
          onClick={() => void logout()}
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1.5 w-full",
            "text-sm text-sidebar-foreground/80 hover:text-destructive",
            "hover:bg-sidebar-accent transition-colors duration-150",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
