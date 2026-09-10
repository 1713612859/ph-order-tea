import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ActionBar } from "@/components/layout/ActionBar";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { useT } from "@/lib/i18n";
import { formatPHP, formatDistance } from "@/lib/format";
import { catalogRepo, storeRepo, type AvailableProduct } from "@/lib/repositories";
import { categoryAccent, getMerchandisePrice } from "@/data";
import { calcUnitPrice, cartSelectedTotal, cartTotalQuantity } from "@/lib/pricing";
import { useCart } from "@/stores/useCart";
import { useSettings } from "@/stores/useSettings";
import { useMemberMode } from "@/stores/useMemberMode";
import { useAuth } from "@/stores/useAuth";
import { LoginSheet } from "./LoginSheet";
import { CartSheet } from "./CartSheet";
import type { Category } from "@/types";

export function MenuPage() {
  const { t, tx } = useT();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const storeId = useSettings((s) => s.selectedStoreId);
  const memberMode = useMemberMode();
  const cart = useCart((s) => s.cart);
  const addLine = useCart((s) => s.addLine);
  const isLoggedIn = useAuth((s) => s.isLoggedIn);

  const store = storeId ? storeRepo.getById(storeId) : undefined;
  const categories = useMemo(() => catalogRepo.listCategories(), []);
  const products = useMemo(() => catalogRepo.listProducts(storeId), [storeId]);
  const distance = useMemo(
    () => (store ? storeRepo.listNearby().find((s) => s.store.id === store.id)?.distanceKm ?? 0 : 0),
    [store],
  );

  const grouped = useMemo(
    () =>
      categories
        .map((c) => ({ category: c, items: products.filter((p) => p.product.categoryId === c.id) }))
        .filter((g) => g.items.length > 0),
    [categories, products],
  );

  const [activeCat, setActiveCat] = useState<string | undefined>(grouped[0]?.category.id);
  const [cartOpen, setCartOpen] = useState(params.get("cart") === "1");
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const railRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingAdd = useRef<string | null>(null);
  const lockUntil = useRef(0);

  useEffect(() => {
    if (grouped.length && !grouped.some((g) => g.category.id === activeCat)) setActiveCat(grouped[0].category.id);
  }, [grouped, activeCat]);

  /** Scroll-spy: highlight the category whose section sits under the sticky header. */
  useEffect(() => {
    const ids = grouped.map((g) => g.category.id);
    if (!ids.length) return;

    const onScroll = () => {
      if (Date.now() < lockUntil.current) return;
      let current = ids[0];
      for (const id of ids) {
        const el = sectionRefs.current[id];
        if (el && el.getBoundingClientRect().top <= 130) current = id;
      }
      setActiveCat((prev) => (prev === current ? prev : current));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [grouped]);

  useEffect(() => {
    if (activeCat) railRefs.current[activeCat]?.scrollIntoView({ block: "nearest" });
  }, [activeCat]);

  const jumpTo = (id: string) => {
    setActiveCat(id);
    lockUntil.current = Date.now() + 700; // let smooth scrolling settle before the spy resumes
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCart = (next: boolean) => {
    setCartOpen(next);
    const p = new URLSearchParams(params);
    if (next) p.set("cart", "1");
    else p.delete("cart");
    setParams(p, { replace: true });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  };

  /** Quick-add for spec-less items. Logged-out users get the login sheet, never a silent no-op. */
  const quickAdd = (productId: string) => {
    if (!useAuth.getState().isLoggedIn) {
      pendingAdd.current = productId;
      setLoginOpen(true);
      return;
    }
    addLine({ productId, selectedOptionIds: [], quantity: 1 });
    showToast(tx({ en: "Added to bag", zh: "已加入购物车" }));
  };

  const qty = cartTotalQuantity(cart);
  const total = cartSelectedTotal(cart, memberMode);

  if (!store) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <Icon name="location" className="h-12 w-12 text-muted" />
        <p className="text-sm text-muted">{t("menu.selectStore")}</p>
        <button onClick={() => navigate("/stores")} className="btn-primary">
          {t("store.title")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* store header */}
      <div className="menu-header sticky top-0 z-20 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{t("common.pickup")}</p>
        <button onClick={() => navigate("/stores")} className="mt-1 flex items-center gap-1.5 text-left">
          <Icon name="heart" className="h-4 w-4 text-brand-red" />
          <span className="text-base font-bold text-navy">{tx(store.name)}</span>
          <span className="text-xs text-muted">{formatDistance(distance)}</span>
          <Icon name="chevron-right" className="h-4 w-4 text-muted" />
        </button>
        <p className="text-xs text-brand-amber">{t("menu.orderInstant")}</p>
      </div>

      <div className="flex flex-1 items-start">
        {/* category rail */}
        <nav className="menu-rail no-scrollbar w-24 shrink-0 border-r border-line bg-cream-soft/60" aria-label={t("tab.menu")}>
          {grouped.map((g) => (
            <button
              key={g.category.id}
              ref={(el) => {
                railRefs.current[g.category.id] = el;
              }}
              onClick={() => jumpTo(g.category.id)}
              aria-current={activeCat === g.category.id}
              className={`relative block w-full px-2 py-4 text-center text-xs leading-tight transition ${
                activeCat === g.category.id ? "bg-cream font-bold text-navy" : "font-medium text-muted"
              }`}
            >
              {activeCat === g.category.id && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-brand-red" />
              )}
              {tx(g.category.name)}
            </button>
          ))}
        </nav>

        {/* product list */}
        <div className="min-w-0 flex-1 px-3">
          {grouped.map((g) => (
            <section
              key={g.category.id}
              ref={(el) => {
                sectionRefs.current[g.category.id] = el;
              }}
              className="menu-section pt-4"
            >
              <h2 className="mb-2 text-sm font-bold text-navy">{tx(g.category.name)}</h2>
              <div className="space-y-4">
                {g.items.map((ap) => (
                  <ProductRow
                    key={ap.product.id}
                    ap={ap}
                    category={g.category}
                    memberMode={memberMode}
                    onOpen={() => navigate(`/product/${ap.product.id}`)}
                    onQuickAdd={() => quickAdd(ap.product.id)}
                  />
                ))}
              </div>
            </section>
          ))}
          <div className="h-6" />
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {/* cart bar sits above the persistent tab bar */}
      {qty > 0 && (
        <ActionBar>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <button onClick={() => openCart(true)} className="flex items-center gap-3" aria-label={t("cart.title")}>
              <span className="relative">
                <Icon name="bag" className="h-8 w-8 text-navy" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[11px] font-bold text-white">
                  {qty}
                </span>
              </span>
              <span className="text-lg font-extrabold text-navy">{formatPHP(total)}</span>
            </button>
            <button onClick={() => openCart(true)} className="btn-primary px-8">
              {t("cart.checkout")}
            </button>
          </div>
        </ActionBar>
      )}

      <CartSheet open={cartOpen} onClose={() => openCart(false)} />
      <LoginSheet
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          pendingAdd.current = null;
        }}
        onSuccess={() => {
          const id = pendingAdd.current;
          pendingAdd.current = null;
          if (id) {
            addLine({ productId: id, selectedOptionIds: [], quantity: 1 });
            showToast(tx({ en: "Added to bag", zh: "已加入购物车" }));
          }
        }}
      />
    </div>
  );
}

function ProductRow({
  ap,
  category,
  memberMode,
  onOpen,
  onQuickAdd,
}: {
  ap: AvailableProduct;
  category: Category;
  memberMode: boolean;
  onOpen: () => void;
  onQuickAdd: () => void;
}) {
  const { t, tx } = useT();
  const { product, isSoldOut } = ap;
  const accent = categoryAccent[category.id] ?? "#6E8B4E";
  const isMerch = category.kind === "merchandise";

  const price = isMerch
    ? getMerchandisePrice(product.id)
    : calcUnitPrice(
        product,
        product.specGroups.flatMap((g) => g.options.filter((o) => o.isDefault).map((o) => o.id)),
        memberMode,
      );
  const isNew = product.tags.includes("new");

  return (
    <div className={`product-row flex gap-3 ${isSoldOut ? "opacity-60" : ""}`}>
      <button onClick={isSoldOut ? undefined : onOpen} className="relative shrink-0" aria-label={tx(product.name)}>
        <Media
          image={product.image}
          productId={isMerch ? undefined : product.id}
          accent={accent}
          glyph={isMerch ? "gift" : "cup"}
          className="h-24 w-24"
        />
        {isSoldOut && (
          <span className="absolute inset-0 flex items-center justify-center rounded-xl2 bg-black/45 text-xs font-bold text-white">
            {t("common.soldOut")}
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <button onClick={isSoldOut ? undefined : onOpen} className="text-left">
          <h3 className="text-sm font-bold text-navy">{tx(product.name)}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">{tx(product.description)}</p>
        </button>
        {isNew && (
          <span className="mt-1 inline-flex w-fit items-center rounded bg-brand-amber/15 px-1.5 py-0.5 text-[10px] font-bold text-brand-amber">
            ★ {t("common.new")}
          </span>
        )}
        <div className="mt-auto flex items-end justify-between pt-1">
          <span className="text-sm font-extrabold text-brand-amber">{formatPHP(price)}</span>
          {!isSoldOut && (
            <button
              onClick={isMerch ? onQuickAdd : onOpen}
              aria-label={t("product.addToBag")}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white active:scale-95"
            >
              <Icon name="plus" className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
