import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Member } from "@/types";
import { PERSIST_KEY, SCHEMA_VERSION } from "@/lib/config";
import { demoMember } from "@/data";

interface AuthState {
  isLoggedIn: boolean;
  member: Member | null;
  loginAt?: string;
  /** Simulated login: any Philippine phone works; loads the demo member. */
  login: (phone: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      member: null,
      login: (phone) =>
        set({
          isLoggedIn: true,
          member: { ...demoMember, phone: phone || demoMember.phone },
          loginAt: new Date().toISOString(),
        }),
      logout: () => set({ isLoggedIn: false, member: null, loginAt: undefined }),
    }),
    { name: `${PERSIST_KEY}_auth`, version: SCHEMA_VERSION },
  ),
);
