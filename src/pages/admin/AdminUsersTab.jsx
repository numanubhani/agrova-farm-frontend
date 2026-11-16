import { useEffect, useState } from 'react';
import { Auth, apiErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ROLES = ['admin', 'manager', 'staff'];
const MODULES = [
  ['customers', 'Customers'],
  ['deliveries', 'Delivery'],
  ['production', 'Milk Production'],
  ['expenses', 'Expenses'],
  ['payments', 'Payments'],
  ['bills', 'Bills'],
  ['reports', 'Reports'],
  ['settings', 'Farm Settings'],
];

export default function AdminUsersTab() {
  const { user: me, setUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Auth.users
      .list()
      .then(setUsers)
      .catch((e) => toast.error(apiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const save = async (u, patch) => {
    try {
      const updated = await Auth.users.update(u.id, patch);
      setUsers((list) => list.map((x) => (x.id === u.id ? updated : x)));
      if (updated.id === me.id) setUser((cur) => ({ ...cur, role: updated.role, permissions: updated.permissions }));
      toast.success('Update ho gaya');
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  };

  const togglePerm = (u, module, action) => {
    const current = u.permissions?.[module] || [];
    const has = current.includes(action);
    const next = has ? current.filter((a) => a !== action) : [...current, action];
    save(u, { permissions: { ...u.permissions, [module]: next } });
  };

  if (loading) return <p className="hint">Loading…</p>;

  return (
    <>
      {users.map((u) => (
        <div className="card" key={u.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 650 }}>
                {u.username} {u.id === me.id && <small style={{ color: 'var(--muted)' }}>(aap)</small>}
              </div>
              <div className="hint" style={{ margin: 0 }}>{u.email || '—'}</div>
            </div>
            <span className={`pill ${u.is_active ? '' : 'due'}`}>{u.is_active ? 'Active' : 'Deactivated'}</span>
          </div>

          <div className="form">
            <div className="full">
              <label>Role</label>
              <select
                value={u.role}
                disabled={u.id === me.id}
                onChange={(e) => save(u, { role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {u.role !== 'admin' && (
            <>
              <p className="hint" style={{ marginTop: 12, marginBottom: 6 }}>Module access</p>
              <div className="permgrid">
                {MODULES.map(([key, label]) => {
                  const acts = u.permissions?.[key] || [];
                  return (
                    <div className="permrow" key={key}>
                      <span>{label}</span>
                      <label>
                        <input type="checkbox" checked={acts.includes('view')} onChange={() => togglePerm(u, key, 'view')} />
                        View
                      </label>
                      <label>
                        <input type="checkbox" checked={acts.includes('edit')} onChange={() => togglePerm(u, key, 'edit')} />
                        Edit
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="acts">
            <button
              className={`btn ${u.is_active ? 'danger' : 'ghost'}`}
              disabled={u.id === me.id}
              onClick={() => save(u, { is_active: !u.is_active })}
            >
              {u.is_active ? 'Deactivate' : 'Reactivate'}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
