import { createContext, useContext, useEffect, useState } from 'react';
import { Auth, clearTokens, hasRefreshToken, setTokens } from '../lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasRefreshToken()) {
      setReady(true);
      return;
    }
    Auth.me()
      .then((me) => setUser(me))
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (username, password) => {
    const data = await Auth.login(username, password);
    setTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user);
    return data.user;
  };

  const register = (payload) => Auth.register(payload);

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value = { user, ready, login, register, logout, setUser };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
