import Icon from './Icon';
import { lt, rs, todayStr } from '../lib/format';
import { useAppState } from '../context/AppStateContext';
import { useModal } from '../context/ModalContext';

export function Tile({ cls = '', icon, label, value }) {
  return (
    <div className={`tile ${cls}`}>
      <div className="ic">
        <Icon name={icon} />
      </div>
      <div className="k">{label}</div>
      <div className="v">{value}</div>
    </div>
  );
}

export function Hero({ loss, label, amount, sub }) {
  return (
    <div className={`hero ${loss ? 'loss' : ''}`}>
      <div className="lbl">{label}</div>
      <div className="big">{rs(Math.abs(amount))}</div>
      {sub && (
        <div className="sub">
          {sub.map((s) => (
            <div key={s.label}>
              <small>{s.label}</small>
              <b>{s.value}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function KV({ label, value, tot, color }) {
  return (
    <div className={`kv ${tot ? 'tot' : ''}`}>
      <span>{label}</span>
      <b style={color ? { color } : undefined}>{value}</b>
    </div>
  );
}

export function Pill({ children, variant }) {
  return <span className={`pill ${variant || ''}`}>{children}</span>;
}

export function LitersBar({ categories }) {
  const max = categories.length ? categories[0].total : 1;
  if (!categories.length) return <p className="hint" style={{ margin: 0 }}>Is mahine koi expense nahi.</p>;
  return categories.map((c) => (
    <div className="cat" key={c.category}>
      <div className="kv" style={{ padding: 0 }}>
        <span style={{ color: 'var(--ink)' }}>{c.icon} {c.category}</span>
        <b>{rs(c.total)}</b>
      </div>
      <div className="bar">
        <i style={{ width: `${(c.total / max) * 100}%` }} />
      </div>
    </div>
  ));
}

export function DateBar() {
  const { date, setDate, shiftDate } = useAppState();
  const dt = new Date(date + 'T00:00');
  const isToday = date === todayStr();
  return (
    <div className="dbar">
      <button onClick={() => shiftDate(-1)} aria-label="Previous day"><Icon name="left" /></button>
      <div className="mid">
        <b>{dt.toLocaleDateString('en-US', { weekday: 'long' })}{isToday ? ' · Aaj' : ''}</b>
        <small>{dt.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
        <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} aria-label="Pick date" />
      </div>
      <button onClick={() => shiftDate(1)} aria-label="Next day"><Icon name="right" /></button>
    </div>
  );
}

export function useConfirm() {
  const { open, close } = useModal();
  return (message, onConfirm) => {
    open(
      <>
        <h3>{message}</h3>
        <div className="acts">
          <button className="btn ghost" onClick={close}>Nahi</button>
          <button
            className="btn danger"
            onClick={() => {
              close();
              onConfirm();
            }}
          >
            Haan
          </button>
        </div>
      </>
    );
  };
}

export { lt, rs };
