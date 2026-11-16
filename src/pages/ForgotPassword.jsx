import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth, apiErrorMessage } from '../lib/api';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.warn('Email zaroori hai');
    setBusy(true);
    try {
      await Auth.requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Kuch ghalat ho gaya.'));
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
          <h1 className="authtitle">Password bhool gaye?</h1>
          {sent ? (
            <p className="hint" style={{ marginBottom: 0 }}>
              Agar yeh email registered hai, to reset link bhej diya gaya hai. Apna inbox check karein.
            </p>
          ) : (
            <>
              <p className="hint">Apna registered email likhein, hum reset link bhej denge.</p>
              <form className="form" onSubmit={submit}>
                <div className="full">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    autoComplete="email"
                  />
                </div>
                <div className="full acts">
                  <button className="btn block" type="submit" disabled={busy}>
                    {busy ? 'Bhej rahe hain…' : 'Reset link bhejein'}
                  </button>
                </div>
              </form>
            </>
          )}
          <p className="hint" style={{ textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
            <Link to="/login">Login par wapas jayein</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
