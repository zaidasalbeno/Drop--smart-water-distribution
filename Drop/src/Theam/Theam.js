import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0b78a0', dark: '#095d7e', light: '#d6edf5' },
    secondary: { main: '#a9633f' },
    background: { default: '#eaf4f8', paper: '#f8fcff' },
    text: { primary: '#153948', secondary: '#587480' },
    success: { main: '#327b68' },
    divider: '#cfdee7',
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    h1: { fontWeight: 650, letterSpacing: '-.045em' },
    h2: { fontWeight: 650, letterSpacing: '-.035em' },
    h3: { fontWeight: 650, letterSpacing: '-.025em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 5, paddingInline: 16, boxShadow: 'none' } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export default theme;
