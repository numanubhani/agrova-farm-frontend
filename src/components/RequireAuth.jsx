import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NoAccess() {
  return (
    <div className="page">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Access nahi hai</h3>
        <p className="hint" style={{ marginBottom: 0 }}>
          Is section ka access abhi aap ke account ko nahi diya gaya. Admin se contact karein.
        </p>
      </div>
    </div>
  );
}

export default function RequireAuth({ children, module, action = 'view', adminOnly = false }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const isAdmin = user.role === 'admin';
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  if (module && !isAdmin) {
    const acts = user.permissions?.[module] || [];
    const allowed = action === 'view' ? acts.includes('view') || acts.includes('edit') : acts.includes(action);
    if (!allowed) return <NoAccess />;
  }

  return children;
}
