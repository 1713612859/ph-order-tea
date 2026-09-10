import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/stores/useAuth";

export function LoginSheet({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const { t } = useT();
  const login = useAuth((s) => s.login);
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  const canSubmit = phone.replace(/\D/g, "").length >= 9 && agree;

  const submit = () => {
    if (!canSubmit) return;
    login(`+63 ${phone}`);
    onClose();
    onSuccess?.();
  };

  return (
    <Sheet open={open} onClose={onClose} title={<span className="tracking-wide">{t("login.welcome")}</span>}>
      <div className="space-y-4 pb-2">
        <div className="h-1 w-8 rounded bg-brand-red" />
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-cream-soft px-3 py-3 text-sm font-semibold text-navy">+63</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            placeholder={t("login.phone")}
            className="flex-1 border-b border-line py-3 text-sm outline-none placeholder:text-muted focus:border-navy"
          />
        </div>
        <input
          placeholder={t("login.referral")}
          className="w-full border-b border-line py-3 text-sm outline-none placeholder:text-muted focus:border-navy"
        />
        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-navy" />
          <span>{t("login.terms")}</span>
        </label>
        <button disabled={!canSubmit} onClick={submit} className="btn-primary w-full">
          {t("common.continue")}
        </button>
        <p className="text-center text-xs text-muted">{t("login.otpHint")}</p>
      </div>
    </Sheet>
  );
}
