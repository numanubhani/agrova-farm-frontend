const PATHS = {
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h5v-6h4v6h5V10" /></>,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>,
  bill: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  wallet: <><path d="M3 7a2 2 0 012-2h13v4" /><path d="M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2z" /><circle cx="16.5" cy="14.5" r="1.2" /></>,
  more: <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .7 3.5 2.5 3.5 5.5" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  left: <path d="M15 18l-6-6 6-6" />,
  right: <path d="M9 6l6 6-6 6" />,
  cash: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z" />,
  cow: <><path d="M5 9h14l1 4-2 1v5h-3v-4H9v4H6v-5l-2-1z" /><path d="M5 9L4 5M19 9l1-4" /></>,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  check: <path d="M4.5 12.5l5 5 10-10" />,
  alert: <><path d="M10.3 3.9L2.5 18a1.8 1.8 0 001.6 2.7h15.8a1.8 1.8 0 001.6-2.7L13.7 3.9a1.8 1.8 0 00-3.4 0z" /><path d="M12 9.5v4.2M12 17h.01" /></>,
};

export default function Icon({ name, className = 'ic', style }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg className={className} style={style} viewBox="0 0 24 24">
      {d}
    </svg>
  );
}
