import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { TeaArtwork } from "@/components/ui/TeaArtwork";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/stores/useAuth";
import { useSettings } from "@/stores/useSettings";
import { LoginSheet } from "./LoginSheet";

export function HomePage() {
  const { t, tx } = useT();
  const navigate = useNavigate();
  const { isLoggedIn, member } = useAuth();
  const storeId = useSettings(s => s.selectedStoreId);
  const [loginOpen, setLoginOpen] = useState(false);
  const order = () => navigate(storeId ? "/menu" : "/stores");
  return <div className="home-page">
    <header className="home-header"><a href="/" className="wordmark"><span className="brand-seal">茶</span>ChaTea<span className="brand-dot">®</span></a><LanguageToggle /></header>
    <section className="matcha-hero">
      <div className="hero-orbit" />
      <div className="hero-copy"><p className="eyebrow">A LITTLE GREEN. A LITTLE SERENITY.</p><h1>{tx({ en: "Your daily", zh: "把一抹清新" })}<br/><em>{tx({ en: "moment of zen.", zh: "融入日常。" })}</em></h1><p className="hero-description">{tx({ en: "Meet your matcha. Rich, creamy,\nand made just for you.", zh: "细腻抹茶，醇香鲜奶。\n为你现制的片刻美好。" })}</p><button onClick={order} className="hero-cta">{tx({ en: "Explore matcha", zh: "探索抹茶系列" })}<Icon name="chevron-right" className="h-4 w-4"/></button></div>
      <div className="hero-tea hero-tea-back"><TeaArtwork color="#405f36"/></div><div className="hero-tea hero-tea-front"><TeaArtwork color="#779453"/></div>
      <span className="hero-caption">THE MATCHA COLLECTION</span><div className="hero-pagination"><span/><span/><span/></div>
    </section>
    <section className="welcome-card"><div><p className="eyebrow">{tx({ en: "GOOD TEA, GOOD DAY", zh: "好茶，让今天更美好" })}</p><h2>{isLoggedIn ? member?.name : tx({ en: "Hello, tea lover.", zh: "你好，爱茶的你。" })}</h2><p>{isLoggedIn ? `${member?.points ?? 0} ${t("me.points")}` : tx({ en: "A little sip. A lot to look forward to.", zh: "每一口，都有值得期待的美好。" })}</p></div><button className="welcome-action" onClick={() => isLoggedIn ? navigate("/me") : setLoginOpen(true)}>{isLoggedIn ? t("tab.me") : t("common.login")}<Icon name="chevron-right" className="h-4 w-4"/></button></section>
    <div className="service-grid"><button onClick={order} className="service-card"><span className="service-icon"><Icon name="bag" className="h-7 w-7"/></span><h2>{t("common.pickup")}</h2><p>{t("home.pickupDesc")}</p><Icon name="chevron-right" className="service-arrow h-5 w-5"/></button><div className="service-card delivery-card"><span className="soon-pill">{t("common.comingSoon")}</span><span className="service-icon"><Icon name="location" className="h-7 w-7"/></span><h2>{t("common.delivery")}</h2><p>{t("home.deliveryDesc")}</p></div></div>
    <button className="rewards-card" onClick={() => isLoggedIn ? navigate("/me") : setLoginOpen(true)}><div><p className="eyebrow">CHATEA CLUB</p><h2>{tx({ en: "Good taste. Great rewards.", zh: "每次好茶，都有回馈。" })}</h2><p>{t("home.member.sub")}</p><span>{isLoggedIn ? t("tab.me") : t("home.member.cta")} <span aria-hidden="true">↗</span></span></div><div className="reward-stamp"><Icon name="gift" className="h-8 w-8"/><span>MADE FOR YOU</span></div></button>
    <section className="discover-section"><div className="section-heading"><div><p className="eyebrow">FRESH FROM CHATEA</p><h2>{tx({ en: "A sip of something new", zh: "发现一口新鲜" })}</h2></div><button onClick={order} aria-label={t("tab.menu")}><Icon name="chevron-right" className="h-5 w-5"/></button></div><button onClick={order} className="discovery-card"><div><span className="editorial-label">{tx({ en: "YOUR NEXT FAVORITE", zh: "下一杯心头好" })}</span><h3>{tx({ en: "Matcha made\nfor your mood.", zh: "一杯抹茶，\n恰好合你心意。" })}</h3><p>{tx({ en: "Find your perfect green moment", zh: "找到属于你的抹茶时刻" })} <span aria-hidden="true">↗</span></p></div><TeaArtwork color="#7d9257" className="discovery-tea"/></button></section>
    <p className="home-footer">CRAFTED WITH CARE · SIPPED WITH JOY</p>
    <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)}/>
  </div>;
}
