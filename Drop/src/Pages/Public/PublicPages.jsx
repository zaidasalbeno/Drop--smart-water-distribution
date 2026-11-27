import { Button, Stack } from '@mui/material';
import { Link, useLocation } from 'react-router';
import { useEffect } from 'react';
import Header from '../../components/Layout/Header';

export function Home() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [location.hash]);

  return (
    <>
      <Header />
      <div className="landing">
        <div className="landing-copy" id="how-it-works">
          <span className="landing-kicker">
            <i /> YOUR WATER. YOUR WAY.
          </span>
          <h1>
            Know what’s
            <br />
            in your <em>tank.</em>
          </h1>
          <p>
            Track tank levels, compare local suppliers, and arrange a refill when you need one.
          </p>
          <Stack direction="row" spacing={1.5} className="landing-ctas">
            <Button component={Link} to="/register" variant="contained" size="large">
              Get started <span>↗</span>
            </Button>
            <Button component={Link} to="/login" variant="outlined" size="large">
              Sign in
            </Button>
          </Stack>
          <div className="landing-trust">
            <span>✳</span> Built for households, suppliers, and local administrators
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="water-drop" />
        </div>
        <div className="landing-strip" id="network">
          <div>
            <b>Tank tools</b>
            <small>TANK MANAGEMENT</small>
          </div>
          <div>
            <b>Local partners</b>
            <small>SUPPLIER TOOLS</small>
          </div>
          <div>
            <b>Your network</b>
            <small>LOCAL DATA</small>
          </div>
          <p>
            Good water management
            <br />
            starts with a little connection. <b>↗</b>
          </p>
        </div>
        <div className="landing-bottom">
          <b>
            DROP<span>.</span>
          </b>
          <small>SMART WATER DISTRIBUTION & MANAGEMENT</small>
          <small>DESIGNED FOR A BETTER FLOW&nbsp; ✳</small>
        </div>
      </div>
    </>
  );
}
