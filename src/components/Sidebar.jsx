import { NavLink, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  ['/', 'home', 'Home', true],
  ['/delivery', 'truck', 'Delivery'],
  ['/milk', 'drop', 'Milk Production'],
  ['/bills', 'bill', 'Bills'],
  ['/expenses', 'wallet', 'Expenses'],
  ['/customers', 'users', 'Customers'],
  ['/reports', 'chart', 'Reports'],
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { effTheme, setTheme, farmName } = useAppState();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="ic"><Icon name="cow" /></div>
        <b>{farmName}</b>
      </div>

      <nav>
        {LINKS.map(([to, icon, label, end]) => (
          <NavLink key={to} to={to} end={end}>
            <Icon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin">
            <Icon name="users" />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-foot">
        <button
          className="sidebar-icbtn"
          onClick={() => setTheme(effTheme === 'dark' ? 'light' : 'dark')}
          aria-label="Switch light / dark theme"
        >
          <Icon name={effTheme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <div className="grow">
          <div className="t">{user?.username}</div>
          <div className="s">{user?.role}</div>
        </div>
        <button className="sidebar-icbtn" onClick={() => { logout(); navigate('/login'); }} aria-label="Logout">
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  );
}
