import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppBar from './components/AppBar';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import RequireAuth from './components/RequireAuth';
import { AppStateProvider } from './context/AppStateContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import Delivery from './pages/Delivery';
import Milk from './pages/Milk';
import Bills from './pages/Bills';
import Expenses from './pages/Expenses';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import More from './pages/More';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPanel from './pages/AdminPanel';

function Shell() {
  return (
    <>
      <Sidebar />
      <AppBar />
      <main>
        <Routes>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/delivery" element={<RequireAuth module="deliveries"><Delivery /></RequireAuth>} />
          <Route path="/milk" element={<RequireAuth module="production"><Milk /></RequireAuth>} />
          <Route path="/bills" element={<RequireAuth module="bills"><Bills /></RequireAuth>} />
          <Route path="/expenses" element={<RequireAuth module="expenses"><Expenses /></RequireAuth>} />
          <Route path="/customers" element={<RequireAuth module="customers"><Customers /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth module="reports"><Reports /></RequireAuth>} />
          <Route path="/more" element={<RequireAuth><More /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth adminOnly><AdminPanel /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
}

function AuthGate() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  const landing = user?.role === 'admin' ? '/admin' : '/';
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={landing} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={landing} replace /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to={landing} replace /> : <ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={user ? <Navigate to={landing} replace /> : <ResetPassword />} />
      <Route path="/*" element={<Shell />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <ToastProvider>
            <ModalProvider>
              <AuthGate />
            </ModalProvider>
          </ToastProvider>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
