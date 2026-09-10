import { useAuth } from "./useAuth";
import { useSettings } from "./useSettings";

/** Member pricing applies only when logged in AND the member-price switch is on. */
export function useMemberMode(): boolean {
  const isLoggedIn = useAuth((s) => s.isLoggedIn);
  const enabled = useSettings((s) => s.memberPriceEnabled);
  return isLoggedIn && enabled;
}
