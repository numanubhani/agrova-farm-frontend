import { useCallback, useEffect, useState } from 'react';
import { Pill } from '../components/ui';
import Fab from '../components/Fab';
import CustomerForm from '../components/CustomerForm';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import { Customers as CustomersApi, apiErrorMessage } from '../lib/api';
import { initials } from '../lib/format';

export default function Customers() {
  const { open, close } = useModal();
  const toast = useToast();
  const [list, setList] = useState([]);

  const load = useCallback(() => { CustomersApi.list().then(setList); }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (c) => {
    try {
      await CustomersApi.update(c.id, { active: !c.active });
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Update nahi hua'));
    }
  };

  return (
    <div className="page">
      <div className="list">
        {list.length === 0 && <div className="row"><div className="s">Koi customer nahi.</div></div>}
        {list.map((c) => (
          <div className="row" key={c.id}>
            <div className="av" style={{ opacity: c.active ? 1 : 0.5 }}>{initials(c.name)}</div>
            <div className="grow">
              <div className="t">{c.name} {!c.active && <Pill variant="due">Band</Pill>}</div>
              <div className="s">{c.phone} · Rs {Number(c.rate)}/L · {Number(c.qty)} L daily</div>
            </div>
            <button className="btn sm ghost" onClick={() => open(<CustomerForm customer={c} onClose={close} onSaved={load} />)}>Edit</button>
            <button className={`btn sm ${c.active ? 'danger' : ''}`} onClick={() => toggle(c)}>{c.active ? 'Band' : 'Chalu'}</button>
          </div>
        ))}
      </div>
      <Fab onClick={() => open(<CustomerForm onClose={close} onSaved={load} />)} />
    </div>
  );
}
