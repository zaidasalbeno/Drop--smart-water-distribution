/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import { initialData } from '../data';
export const AppContext = createContext(null);
const read = () => {
  try {
    localStorage.removeItem('drop-data-v1');
    localStorage.removeItem('drop-user-v1');
    const value = localStorage.getItem('drop-data-v2');
    return value ? { ...initialData, ...JSON.parse(value) } : initialData;
  } catch {
    return initialData;
  }
};

export function Provider({ children }) {
  const [data, setData] = useState(read);
  const [user, setUser] = useState(() => {
    try {
      localStorage.removeItem('drop-user-v1');
      return JSON.parse(localStorage.getItem('drop-user-v2')) || null;
    } catch {
      return null;
    }
  });
  const [notice, setNoticeState] = useState(null);
  const setNotice = (message, type = 'success') =>
    setNoticeState({ message, type, id: Date.now() });
  useEffect(() => {
    localStorage.setItem('drop-data-v2', JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    user
      ? localStorage.setItem('drop-user-v2', JSON.stringify(user))
      : localStorage.removeItem('drop-user-v2');
  }, [user]);
  const patch = (key, updater) =>
    setData((prev) => ({
      ...prev,
      [key]: typeof updater === 'function' ? updater(prev[key]) : updater,
    }));
  const login = (email, password) => {
    const account = data.users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );
    if (!account) return 'Email or password is incorrect. Create an account to get started.';
    if (account.active === false) return 'This account is suspended. Contact an administrator.';
    setUser({ ...account });
    return '';
  };
  const register = (form) => {
    if (data.users.some((item) => item.email.toLowerCase() === form.email.toLowerCase()))
      return 'An account with this email already exists.';
    const created = { ...form, id: `u${Date.now()}`, active: true };
    patch('users', (rows) => [...rows, created]);
    if (created.role === 'supplier')
      patch('suppliers', (rows) => [
        ...rows,
        {
          id: created.id,
          name: created.name,
          price: 0,
          capacity: 0,
          available: false,
          verified: false,
          rating: 0,
          distance: 0,
          services: '',
        },
      ]);
    setUser(created);
    return '';
  };
  const logout = () => setUser(null);
  const reset = () => {
    setData(initialData);
    setUser(null);
    localStorage.removeItem('drop-data-v2');
    localStorage.removeItem('drop-user-v2');
    localStorage.removeItem('drop-data-v1');
    localStorage.removeItem('drop-user-v1');
    setNotice('Local app data cleared.');
  };
  return (
    <AppContext.Provider
      value={{
        data,
        patch,
        user,
        setUser,
        login,
        register,
        logout,
        reset,
        notice,
        setNotice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
