import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders a page-level action bar into the shell slot above the bottom tabs.
 * Keeps it pinned without hard-coded offsets and without covering content.
 */
export function ActionBar({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlot(document.getElementById("action-slot"));
  }, []);

  if (!slot) return null;
  return createPortal(<div className="action-bar">{children}</div>, slot);
}
