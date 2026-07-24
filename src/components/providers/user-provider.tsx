"use client";

import * as React from "react";
import type { UserProfile } from "@/types";

const UserContext = React.createContext<UserProfile | null>(null);

export function UserProvider({ user, children }: { user: UserProfile | null; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

/** Returns the signed-in user's profile. Falls back to a generic placeholder if unavailable. */
export function useCurrentUser(): UserProfile {
  const user = React.useContext(UserContext);
  return (
    user ?? {
      id: "unknown",
      name: "You",
      email: "",
      role: "member",
    }
  );
}
