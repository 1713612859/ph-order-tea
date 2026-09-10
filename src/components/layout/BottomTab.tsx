import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useT } from "@/lib/i18n";
import { useCart } from "@/stores/useCart";
import { cartTotalQuantity } from "@/lib/pricing";
import type { DictKey } from "@/lib/i18n/dict";

const tabs: { to: string; icon: IconName; label: DictKey }[] = [
  { to: "/", icon: "home", label: "tab.home" },
  { to: "/menu", icon: "menu", label: "tab.menu" },
  { to: "/orders", icon: "orders", label: "tab.orders" },
  { to: "/me", icon: "me", label: "tab.me" },
];

export function BottomTab() {
  const { t } = useT();
  const qty = useCart((s) => cartTotalQuantity(s.cart));

  return (
    <nav className="bottom-tabs grid grid-cols-4 border-t border-line bg-white/95 pb-safe backdrop-blur">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isActive ? "text-navy" : "text-muted"}`
          }
        >
          <span className="relative">
            <Icon name={tab.icon} className="h-6 w-6" />
            {tab.to === "/menu" && qty > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {qty}
              </span>
            )}
          </span>
          {t(tab.label)}
        </NavLink>
      ))}
    </nav>
  );
}

