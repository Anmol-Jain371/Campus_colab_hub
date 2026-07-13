import React from 'react';
import { useApp } from '../../context/AppContext';
import GridBackground from '../visual/GridBackground';

const Splash = () => {
  const { navigateTo, loginDemoUser } = useApp();

  return (
    <GridBackground>
      <div id="screen-splash" className="screen splash-bg active" style={{ background: 'transparent' }}>
        <div className="splash-content" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.6)', color: 'white' }}>
          <div className="splash-logo">C</div>
          <h1 className="splash-title" style={{ color: 'white !important' }}>Campus Collaboration Hub</h1>
          <p className="splash-tagline" style={{ color: '#94a3b8' }}>Connect Beyond Your Department. Find the perfect teammates for projects, hackathons, and research.</p>
          <div className="splash-actions">
            <button 
              id="btn-splash-get-started" 
              className="btn btn-primary" 
              onClick={() => navigateTo('signup')}
            >
              Get Started
            </button>
            <button 
              id="btn-splash-login" 
              className="btn btn-secondary" 
              onClick={loginDemoUser}
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Login as Demo Student
            </button>
          </div>
        </div>
      </div>
    </GridBackground>
  );
};

export default Splash;
