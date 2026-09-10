import { useSettings } from "@/stores/useSettings";
import type { I18nText, LocaleCode } from "@/types";
import { translate, type DictKey } from "./dict";

/** Hook returning t(key) and the current locale + a helper for I18nText values. */
export function useT() {
  const locale = useSettings((s) => s.locale);
  const t = (key: DictKey) => translate(key, locale);
  const tx = (text: I18nText | undefined) => (text ? text[locale] : "");
  return { t, tx, locale };
}

export function tl(text: I18nText | undefined, locale: LocaleCode): string {
  return text ? text[locale] : "";
}

export type { DictKey };
