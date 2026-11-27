import { useState } from 'react';
import { AppBar, Avatar, Box, Button, Drawer, IconButton, Toolbar } from '@mui/material';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useApp } from '../../Hooks/useApp';
const routes = {
  household: [
    ['Overview', '/household', '⌂'],
    ['My tanks', '/household/tanks', '▤'],
    ['Find suppliers', '/household/suppliers', '⌕'],
    ['Delivery requests', '/household/requests', '↗'],
    ['Profile', '/household/profile', '○'],
  ],
  supplier: [
    ['Overview', '/supplier', '⌂'],
    ['Incoming requests', '/supplier/requests', '↙'],
    ['Delivery history', '/supplier/history', '▤'],
    ['Business profile', '/supplier/profile', '○'],
  ],
  admin: [
    ['Overview', '/admin', '⌂'],
    ['Users', '/admin/users', '○'],
    ['Suppliers', '/admin/suppliers', '◇'],
    ['Delivery requests', '/admin/requests', '↗'],
    ['Complaints', '/admin/complaints', '!'],
  ],
};
const base = { household: '/household', supplier: '/supplier', admin: '/admin' };
const roleLabel = (role) =>
  ({ household: 'Household', supplier: 'Supplier', admin: 'Administrator' })[role] || 'Guest';

export function Guard({ roles, children }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!roles.includes(user.role)) return <Navigate to={base[user.role] || '/'} replace />;
  return children;
}

export function AppFrame({ children }) {
  const { user, logout, reset, setNotice } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const items = routes[user.role] || [];
  const sidebar = (
    <Box className="sidebar-inner">
      <Link to="/" className="brand">
        <span className="brand-mark">d.</span>
        <span>
          drop<span className="brand-period">.</span>
          <small>WATER, IN FLOW</small>
        </span>
      </Link>
      <div className="nav-label">WORKSPACE</div>
      {items.map(([label, path, icon]) => (
        <Link
          key={path}
          to={path}
          className={`nav-link ${location.pathname === path || (path !== base[user.role] && location.pathname.startsWith(`${path}/`)) ? 'selected' : ''}`}
          onClick={() => setOpen(false)}
        >
          <span className="nav-icon">{icon}</span>
          {label}
          {label.includes('requests') && (
            <span className="nav-count">{user.role === 'household' ? 2 : 1}</span>
          )}
        </Link>
      ))}
      <div className="sidebar-bottom">
        <div className="help-card">
          <span>✳</span>
          <b>
            Water works better
            <br />
            when we work together.
          </b>
          <small>Questions? Our team is here to help.</small>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              window.location.href = 'mailto:help@drop.demo';
            }}
          >
            Email support ↗
          </Button>
        </div>
        <button
          className="reset-link"
          onClick={() => {
            if (window.confirm('Clear all DROP records saved in this browser?')) reset();
          }}
        >
          ↻ &nbsp;Clear local data
        </button>
      </div>
    </Box>
  );
  return (
    <div className="app-shell">
      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: 260 } }}
      >
        {sidebar}
      </Drawer>
      <aside className="desktop-sidebar">{sidebar}</aside>
      <div className="main-column">
        <AppBar position="sticky" elevation={0} className="topbar">
          <Toolbar>
            <IconButton className="mobile-menu" onClick={() => setOpen(true)}>
              ☰
            </IconButton>
            <div className="crumb">
              DASHBOARD <span>/</span>{' '}
              <b>
                {(items.find((i) => i[1] === location.pathname)?.[0] || 'Overview').toUpperCase()}
              </b>
            </div>
            <div className="top-actions">
              <span className="live-status">
                <i /> SYSTEM LIVE
              </span>
              <IconButton
                aria-label="Notifications"
                className="notification"
                onClick={() => setNotice('You are all caught up.')}
              >
                ♧<i />
              </IconButton>
              <div className="profile-mini">
                <Avatar>{user.name?.[0]}</Avatar>
                <div>
                  <b>{user.name}</b>
                  <small>{roleLabel(user.role)}</small>
                </div>
              </div>
              <Button
                size="small"
                onClick={() => {
                  logout();
                  nav('/');
                }}
              >
                Sign out
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <main className="content-wrap">
          {children}
          <footer>
            © 2026 DROP WATER NETWORK{' '}
            <span>
              Built for a more resilient tomorrow <b>✳</b>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
