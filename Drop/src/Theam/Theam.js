import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#176b58', dark: '#124f43', light: '#e2eee9' },
    secondary: { main: '#b56c46' },
    background: { default: '#f6f5f0', paper: '#ffffff' },
    text: { primary: '#203631', secondary: '#727c76' },
    success: { main: '#34785c' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h1: { fontWeight: 750, letterSpacing: '-.055em' },
    h2: { fontWeight: 700, letterSpacing: '-.04em' },
    h3: { fontWeight: 700, letterSpacing: '-.035em' },
    button: { textTransform: 'none', fontWeight: 650 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 6, paddingInline: 16, boxShadow: 'none' } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export default theme;
