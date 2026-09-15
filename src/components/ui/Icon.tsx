interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

export type IconName =
  | "home"
  | "menu"
  | "orders"
  | "me"
  | "plus"
  | "minus"
  | "chevron-right"
  | "chevron-down"
  | "back"
  | "search"
  | "close"
  | "heart"
  | "heart-filled"
  | "check"
  | "check-circle"
  | "circle"
  | "trash"
  | "edit"
  | "location"
  | "clock"
  | "bag"
  | "ticket"
  | "globe"
  | "gift"
  | "logout";

const paths: Record<IconName, JSX.Element> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />,
  menu: (
    <>
      <path d="M8 3h8l-1 6H9L8 3Z" />
      <path d="M7.5 9h9l-1 10a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8L7.5 9Z" />
    </>
  ),
  orders: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3.5h6V6H9zM8.5 10h7M8.5 14h7M8.5 18h4" />
    </>
  ),
  me: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  back: <path d="m15 6-6 6 6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  heart: <path d="M12 20s-7-4.5-9.2-9C1.3 8 3 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3 0 4.7 3 3.2 6-2.2 4.5-9.2 9-9.2 9Z" transform="translate(-0.8 0)" />,
  "heart-filled": <path d="M12 20s-7-4.5-9.2-9C1.3 8 3 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3 0 4.7 3 3.2 6-2.2 4.5-9.2 9-9.2 9Z" transform="translate(-0.8 0)" fill="currentColor" />,
  check: <path d="m5 12 5 5 9-11" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
      <path d="m8 12 2.5 2.5L16 9" stroke="#fff" />
    </>
  ),
  circle: <circle cx="12" cy="12" r="9" />,
  trash: <path d="M4 7h16M9 7V5h6v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4" />,
  location: (
    <>
      <path d="M12 21c5-5.5 7-8.5 7-11a7 7 0 1 0-14 0c0 2.5 2 5.5 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M13 6v12" strokeDasharray="2 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8 6 12l4 4M6 12h10" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 13h16M12 9v11M12 9c-1-3-5-3-5-1s3 1 5 1Zm0 0c1-3 5-3 5-1s-3 1-5 1Z" />
    </>
  ),
};

export function Icon({ name, className = "h-6 w-6", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
