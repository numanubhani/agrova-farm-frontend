import { useCallback, useEffect, useState } from 'react';
import { Pill, Tile } from '../components/ui';
import PaymentForm from '../components/PaymentForm';
import ReceiptView from '../components/ReceiptView';
import { useAppState } from '../context/AppStateContext';
import { useModal } from '../context/ModalContext';
import { Bills as BillsApi } from '../lib/api';
import { initials, lt, rs } from '../lib/format';

export default function Bills() {
  const { month } = useAppState();
  const { open, close } = useModal();
  const [data, setData] = useState(null);

  const load = useCallback(() => { BillsApi.list(month).then(setData); }, [month]);
  useEffect(() => { load(); }, [load]);

  if (!data) return <div className="page" />;

  const totalBilled = data.bills.reduce((t, b) => t + b.amount, 0);
  const totalPending = data.bills.reduce((t, b) => t + b.balance, 0);

  return (
    <div className="page">
      <div className="tiles">
        <Tile icon="bill" label="Total billed" value={rs(totalBilled)} />
        <Tile cls="warn" icon="clock" label="Total pending" value={rs(totalPending)} />
      </div>
      {data.bills.map((b) => (
        <div className="card" key={b.customer.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div className="av">{initials(b.customer.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700 }}>{b.customer.name}</div>
              <div className="s" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{lt(b.liters)} × Rs {Number(b.customer.rate)}</div>
            </div>
            <Pill variant={b.balance > 0 ? 'due' : ''}>{b.balance > 0 ? 'Due' : 'Clear'}</Pill>
          </div>
          <div className="kv"><span>Is mahine ka bill</span><b>{rs(b.amount)}</b></div>
          <div className="kv"><span>Pichla balance</span><b>{rs(b.prev)}</b></div>
          <div className="kv"><span>Paid</span><b>{rs(b.paid)}</b></div>
          <div className="kv tot">
            <span>Balance</span>
            <b style={{ color: b.balance > 0 ? 'var(--red)' : 'var(--green)' }}>{rs(b.balance)}</b>
          </div>
          <div className="acts">
            <button
              className="btn sm"
              onClick={() => open(<PaymentForm customer={b.customer} balance={b.balance} onClose={close} onSaved={load} />)}
            >+ Payment</button>
            <button
              className="btn sm ghost"
              onClick={() => open(<ReceiptView customer={b.customer} onClose={close} />)}
            >Receipt</button>
          </div>
        </div>
      ))}
    </div>
  );
}
