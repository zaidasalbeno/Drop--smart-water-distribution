import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './Theam/Theam';
import { Provider } from './Context/AppContext';
import { useApp } from './Hooks/useApp';
import { AppFrame, Guard } from './components/Layout/AppShell';
import { Home } from './Pages/Public/PublicPages';
import { Auth } from './Pages/Auth/AuthPages';
import {
  HouseholdDashboard,
  Tanks,
  Suppliers,
  NewRequest,
  Requests,
  TrackRoute,
  Profile,
} from './Pages/Household/HouseholdPages';
import { SupplierDashboard, History } from './Pages/Supplier/SupplierPages';
import { AdminDashboard, AdminTable } from './Pages/Admin/AdminPages';
import './App.css';

function PortalRoute({ role, children }) {
  return (
    <Guard roles={[role]}>
      <AppFrame>{children}</AppFrame>
    </Guard>
  );
}

function AppRoutes() {
  const { notice } = useApp();

  useEffect(() => {
    if (!notice?.message) return;
    toast[notice.type === 'error' ? 'error' : 'success'](notice.message);
  }, [notice]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />

        <Route
          path="/household"
          element={
            <PortalRoute role="household">
              <HouseholdDashboard />
            </PortalRoute>
          }
        />
        <Route
          path="/household/tanks"
          element={
            <PortalRoute role="household">
              <Tanks />
            </PortalRoute>
          }
        />
        <Route
          path="/household/suppliers"
          element={
            <PortalRoute role="household">
              <Suppliers />
            </PortalRoute>
          }
        />
        <Route
          path="/household/new-request"
          element={
            <PortalRoute role="household">
              <NewRequest />
            </PortalRoute>
          }
        />
        <Route
          path="/household/requests"
          element={
            <PortalRoute role="household">
              <Requests />
            </PortalRoute>
          }
        />
        <Route
          path="/household/track/:id"
          element={
            <PortalRoute role="household">
              <TrackRoute />
            </PortalRoute>
          }
        />
        <Route
          path="/household/profile"
          element={
            <PortalRoute role="household">
              <Profile role="household" />
            </PortalRoute>
          }
        />

        <Route
          path="/supplier"
          element={
            <PortalRoute role="supplier">
              <SupplierDashboard />
            </PortalRoute>
          }
        />
        <Route
          path="/supplier/requests"
          element={
            <PortalRoute role="supplier">
              <Requests audience="supplier" />
            </PortalRoute>
          }
        />
        <Route
          path="/supplier/history"
          element={
            <PortalRoute role="supplier">
              <History />
            </PortalRoute>
          }
        />
        <Route
          path="/supplier/profile"
          element={
            <PortalRoute role="supplier">
              <Profile role="supplier" />
            </PortalRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PortalRoute role="admin">
              <AdminDashboard />
            </PortalRoute>
          }
        />
        {['users', 'suppliers', 'requests', 'complaints'].map((kind) => (
          <Route
            key={kind}
            path={`/admin/${kind}`}
            element={
              <PortalRoute role="admin">
                <AdminTable kind={kind} />
              </PortalRoute>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme="light"
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Provider>
          <AppRoutes />
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
