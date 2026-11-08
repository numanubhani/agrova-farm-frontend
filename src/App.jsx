import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppBar from './components/AppBar';
import BottomNav from './components/BottomNav';
import { AppStateProvider } from './context/AppStateContext';
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

function Shell() {
  return (
    <>
      <AppBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/milk" element={<Milk />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <ToastProvider>
          <ModalProvider>
            <Shell />
          </ModalProvider>
        </ToastProvider>
      </AppStateProvider>
    </BrowserRouter>
  );
}
