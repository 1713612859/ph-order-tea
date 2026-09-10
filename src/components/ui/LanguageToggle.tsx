import { useSettings } from "@/stores/useSettings";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const locale = useSettings((s) => s.locale);
  const toggle = useSettings((s) => s.toggleLocale);
  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-semibold text-navy ${className}`}
      aria-label="Switch language"
    >
      <span className={locale === "en" ? "text-navy" : "text-muted"}>EN</span>
      <span className="text-line">|</span>
      <span className={locale === "zh" ? "text-navy" : "text-muted"}>中</span>
    </button>
  );
}
