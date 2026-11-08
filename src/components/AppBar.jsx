import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { useAppState } from '../context/AppStateContext';
import { monthShort } from '../lib/format';

const TITLES = {
  '/': null, // uses farm name
  '/delivery': 'Daily Delivery',
  '/milk': 'Milk Production',
  '/bills': 'Monthly Bills',
  '/expenses': 'Expenses',
  '/more': 'More',
  '/customers': 'Customers',
  '/reports': 'Reports',
};
const MONTH_ROUTES = ['/', '/bills', '/expenses', '/reports'];
const SUB_OF_MORE = ['/milk', '/customers', '/reports'];

export default function AppBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { month, shiftMonth, effTheme, setTheme, farmName } = useAppState();

  const showMonth = MONTH_ROUTES.includes(pathname);
  const isSubOfMore = SUB_OF_MORE.includes(pathname);
  const title = TITLES[pathname] ?? null;

  return (
    <header className="appbar">
      <div className="in">
        <div className="top">
          <h1>
            {isSubOfMore && (
              <button className="crumb" onClick={() => navigate('/more')}>‹ More</button>
            )}
            {title || farmName}
            {pathname === '/' && <small>Milk · Billing · Expense</small>}
          </h1>
          <div className="tright">
            {showMonth && (
              <div className="mnav">
                <button onClick={() => shiftMonth(-1)} aria-label="Previous month"><Icon name="left" /></button>
                <span>{monthShort(month)}</span>
                <button onClick={() => shiftMonth(1)} aria-label="Next month"><Icon name="right" /></button>
              </div>
            )}
            <button
              className="tbtn"
              onClick={() => setTheme(effTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Switch light / dark theme"
            >
              <Icon name={effTheme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
