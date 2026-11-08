import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon';

const TABS = [
  ['/', 'Home', 'home'],
  ['/delivery', 'Delivery', 'truck'],
  ['/bills', 'Bills', 'bill'],
  ['/expenses', 'Expenses', 'wallet'],
  ['/more', 'More', 'more'],
];
const MORE_GROUP = ['/milk', '/customers', '/reports', '/more'];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="bnav">
      <div className="in">
        {TABS.map(([to, label, icon]) => {
          const active = to === '/more' ? MORE_GROUP.includes(pathname) : pathname === to;
          return (
            <NavLink key={to} to={to} className={active ? 'on' : ''}>
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
