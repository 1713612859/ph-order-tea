import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ID, LocaleCode, ServiceType } from "@/types";
import { PERSIST_KEY, SCHEMA_VERSION } from "@/lib/config";

interface SettingsState {
  locale: LocaleCode;
  memberPriceEnabled: boolean;
  selectedStoreId: ID | null;
  serviceType: ServiceType;
  setLocale: (l: LocaleCode) => void;
  toggleLocale: () => void;
  setMemberPriceEnabled: (v: boolean) => void;
  setSelectedStore: (id: ID | null) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      locale: "en",
      memberPriceEnabled: true,
      selectedStoreId: null,
      serviceType: "pickup",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set({ locale: get().locale === "en" ? "zh" : "en" }),
      setMemberPriceEnabled: (memberPriceEnabled) => set({ memberPriceEnabled }),
      setSelectedStore: (selectedStoreId) => set({ selectedStoreId }),
    }),
    { name: `${PERSIST_KEY}_settings`, version: SCHEMA_VERSION },
  ),
);
