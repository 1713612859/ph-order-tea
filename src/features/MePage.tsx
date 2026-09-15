import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/stores/useAuth";
import { useSettings } from "@/stores/useSettings";
import { LoginSheet } from "./LoginSheet";

export function MePage() {
  const { t, tx } = useT();
  const navigate = useNavigate();
  const { isLoggedIn, member, logout } = useAuth();
  const { locale, toggleLocale, memberPriceEnabled, setMemberPriceEnabled, selectedStoreId } = useSettings();
  const [loginOpen, setLoginOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const initials = member?.name?.split(/\s+/).map(n => n[0]).slice(0, 2).join("") || "CT";
  const openMemberPage = (path: string) => isLoggedIn ? navigate(path) : setLoginOpen(true);

  return <div className="member-page">
    <header className="member-header"><span className="member-wordmark">ChaTea<span>CLUB</span></span><span className="member-header-note">{tx({ en: "A LITTLE MORE, JUST FOR YOU", zh: "为你，多一份美好" })}</span></header>
    <section className="member-profile">
      <div><p className="member-kicker">{tx({ en: "YOUR DAILY DOSE OF GOOD", zh: "美好，与你如期相遇" })}</p><h1>{isLoggedIn ? member?.name : tx({ en: "Hello, tea lover.", zh: "你好，爱茶的你。" })}</h1><p className="member-phone">{isLoggedIn ? member?.phone : t("me.loginPrompt")}</p></div>
      <div className="member-avatar" aria-hidden="true">{isLoggedIn ? initials : "茶"}<span>✦</span></div>
    </section>

    <section className="club-card" aria-label={tx({ en: "Membership card", zh: "会员卡" })}>
      <div className="club-card-art" aria-hidden="true"><span/><span/><span/><span/></div>
      <div className="club-card-top"><span>CHATEA MEMBERSHIP</span><span className="club-tier">✦ {isLoggedIn ? member?.tier : "WELCOME"}</span></div>
      <div className="club-card-title">{tx({ en: "Life tastes better", zh: "好茶相伴" })}<br/><em>{tx({ en: "with a little tea.", zh: "美好自然而来。" })}</em></div>
      <div className="club-card-bottom"><span>{isLoggedIn ? tx({ en: "A little thank you for every sip.", zh: "每一次相遇，都值得珍惜。" }) : tx({ en: "Your next favorite starts here.", zh: "你的下一杯心头好，从这里开始。" })}</span>{!isLoggedIn && <button onClick={() => setLoginOpen(true)}>{t("common.login")} <span aria-hidden="true">↗</span></button>}{isLoggedIn && <span className="club-signature">ChaTea</span>}</div>
    </section>

    <section className="member-shortcuts" aria-label={tx({ en: "Your membership", zh: "我的会员" })}>
      <div className="member-points"><span className="member-stat-number">{isLoggedIn ? member?.points ?? 0 : "—"}<span className="points-spark">✦</span></span><span>{t("me.points")}</span></div>
      <button onClick={() => openMemberPage("/stores?tab=favorites")}><span className="member-shortcut-icon"><Icon name="heart" className="h-6 w-6"/>{isLoggedIn && <b>{member?.favoriteStoreIds.length ?? 0}</b>}</span><span>{t("store.favorites")}</span></button>
      <button onClick={() => openMemberPage("/orders")}><span className="member-shortcut-icon"><Icon name="orders" className="h-6 w-6"/></span><span>{t("orders.title")}</span></button>
    </section>

    <section className="member-preferences"><h2>{tx({ en: "Make yourself at home", zh: "按你的喜好来" })}</h2><p className="member-section-sub">{tx({ en: "The little things, your way.", zh: "小小细节，也合你心意。" })}</p>
      <div className="member-setting-list"><div className="member-setting-row"><span className="member-setting-icon"><Icon name="ticket" className="h-5 w-5"/></span><div className="member-setting-copy"><h3>{t("me.memberPrice")}</h3><p>{t("me.memberPriceHint")}</p></div><button role="switch" aria-label={t("me.memberPrice")} aria-checked={memberPriceEnabled} onClick={() => setMemberPriceEnabled(!memberPriceEnabled)} className={`member-switch ${memberPriceEnabled ? "is-on" : ""}`}><span/></button></div>
      <button onClick={toggleLocale} className="member-setting-row"><span className="member-setting-icon"><Icon name="globe" className="h-5 w-5"/></span><span className="member-setting-copy"><span className="member-setting-title">{t("me.language")}</span></span><span className="member-language">{locale === "en" ? "English" : "中文"}</span><Icon name="chevron-right" className="h-4 w-4 text-muted"/></button></div>
    </section>

    <button className="member-tea-note" onClick={() => navigate(selectedStoreId ? "/menu" : "/stores")}><span className="member-note-icon"><Icon name="menu" className="h-7 w-7"/></span><span><strong>{tx({ en: "A good day starts with tea.", zh: "今天的美好，从一杯茶开始。" })}</strong><small>{tx({ en: "Find your next favorite", zh: "寻找你的下一杯心头好" })}</small></span><Icon name="chevron-right" className="h-4 w-4"/></button>
    {isLoggedIn && (
      <section className="member-logout-section">
        <button className="member-logout" onClick={() => setLogoutConfirm(true)}>
          <Icon name="logout" className="h-5 w-5"/>
          {t("common.logout")}
        </button>
        <p className="member-logout-hint">{tx({ en: "Signed in as", zh: "当前登录账号" })} {member?.phone}</p>
      </section>
    )}
    <footer className="member-footer"><p>CHATEA · {tx({ en: "MADE FOR YOUR EVERYDAY", zh: "让好茶融入日常" })}</p><span>{tx({ en: "Demo experience · No real transactions", zh: "原型体验 · 不产生真实交易" })}</span></footer>
    <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)}/>
    <ConfirmDialog open={logoutConfirm} title={t("common.logout")} body={tx({ en: "Confirm logging out?", zh: "确认退出登录？" })} confirmLabel={t("common.yes")} cancelLabel={t("common.no")} onConfirm={() => { logout(); setLogoutConfirm(false); }} onCancel={() => setLogoutConfirm(false)}/>
  </div>;
}
