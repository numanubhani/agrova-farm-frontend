export const ymd = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export const todayStr = () => ymd(new Date());
export const thisMonthStr = () => todayStr().slice(0, 7);

const num = (n) => Number(n) || 0;

export const rs = (n) => 'Rs ' + Math.round(num(n)).toLocaleString('en-US');
export const lt = (n) => (Math.round(num(n) * 10) / 10).toLocaleString('en-US') + ' L';

export const monthName = (m) =>
  new Date(m + '-01T00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
export const monthShort = (m) =>
  new Date(m + '-01T00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export const initials = (n) =>
  (n || '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export const shiftMonth = (m, n) => {
  const [y, mo] = m.split('-').map(Number);
  return ymd(new Date(y, mo - 1 + n, 1)).slice(0, 7);
};
export const shiftDate = (d, n) => {
  const dt = new Date(d + 'T00:00');
  dt.setDate(dt.getDate() + n);
  return ymd(dt);
};

export const CATS = [
  'Chara (Feed)', 'Wanda / Khal', 'Medicine / Doctor', 'Labour Salary',
  'Bijli', 'Diesel / Transport', 'Maintenance', 'Other',
];
const CAT_IC = ['🌾', '🫘', '💊', '👷', '⚡', '⛽', '🔧', '📦'];
export const catIcon = (c) => CAT_IC[CATS.indexOf(c)] || '📦';
