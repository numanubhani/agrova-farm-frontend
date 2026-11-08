import { useState } from 'react';
import { Payments, apiErrorMessage } from '../lib/api';
import { rs, todayStr } from '../lib/format';
import { useToast } from '../context/ToastContext';

export default function PaymentForm({ customer, balance, onClose, onSaved }) {
  const toast = useToast();
  const [amount, setAmount] = useState(String(Math.max(0, Math.round(balance))));
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const a = parseFloat(amount) || 0;
    if (a <= 0) return toast.warn('Amount likho');
    setSaving(true);
    try {
      await Payments.create({ customer: customer.id, date, amount: a, note });
      toast.success('Payment save ho gayi');
      onClose();
      onSaved?.();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Payment save nahi hua'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h3>Payment · {customer.name}</h3>
      <p className="hint">Balance: {rs(balance)}</p>
      <div className="form">
        <div className="full">
          <label>Amount (Rs)</label>
          <input type="number" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label>Note</label>
          <input placeholder="Cash / JazzCash" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <div className="acts">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={submit} disabled={saving}>Save</button>
      </div>
    </>
  );
}
