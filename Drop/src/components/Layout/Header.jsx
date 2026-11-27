import { AppBar, Button, Toolbar } from '@mui/material';
import { Link } from 'react-router';

export default function Header() {
  return (
    <AppBar position="static" elevation={0} className="landing-header">
      <Toolbar>
        <Link to="/" className="brand">
          <span className="brand-mark">d.</span>
          <span>
            drop<span className="brand-period">.</span>
            <small>WATER, IN FLOW</small>
          </span>
        </Link>
        <div className="header-links">
          <Link to="/#how-it-works">How it works</Link>
          <Link to="/#network">Our network</Link>
          <Link to="/login">Sign in</Link>
          <Button component={Link} to="/register" variant="contained" size="small">
            Get started ↗
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
