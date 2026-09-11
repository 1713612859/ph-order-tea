import { useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BottomTab } from "./BottomTab";
import { useAuth } from "@/stores/useAuth";
import { LoginSheet } from "@/features/LoginSheet";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useT();
  const loggedIn = useAuth(s => s.isLoggedIn);
  const [loginOpen, setLoginOpen] = useState(false);
  const protectedRoute = pathname === "/checkout" || pathname.startsWith("/orders") || pathname.startsWith("/payment/");
  useLayoutEffect(() => { window.scrollTo({top: 0, behavior: "instant"}); }, [pathname]);
  return <div className="app-shell flex min-h-[100dvh] flex-col">
    <main className="flex flex-1 flex-col">
      {protectedRoute && !loggedIn ? <div className="auth-empty"><span className="empty-medallion"><Icon name="me" className="h-10 w-10"/></span><h1>{t("me.loginPrompt")}</h1><p>{t("checkout.loginToOrder")}</p><button className="btn-primary" onClick={() => setLoginOpen(true)}>{t("common.login")}</button><button className="text-sm text-muted" onClick={() => navigate("/menu")}>{t("tab.menu")}</button><LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)}/></div> : <Outlet key={pathname}/>}
    </main>
    <div className="app-footer sticky bottom-0 z-40"><div id="action-slot"/>{!pathname.startsWith("/product/") && pathname !== "/checkout" && <BottomTab/>}</div>
  </div>;
}
