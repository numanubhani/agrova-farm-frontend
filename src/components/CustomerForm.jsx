import { useState } from 'react';
import { Customers, apiErrorMessage } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function CustomerForm({ customer, onClose, onSaved }) {
  const toast = useToast();
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [rate, setRate] = useState(customer?.rate ?? '');
  const [qty, setQty] = useState(customer?.qty ?? '');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const n = name.trim();
    const r = parseFloat(rate) || 0;
    const q = parseFloat(qty) || 0;
    if (!n || r <= 0) return toast.warn('Name aur rate zaroori hain');
    setSaving(true);
    try {
      if (customer) {
        await Customers.update(customer.id, { name: n, phone, rate: r, qty: q });
      } else {
        await Customers.create({ name: n, phone, rate: r, qty: q, active: true });
      }
      toast.success('Customer save ho gaya');
      onClose();
      onSaved?.();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Save nahi hua'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h3>{customer ? 'Edit customer' : 'Naya customer'}</h3>
      <p className="hint">&nbsp;</p>
      <div className="form">
        <div className="full">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="full">
          <label>Phone</label>
          <input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Rate (Rs/L)</label>
          <input type="number" inputMode="numeric" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <label>Daily qty (L)</label>
          <input type="number" inputMode="decimal" step="0.5" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
      </div>
      <div className="acts">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={submit} disabled={saving}>{customer ? 'Update' : 'Add'}</button>
      </div>
    </>
  );
}
