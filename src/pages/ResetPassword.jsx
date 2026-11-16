import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Auth, apiErrorMessage } from '../lib/api';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';
import PasswordInput from '../components/PasswordInput';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.warn('Password kam az kam 8 characters ka ho');
    if (password !== password2) return toast.warn('Password match nahi karta');
    setBusy(true);
    try {
      await Auth.confirmPasswordReset(uid, token, password);
      toast.success('Password reset ho gaya. Ab login karein.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Link invalid ya expire ho chuka hai.'));
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
          <h1 className="authtitle">Naya password</h1>
          <form className="form" onSubmit={submit}>
            <div className="full">
              <label>Naya password</label>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" autoFocus />
            </div>
            <div className="full">
              <label>Confirm password</label>
              <PasswordInput value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" />
            </div>
            <div className="full acts">
              <button className="btn block" type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Password set karein'}
              </button>
            </div>
          </form>
          <p className="hint" style={{ textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
            <Link to="/login">Login par wapas jayein</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
