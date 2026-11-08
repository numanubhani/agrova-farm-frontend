import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAppState } from '../context/AppStateContext';

const MENU = [
  ['/milk', 'drop', 'Milk Production', 'Subah / shaam doodh entry'],
  ['/customers', 'users', 'Customers', 'Naam, rate, daily quantity'],
  ['/reports', 'chart', 'Reports', 'Summary aur Excel download'],
];

export default function More() {
  const navigate = useNavigate();
  const { theme, setTheme } = useAppState();

  const seg = (value, icon, label) => (
    <button key={value} className={theme === value ? 'on' : ''} onClick={() => setTheme(value)}>
      <Icon name={icon} />{label}
    </button>
  );

  return (
    <div className="page">
      <h2 className="sec">Theme</h2>
      <div className="card">
        <div className="seg">
          {seg('auto', 'sun', 'Auto')}
          {seg('light', 'sun', 'Light')}
          {seg('dark', 'moon', 'Dark')}
        </div>
      </div>
      <h2 className="sec">Menu</h2>
      <div className="list menu">
        {MENU.map(([to, icon, label, sub]) => (
          <button className="row tap" key={to} onClick={() => navigate(to)}>
            <div className="ei" style={{ color: 'var(--green)' }}><Icon name={icon} /></div>
            <div className="grow">
              <div className="t">{label}</div>
              <div className="s">{sub}</div>
            </div>
            <Icon name="right" />
          </button>
        ))}
      </div>
    </div>
  );
}
