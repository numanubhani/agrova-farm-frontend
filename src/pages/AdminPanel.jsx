import { useState } from 'react';
import Icon from '../components/Icon';
import { useAppState } from '../context/AppStateContext';
import { monthShort } from '../lib/format';
import AdminDashboardTab from './admin/AdminDashboardTab';
import AdminBillsTab from './admin/AdminBillsTab';
import AdminUsersTab from './admin/AdminUsersTab';

const TABS = [
  ['dashboard', 'chart', 'Dashboard'],
  ['bills', 'bill', 'Bills'],
  ['users', 'users', 'Users'],
];

export default function AdminPanel() {
  const { month, shiftMonth } = useAppState();
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="page">
      <div className="seg">
        {TABS.map(([key, icon, label]) => (
          <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>
            <Icon name={icon} />{label}
          </button>
        ))}
      </div>

      {tab !== 'users' && (
        <div className="dbar" style={{ marginTop: 12 }}>
          <button onClick={() => shiftMonth(-1)} aria-label="Previous month"><Icon name="left" /></button>
          <div className="mid"><b>{monthShort(month)}</b></div>
          <button onClick={() => shiftMonth(1)} aria-label="Next month"><Icon name="right" /></button>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {tab === 'dashboard' && <AdminDashboardTab month={month} />}
        {tab === 'bills' && <AdminBillsTab month={month} />}
        {tab === 'users' && <AdminUsersTab />}
      </div>
    </div>
  );
}
