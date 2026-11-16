import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return toast.warn('Username aur password zaroori hain');
    setBusy(true);
    try {
      const loggedInUser = await login(username.trim(), password);
      const fallback = loggedInUser.role === 'admin' ? '/admin' : '/';
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Login nahi hua. Username ya password ghalat hai.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="authpage">
      <div className="auth-hero">
        <div className="auth-hero-ic"><Icon name="cow" /></div>
        <div className="auth-hero-text">
          <h1>Agrova Farm</h1>
          <p>Milk · Billing · Expense — sab kuch ek jagah.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="card authcard">
          <h1 className="authtitle">Login</h1>
          <form className="form" onSubmit={submit}>
            <div className="full">
              <label>Username ya Email</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" />
            </div>
            <div className="full">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12.5 }}>Bhool gaye?</Link>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="full acts">
              <button className="btn block" type="submit" disabled={busy}>
                {busy ? 'Logging in…' : 'Login'}
              </button>
            </div>
          </form>
          <p className="hint" style={{ textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
            Account nahi hai? <Link to="/register">Register karein</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
