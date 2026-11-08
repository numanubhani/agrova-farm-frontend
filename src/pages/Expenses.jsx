import { useCallback, useEffect, useState } from 'react';
import { Hero, useConfirm } from '../components/ui';
import Fab from '../components/Fab';
import ExpenseForm from '../components/ExpenseForm';
import { useAppState } from '../context/AppStateContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import { Expenses as ExpensesApi, apiErrorMessage } from '../lib/api';
import { catIcon, monthShort, rs } from '../lib/format';

export default function Expenses() {
  const { month } = useAppState();
  const { open, close } = useModal();
  const toast = useToast();
  const confirm = useConfirm();
  const [list, setList] = useState([]);

  const load = useCallback(() => { ExpensesApi.list(month).then(setList); }, [month]);
  useEffect(() => { load(); }, [load]);

  const total = list.reduce((t, e) => t + Number(e.amount), 0);

  const del = (id) => confirm('Yeh expense delete karna hai?', async () => {
    try {
      await ExpensesApi.remove(id);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Delete nahi hua'));
    }
  });

  return (
    <div className="page">
      <Hero loss label={`Total expense · ${monthShort(month)}`} amount={total} />
      <h2 className="sec">Is mahine ki list</h2>
      <div className="list">
        {list.length === 0 && <div className="row"><div className="s">Is mahine koi expense nahi.</div></div>}
        {list.map((e) => (
          <div className="row" key={e.id}>
            <div className="ei">{catIcon(e.category)}</div>
            <div className="grow">
              <div className="t">{e.category}</div>
              <div className="s">{new Date(e.date + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}{e.note ? ' · ' + e.note : ''}</div>
            </div>
            <div className="num">{rs(e.amount)}</div>
            <button className="btn sm danger" style={{ padding: '0 11px' }} onClick={() => del(e.id)} aria-label="Delete">✕</button>
          </div>
        ))}
      </div>
      <Fab onClick={() => open(<ExpenseForm onClose={close} onSaved={load} />)} />
    </div>
  );
}
