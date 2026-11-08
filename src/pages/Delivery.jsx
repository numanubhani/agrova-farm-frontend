import { useEffect, useMemo, useState } from 'react';
import { DateBar } from '../components/ui';
import { useAppState } from '../context/AppStateContext';
import { useToast } from '../context/ToastContext';
import { Customers, Deliveries, apiErrorMessage } from '../lib/api';
import { initials, lt, rs } from '../lib/format';

export default function Delivery() {
  const { date } = useAppState();
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [saved, setSaved] = useState(null);
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Customers.list().then(setCustomers);
  }, []);

  useEffect(() => {
    Deliveries.forDate(date).then((rows) => {
      setSaved(Object.keys(rows).length ? rows : null);
      setValues(rows);
    });
  }, [date]);

  const list = useMemo(
    () => customers.filter((c) => c.active || (saved && saved[c.id] !== undefined)),
    [customers, saved]
  );

  const setQty = (id, v) => setValues((prev) => ({ ...prev, [id]: v }));
  const step = (id, dir) => {
    const cur = parseFloat(values[id]) || 0;
    setQty(id, Math.max(0, cur + dir) || '');
  };

  const total = useMemo(() => {
    let liters = 0, amount = 0;
    for (const c of list) {
      const v = parseFloat(values[c.id]) || 0;
      liters += v;
      amount += v * Number(c.rate);
    }
    return { liters, amount };
  }, [list, values]);

  const save = async () => {
    setSaving(true);
    try {
      const entries = {};
      list.forEach((c) => { entries[c.id] = parseFloat(values[c.id]) || 0; });
      await Deliveries.save(date, entries);
      toast.success('Delivery save ho gayi');
      setSaved(entries);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Delivery save nahi hui'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <DateBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, margin: '0 4px 10px' }}>
        <p className="hint" style={{ margin: 0 }}>
          {saved ? <><span className="pill">Saved</span> Is din ki entry mojood hai, edit kar sakte ho.</> : 'Aaj kis ko kitna doodh gaya, khud likho. Jisko nahi gaya usay khali chhor do.'}
        </p>
        <button className="btn sm ghost" style={{ flex: 'none' }} onClick={() => {
          const next = {};
          list.forEach((c) => { next[c.id] = c.qty; });
          setValues(next);
        }}>Sab usual</button>
      </div>
      <div className="list">
        {list.length === 0 && <div className="row"><div className="s">Pehle customer add karo.</div></div>}
        {list.map((c) => (
          <div className="row" key={c.id}>
            <div className="av">{initials(c.name)}</div>
            <div className="grow">
              <div className="t">{c.name}</div>
              <button className="chip" onClick={() => setQty(c.id, c.qty)}>Usual {c.qty} L</button>
            </div>
            <div className="step">
              <button onClick={() => step(c.id, -1)} aria-label="Less">−</button>
              <input
                type="number" inputMode="decimal" min="0" step="0.5" placeholder="0"
                value={values[c.id] ?? ''}
                onChange={(e) => setQty(c.id, e.target.value)}
              />
              <button onClick={() => step(c.id, 1)} aria-label="More">+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="sticky-save">
        <div className="totbar">
          <div>
            <small>Total delivery</small>
            <b>{lt(total.liters)} · {rs(total.amount)}</b>
          </div>
          <button className="btn" onClick={save} disabled={saving}>Save</button>
        </div>
      </div>
    </div>
  );
}
