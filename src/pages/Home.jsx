import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { Hero, KV, LitersBar, Tile } from '../components/ui';
import ExpenseForm from '../components/ExpenseForm';
import { useAppState } from '../context/AppStateContext';
import { useModal } from '../context/ModalContext';
import { Dashboard } from '../lib/api';
import { catIcon, lt, rs } from '../lib/format';

export default function Home() {
  const { month, setDate } = useAppState();
  const navigate = useNavigate();
  const { open, close } = useModal();
  const [data, setData] = useState(null);

  const load = useCallback(() => {
    Dashboard.get(month).then(setData);
  }, [month]);

  useEffect(() => { load(); }, [load]);

  if (!data) return <div className="page" />;

  const { stats, categories, today } = data;
  const cats = categories.map((c) => ({ ...c, icon: catIcon(c.category) }));
  const prodToday = today.production ? today.production.total : null;

  const openExpense = () => open(<ExpenseForm onClose={close} onSaved={load} />);

  return (
    <div className="page">
      {!today.delivery_entered && (
        <button
          className="row tap"
          style={{ background: 'var(--amber-soft)', color: 'var(--amber)', borderRadius: 'var(--r-card)', marginBottom: 12, border: 0 }}
          onClick={() => { setDate(today.date); navigate('/delivery'); }}
        >
          <div className="grow">
            <div className="t">Aaj ki delivery abhi enter nahi hui</div>
            <div className="s" style={{ color: 'inherit' }}>Tap karke likho kis ko kitna gaya</div>
          </div>
          <Icon name="right" />
        </button>
      )}

      <Hero
        loss={stats.profit < 0}
        label={`${stats.profit >= 0 ? 'Profit' : 'Loss'} · ${new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
        amount={stats.profit}
        sub={[
          { label: 'Milk sale', value: rs(stats.sale) },
          { label: 'Expense', value: rs(stats.exp) },
        ]}
      />

      <div className="qa">
        <button onClick={() => navigate('/delivery')}><i><Icon name="truck" /></i>Delivery</button>
        <button onClick={() => navigate('/milk')}><i><Icon name="drop" /></i>Milk entry</button>
        <button onClick={openExpense}><i><Icon name="wallet" /></i>Add expense</button>
      </div>

      <h2 className="sec">Aaj</h2>
      <div className="tiles">
        <Tile icon="drop" label="Aaj ka doodh" value={prodToday !== null ? lt(prodToday) : '—'} />
        <Tile icon="truck" label="Aaj delivered" value={lt(today.delivered)} />
      </div>

      <h2 className="sec">Is mahine</h2>
      <div className="tiles">
        <Tile icon="cash" label="Payment received" value={rs(stats.received)} />
        <Tile cls="warn" icon="clock" label="Pending (udhaar)" value={rs(stats.pending)} />
        <Tile icon="chart" label="Kharcha per liter" value={stats.cpl ? 'Rs ' + stats.cpl.toFixed(1) : '—'} />
        <Tile icon="cow" label="Produced" value={lt(stats.prod)} />
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
    </div>
  );
}
