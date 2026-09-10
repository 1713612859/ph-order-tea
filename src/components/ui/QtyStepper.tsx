import { Icon } from "./Icon";

interface QtyStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  size?: "sm" | "md";
}

export function QtyStepper({ value, onChange, min = 1, size = "md" }: QtyStepperProps) {
  const box = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease"
        className={`${box} flex items-center justify-center rounded-lg border border-line text-navy disabled:opacity-30`}
      >
        <Icon name="minus" className="h-4 w-4" />
      </button>
      <span className="min-w-5 text-center text-sm font-semibold tabular-nums text-navy">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label="Increase"
        className={`${box} flex items-center justify-center rounded-lg bg-navy text-white`}
      >
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}
