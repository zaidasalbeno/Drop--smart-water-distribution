import { Button, Stack } from '@mui/material';
import Header from '../../components/Layout/Header';

export function Home() {
  return (
    <>
      <Header />
      <div className="landing">
        <div className="landing-copy">
          <span className="landing-kicker">
            <i /> YOUR WATER. YOUR WAY.
          </span>
          <h1>
            Every drop,
            <br />
            in <em>good hands.</em>
          </h1>
          <p>
            A smarter way to manage your water. Keep an eye on your tanks, find trusted local
            suppliers, and get deliveries when you need them.
          </p>
          <Stack direction="row" spacing={1.5} className="landing-ctas">
            <Button variant="contained" size="large" onClick={() => location.assign('/register')}>
              Get started <span>↗</span>
            </Button>
            <Button variant="outlined" size="large" onClick={() => location.assign('/login')}>
              Sign in
            </Button>
          </Stack>
          <div className="landing-trust">
            <span>✳</span> Built for households, suppliers, and local administrators
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-a" />
          <div className="hero-orbit orbit-b" />
          <div className="water-drop">⌄</div>
          <div className="hero-floating float-top">
            <span>◉</span>
            <div>
              <b>Tank status</b>
              <small>Looking good · 78%</small>
            </div>
            <div className="tiny-bars">▂ ▄ ▆ ▇</div>
          </div>
          <div className="hero-floating float-bottom">
            <span className="truck-icon">↗</span>
            <div>
              <b>Delivery on the way</b>
              <small>BlueSpring Water · 25 min</small>
            </div>
            <i />
          </div>
          <div className="art-caption">
            <span>◉</span> WATER, IN BALANCE <b>✳</b>
          </div>
        </div>
        <div className="landing-strip">
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
