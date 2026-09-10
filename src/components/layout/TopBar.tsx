import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

interface TopBarProps {
  title?: ReactNode;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
}

export function TopBar({ title, onBack, right, transparent }: TopBarProps) {
  const navigate = useNavigate();
  return (
    <header
      className={`sticky top-0 z-30 flex h-14 items-center px-3 ${
        transparent ? "bg-transparent" : "border-b border-line bg-cream/95 backdrop-blur"
      }`}
    >
      <button
        onClick={() => (onBack ? onBack() : navigate(-1))}
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-cream-soft"
      >
        <Icon name="back" />
      </button>
      <h1 className="flex-1 text-center text-base font-bold text-navy">{title}</h1>
      <div className="flex h-10 min-w-10 items-center justify-center">{right}</div>
    </header>
  );
}
