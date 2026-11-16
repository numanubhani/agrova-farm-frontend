import { useCallback, useEffect, useState } from 'react';
import { Hero, KV, LitersBar, Tile } from '../../components/ui';
import { Dashboard } from '../../lib/api';
import { catIcon, lt, rs } from '../../lib/format';

export default function AdminDashboardTab({ month }) {
  const [data, setData] = useState(null);

  const load = useCallback(() => {
    Dashboard.get(month).then(setData);
  }, [month]);

  useEffect(() => { load(); }, [load]);

  if (!data) return <p className="hint">Loading…</p>;

  const { stats, categories, today } = data;
  const cats = categories.map((c) => ({ ...c, icon: catIcon(c.category) }));

  return (
    <>
      <Hero
        loss={stats.profit < 0}
        label={`${stats.profit >= 0 ? 'Profit' : 'Loss'} · ${new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
        amount={stats.profit}
        sub={[
          { label: 'Milk sale', value: rs(stats.sale) },
          { label: 'Expense', value: rs(stats.exp) },
        ]}
      />

      <div className="tiles">
        <Tile icon="cash" label="Payment received" value={rs(stats.received)} />
        <Tile cls="warn" icon="clock" label="Pending (udhaar)" value={rs(stats.pending)} />
        <Tile icon="chart" label="Kharcha per liter" value={stats.cpl ? 'Rs ' + stats.cpl.toFixed(1) : '—'} />
        <Tile icon="cow" label="Produced" value={lt(stats.prod)} />
      </div>

      <h2 className="sec">Aaj</h2>
      <div className="tiles">
        <Tile icon="drop" label="Aaj ka doodh" value={today.production ? lt(today.production.total) : '—'} />
        <Tile icon="truck" label="Aaj delivered" value={lt(today.delivered)} />
      </div>

      <h2 className="sec">Doodh ka hisaab</h2>
      <div className="card">
        <KV label="Produced" value={lt(stats.prod)} />
        <KV label="Delivered (sold)" value={lt(stats.delivered)} />
        <KV label="Farq (ghar / zaya)" value={lt(stats.prod - stats.delivered)} tot />
      </div>

      <h2 className="sec">Expense by category</h2>
      <div className="card">
        <LitersBar categories={cats} />
      </div>
    </>
  );
}
