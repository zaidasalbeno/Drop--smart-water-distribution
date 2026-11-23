import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

export function useApp() {
  return useContext(AppContext);
}
