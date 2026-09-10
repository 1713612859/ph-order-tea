import { Outlet } from "react-router-dom";
import { BottomTab } from "./BottomTab";

/**
 * The bottom tab bar is always present. Pages that need their own action bar
 * (cart total, add-to-bag, pay) portal it into #action-slot, which sits
 * directly above the tabs — so the two stack instead of overlapping.
 */
export function AppShell() {
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col">
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <div className="app-footer sticky bottom-0 z-40">
        <div id="action-slot" />
        <BottomTab />
      </div>
    </div>
  );
}
