"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { User } from "@/types/user";
import { notImplemented } from "@/utils/errors";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(null);
  const [status] = useState<AuthStatus>("unauthenticated");

  const signIn = useCallback(async () => notImplemented("AuthContext.signIn"), []);
  const signOut = useCallback(async () => notImplemented("AuthContext.signOut"), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signIn, signOut }),
    [user, status, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
