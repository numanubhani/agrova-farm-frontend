import { createContext, useContext, useEffect, useState } from 'react';
import { Settings } from '../lib/api';
import { shiftDate as shiftDateStr, shiftMonth as shiftMonthStr, thisMonthStr, todayStr } from '../lib/format';

const AppStateCtx = createContext(null);

function readTheme() {
  try {
    return localStorage.getItem('farm_theme') || 'auto';
  } catch {
    return 'auto';
  }
}

export function AppStateProvider({ children }) {
  const [month, setMonth] = useState(thisMonthStr());
  const [date, setDate] = useState(todayStr());
  const [theme, setThemeState] = useState(readTheme());
  const [farmName, setFarmName] = useState('Farm Manager');

  useEffect(() => {
    Settings.get().then((s) => s.name && setFarmName(s.name)).catch(() => {});
  }, []);

  const effTheme = () => {
    if (theme !== 'auto') return theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (t) => {
    const root = document.documentElement;
    if (t === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
    const dark = t === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : t === 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#0e2218' : '#256b43';
  };

  useEffect(() => {
    applyTheme(theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => theme === 'auto' && applyTheme('auto');
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [theme]);

  const setTheme = (t) => {
    setThemeState(t);
    try {
      localStorage.setItem('farm_theme', t);
    } catch {}
  };

  const value = {
    month,
    setMonth,
    shiftMonth: (n) => setMonth((m) => shiftMonthStr(m, n)),
    date,
    setDate,
    shiftDate: (n) => setDate((d) => shiftDateStr(d, n)),
    theme,
    setTheme,
    effTheme: effTheme(),
    farmName,
    setFarmName,
  };

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
