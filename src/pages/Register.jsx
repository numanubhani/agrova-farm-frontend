import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';
import PasswordInput from '../components/PasswordInput';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return toast.warn('Username aur password zaroori hain');
    if (password.length < 8) return toast.warn('Password kam az kam 8 characters ka ho');
    if (password !== password2) return toast.warn('Password match nahi karta');
    setBusy(true);
    try {
      await register({ username: username.trim(), email: email.trim(), password });
      toast.success('Account ban gaya, email bhi bhej di hai. Admin access dene ke baad login karein.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Register nahi hua.'));
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
          <p>Naya account banayein, admin se access lein.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
      <div className="card authcard">
        <h1 className="authtitle">Register</h1>
        <form className="form" onSubmit={submit}>
          <div className="full">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" />
          </div>
          <div className="full">
            <label>Email (optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="full">
            <label>Password</label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="full">
            <label>Confirm password</label>
            <PasswordInput value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="full acts">
            <button className="btn block" type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Register'}
            </button>
          </div>
        </form>
        <p className="hint" style={{ textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
          Account hai? <Link to="/login">Login karein</Link>
        </p>
        </div>
      </div>
    </div>
  );
}
