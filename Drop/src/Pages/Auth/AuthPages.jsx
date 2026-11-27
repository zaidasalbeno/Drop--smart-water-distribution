import { useState } from 'react';
import { Button, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router';
import Header from '../../components/Layout/Header';
import { useApp } from '../../Hooks/useApp';
const base = { household: '/household', supplier: '/supplier', admin: '/admin' };

export function Auth({ mode }) {
  const { data, login, register, setNotice } = useApp();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'household',
  });
  const nav = useNavigate();
  const location = useLocation();
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const message = mode === 'login' ? login(form.email, form.password) : register(form);
    if (message) {
      setNotice(message, 'error');
      return;
    }
    setNotice(mode === 'login' ? 'Welcome back.' : 'Account created and saved in this browser.');
    const signedIn =
      mode === 'login'
        ? data.users.find(
            (account) => account.email.toLowerCase() === form.email.trim().toLowerCase(),
          )
        : form;
    const destination = location.state?.from;
    const allowedBase = base[signedIn?.role] || '/household';
    nav(destination?.startsWith(allowedBase) ? destination : allowedBase, { replace: true });
  };
  return (
    <>
      <Header />
      <div className="auth-layout">
        <div className="auth-side">
          <span>DROP · LOCAL ACCOUNT</span>
          <h1>
            Stay ahead
            <br />
            of your water
            <br />
            <em>supply.</em>
          </h1>
          <p>Manage tanks, deliveries, and local water services in one place.</p>
        </div>
        <Paper className="auth-card">
          <Link to="/" className="back-link">
            ← Back to home
          </Link>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
          <p>
            {mode === 'login'
              ? 'Sign in to this browser’s DROP workspace.'
              : 'Choose an account type. Your account stays in this browser.'}
          </p>
          <form onSubmit={submit}>
            <Stack spacing={1.6}>
              {mode === 'register' && (
                <>
                  <TextField
                    required
                    name="name"
                    label={form.role === 'supplier' ? 'Business name' : 'Full name'}
                    value={form.name}
                    onChange={change}
                  />
                  <TextField
                    required
                    select
                    name="role"
                    label="Account type"
                    value={form.role}
                    onChange={change}
                  >
                    <MenuItem value="household">Household</MenuItem>
                    <MenuItem value="supplier">Supplier</MenuItem>
                  </TextField>
                  <TextField
                    required
                    name="phone"
                    label="Phone number"
                    value={form.phone}
                    onChange={change}
                  />
                  <TextField
                    required
                    name="address"
                    label="Service address"
                    value={form.address}
                    onChange={change}
                  />
                </>
              )}
              <TextField
                required
                type="email"
                name="email"
                label="Email address"
                value={form.email}
                onChange={change}
              />
              <TextField
                required
                type="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={change}
                inputProps={{ minLength: 6 }}
              />
              <Button variant="contained" size="large" type="submit">
                {mode === 'login' ? 'Sign in to DROP' : 'Create account'} →
              </Button>
            </Stack>
          </form>
          {mode === 'login' && (
            <div className="demo-box">
              <b>ADMIN ACCESS <span>Local demo account</span></b>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    email: 'admin@drop.local',
                    password: 'DropAdmin2026!',
                  }))
                }
              >
                <span className="role-dot admin" />
                <span>DROP administrator<small>Click to fill the admin credentials</small></span>
                <b>Fill</b>
              </button>
              <span className="no-demo-note">Email: admin@drop.local · Password: DropAdmin2026!</span>
            </div>
          )}
          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                New to DROP? <Link to="/register">Create an account</Link>
              </>
            ) : (
              <>
                Already have an account? <Link to="/login">Sign in</Link>
              </>
            )}
          </div>
        </Paper>
      </div>
    </>
  );
}
