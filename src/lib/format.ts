import type { Centavos, ISODateTime, LocaleCode } from "@/types";
import { CURRENCY_SYMBOL } from "./config";

/** ₱ with two decimals from centavos. formatPHP(17000) => "₱170.00" */
export function formatPHP(centavos: Centavos): string {
  const value = (centavos ?? 0) / 100;
  return `${CURRENCY_SYMBOL}${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

// Define Manila time zone
const MANILA_TZ = "Asia/Manila";

// format ISO date/time to Manila time zone
export function formatDateTime(iso: ISODateTime, locale: LocaleCode = "en"): string {
  const d = new Date(iso);
  return d.toLocaleString(locale === "zh" ? "zh-CN" : "en-PH", {
    timeZone: MANILA_TZ,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format Date time to Manila time zone
export function formatTime(iso: ISODateTime, locale: LocaleCode = "en"): string {
  return new Date(iso).toLocaleTimeString(locale === "zh" ? "zh-CN" : "en-PH", {
    timeZone: MANILA_TZ,
    hour: "2-digit",
    minute: "2-digit",
  });
}
