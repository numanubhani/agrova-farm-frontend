import { useCallback, useEffect, useState } from 'react';
import { KV, useConfirm } from '../components/ui';
import { useAppState } from '../context/AppStateContext';
import { useToast } from '../context/ToastContext';
import { Admin, Reports as ReportsApi, Settings, apiErrorMessage } from '../lib/api';
import { lt, rs } from '../lib/format';

export default function Reports() {
  const { month, farmName, setFarmName } = useAppState();
  const toast = useToast();
  const confirm = useConfirm();
  const [data, setData] = useState(null);

  const load = useCallback(() => { ReportsApi.get(month).then(setData); }, [month]);
  useEffect(() => { load(); }, [load]);

  const saveFarmName = async (name) => {
    try {
      const s = await Settings.update({ name });
      setFarmName(s.name);
      toast.success('Saved');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Save nahi hua'));
    }
  };

  const resetDemo = () => confirm('Demo data wapas lana hai? Mojooda data hat jayega.', async () => {
    await Admin.resetDemo();
    toast.success('Demo data wapas aa gaya');
    load();
  });

  const clearAll = () => confirm('Sab data delete ho jayega. Pakka?', async () => {
    await Admin.clearAll();
    toast.success('Sab data clear ho gaya');
    load();
  });

  if (!data) return <div className="page" />;
  const { stats } = data;

  return (
    <div className="page">
      <div className="card">
        <KV label="Milk produced" value={lt(stats.prod)} />
        <KV label="Milk sold" value={lt(stats.delivered)} />
        <KV label="Milk sale" value={rs(stats.sale)} />
        <KV label="Total expense" value={rs(stats.exp)} />
        <KV label={stats.profit >= 0 ? 'Profit' : 'Loss'} value={rs(Math.abs(stats.profit))} color={stats.profit >= 0 ? 'var(--green)' : 'var(--red)'} tot />
        <KV label="Payment received" value={rs(stats.received)} />
        <KV label="Pending (udhaar)" value={rs(stats.pending)} />
        <div className="acts">
          <a className="btn block" href={ReportsApi.exportUrl(month)}>Download Excel report</a>
        </div>
        <p className="hint" style={{ margin: '10px 0 0' }}>Excel mein 6 sheets: Summary, Bills, Daily Delivery, Production, Expenses, Payments.</p>
      </div>

      <h2 className="sec">Settings</h2>
      <div className="card">
        <label>Farm name</label>
        <input key={farmName} defaultValue={farmName} onBlur={(e) => e.target.value.trim() && saveFarmName(e.target.value.trim())} />
        <div className="acts">
          <button className="btn sm ghost" onClick={resetDemo}>Demo data</button>
          <button className="btn sm danger" onClick={clearAll}>Sab khali karo</button>
        </div>
      </div>
    </div>
  );
}
