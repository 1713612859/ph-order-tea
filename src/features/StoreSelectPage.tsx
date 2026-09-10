import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useT } from "@/lib/i18n";
import { formatDistance } from "@/lib/format";
import { storeRepo } from "@/lib/repositories";
import { useAuth } from "@/stores/useAuth";
import { useCart } from "@/stores/useCart";
import { useSettings } from "@/stores/useSettings";
import type { StoreWithDistance } from "@/types";

export function StoreSelectPage() {
  const { t, tx } = useT();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const member = useAuth((s) => s.member);
  const favoriteIds = member?.favoriteStoreIds ?? [];
  const setStore = useCart((s) => s.setStore);
  const needsConfirm = useCart((s) => s.needsStoreSwitchConfirm);
  const setSelectedStore = useSettings((s) => s.setSelectedStore);

  const [tab, setTab] = useState<"nearby" | "favorites">(searchParams.get("tab") === "favorites" ? "favorites" : "nearby");
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const list = useMemo(() => {
    const all = storeRepo.search(q, favoriteIds);
    return tab === "favorites" ? all.filter((s) => s.isFavorite) : all;
  }, [q, tab, favoriteIds]);

  const choose = (storeId: string) => {
    if (needsConfirm(storeId)) {
      setPending(storeId);
      return;
    }
    setStore(storeId);
    setSelectedStore(storeId);
    navigate("/menu");
  };

  const confirmSwitch = () => {
    if (!pending) return;
    setStore(pending);
    setSelectedStore(pending);
    setPending(null);
    navigate("/menu");
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title={t("store.title")} />
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-xl bg-cream-soft px-3 py-2.5">
          <Icon name="search" className="h-5 w-5 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("store.search")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div className="mt-3 flex gap-6 border-b border-line">
          {(["nearby", "favorites"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative pb-2 text-sm font-semibold ${tab === k ? "text-navy" : "text-muted"}`}
            >
              {t(k === "nearby" ? "store.nearby" : "store.favorites")}
              {tab === k && <span className="absolute -bottom-px left-0 h-0.5 w-full bg-brand-red" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-3 px-4 py-4">
        {list.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">{tab === "favorites" ? t("store.noFavorites") : "—"}</p>
        )}
        {list.map((s) => (
          <StoreCard key={s.store.id} data={s} onOrder={() => choose(s.store.id)} />
        ))}
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={t("store.changeConfirm.title")}
        body={t("store.changeConfirm.body")}
        confirmLabel={t("common.confirm")}
        cancelLabel={t("common.cancel")}
        onConfirm={confirmSwitch}
        onCancel={() => setPending(null)}
      />

      <p className="pb-4 text-center text-[11px] text-muted">{tx({ en: "Distances are simulated for this prototype.", zh: "本原型距离为模拟数据。" })}</p>
    </div>
  );
}

function StoreCard({ data, onOrder }: { data: StoreWithDistance; onOrder: () => void }) {
  const { t, tx } = useT();
  const { store, distanceKm, isFavorite } = data;
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-bold text-navy">{tx(store.name)}</h3>
          {isFavorite && <Icon name="heart-filled" className="h-4 w-4 text-brand-red" />}
        </div>
        <Icon name="chevron-right" className="h-5 w-5 text-muted" />
      </div>
      <p className="mt-1 text-xs text-muted">
        {t("store.preparing")} <span className="font-semibold text-brand-green">{store.liveOps.preparingCups}</span> {t("store.cups")}, {t("store.estTime")}{" "}
        <span className="font-semibold text-brand-green">{store.liveOps.estimatedMinutes}</span> {t("store.minutes")}
      </p>
      <div className="mt-3 flex gap-3">
        <p className="flex-1 text-xs leading-relaxed text-navy/80">{tx(store.address.line1)}</p>
        <Media image={store.storefrontImage} accent="#8A6D3B" glyph="store" className="h-16 w-20 shrink-0" rounded="rounded-lg" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-muted">
          <Icon name="location" className="h-4 w-4" />
          {formatDistance(distanceKm)}
        </span>
        <button onClick={onOrder} className="btn-primary px-5 py-2 text-xs">
          {t("store.orderNow")}
        </button>
      </div>
    </div>
  );
}

