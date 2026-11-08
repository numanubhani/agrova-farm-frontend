import { useRef, useState } from 'react';
import { Expenses, apiErrorMessage } from '../lib/api';
import { CATS, todayStr } from '../lib/format';
import { useToast } from '../context/ToastContext';
import { useAppState } from '../context/AppStateContext';

export default function ExpenseForm({ onClose, onSaved }) {
  const toast = useToast();
  const { setMonth } = useAppState();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayStr());
  const [category, setCategory] = useState(CATS[0]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const amtRef = useRef(null);

  const submit = async () => {
    const a = parseFloat(amount) || 0;
    if (a <= 0) return toast.warn('Amount likho');
    setSaving(true);
    try {
      await Expenses.create({ date, category, amount: a, note });
      setMonth(date.slice(0, 7));
      toast.success('Expense add ho gaya');
      onClose();
      onSaved?.();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Expense add nahi hua'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h3>Naya expense</h3>
      <p className="hint">&nbsp;</p>
      <div className="form">
        <div>
          <label>Amount (Rs)</label>
          <input ref={amtRef} type="number" inputMode="numeric" min="0" placeholder="0" value={amount}
            onChange={(e) => setAmount(e.target.value)} autoFocus />
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="full">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="full">
          <label>Note</label>
          <input placeholder="Detail (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <div className="acts">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={submit} disabled={saving}>Add</button>
      </div>
    </>
  );
}
