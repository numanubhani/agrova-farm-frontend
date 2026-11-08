import { useCallback, useEffect, useState } from 'react';
import { DateBar } from '../components/ui';
import { useAppState } from '../context/AppStateContext';
import { useToast } from '../context/ToastContext';
import { Production, apiErrorMessage } from '../lib/api';
import { lt } from '../lib/format';

export default function Milk() {
  const { date, setDate } = useAppState();
  const toast = useToast();
  const [am, setAm] = useState('');
  const [pm, setPm] = useState('');
  const [recent, setRecent] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadRecent = useCallback(() => { Production.recent(10).then(setRecent); }, []);

  useEffect(() => {
    Production.forDate(date).then((p) => {
      setAm(p.am ?? '');
      setPm(p.pm ?? '');
    });
  }, [date]);

  useEffect(() => { loadRecent(); }, [loadRecent]);

  const save = async () => {
    setSaving(true);
    try {
      await Production.save(date, parseFloat(am) || 0, parseFloat(pm) || 0);
      toast.success('Production save ho gayi');
      loadRecent();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Save nahi hua'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <DateBar />
      <div className="card">
        <div className="form">
          <div>
            <label>Subah (L)</label>
            <input type="number" inputMode="decimal" min="0" step="0.5" placeholder="0" value={am} onChange={(e) => setAm(e.target.value)} />
          </div>
          <div>
            <label>Shaam (L)</label>
            <input type="number" inputMode="decimal" min="0" step="0.5" placeholder="0" value={pm} onChange={(e) => setPm(e.target.value)} />
          </div>
        </div>
        <div className="acts"><button className="btn" onClick={save} disabled={saving}>Save production</button></div>
      </div>

      <h2 className="sec">Last 10 days</h2>
      <div className="list">
        {recent.length === 0 && <div className="row"><div className="s">Koi entry nahi.</div></div>}
        {recent.map((r) => (
          <button className="row tap" key={r.date} onClick={() => setDate(r.date)}>
            <div className="ei">🥛</div>
            <div className="grow">
              <div className="t">{new Date(r.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
              <div className="s">Subah {r.am || 0} · Shaam {r.pm || 0} · Delivered {r.delivered || 0}</div>
            </div>
            <div className="num">{lt(r.total)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
