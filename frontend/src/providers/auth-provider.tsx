"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { API_ROUTES, PAGE_ROUTES } from "@/lib/constants";

import type { ApiResponse } from "@/lib/api/types";
import type { UserSessionDto } from "@/modules/auth";

interface AuthContextValue {
  user: UserSessionDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  refetch: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserSessionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(API_ROUTES.AUTH.ME);

      if (!response.ok) {
        setUser(null);
        return;
      }

      const envelope = (await response.json()) as ApiResponse<UserSessionDto>;
      setUser(envelope.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch(API_ROUTES.AUTH.LOGOUT, { method: "POST" });
      setUser(null);
      window.location.href = PAGE_ROUTES.PUBLIC.LOGIN;
    } catch {
      // Force redirect even on error
      window.location.href = PAGE_ROUTES.PUBLIC.LOGIN;
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchUser(), 0);
    return () => clearTimeout(timeout);
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        logout,
        refetch: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
