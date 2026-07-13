import React from 'react';
import { useApp } from '../../context/AppContext';
import DecryptedText from '../visual/DecryptedText';
import Magnet from '../visual/Magnet';

const Splash = () => {
  const { navigateTo, loginDemoUser } = useApp();

  return (
    <div id="screen-splash" className="screen splash-bg active">
      <div className="splash-content">
        <div className="splash-logo">C</div>
        <h1 className="splash-title" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          <DecryptedText text="Campus Collaboration Hub" speed={50} maxIterations={12} animateOn="hover" />
        </h1>
        <p className="splash-tagline">Connect Beyond Your Department. Find the perfect teammates for projects, hackathons, and research.</p>
        <div className="splash-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Magnet>
            <button 
              id="btn-splash-get-started" 
              className="btn btn-primary" 
              onClick={() => navigateTo('signup')}
            >
              Get Started
            </button>
          </Magnet>
          <Magnet>
            <button 
              id="btn-splash-login" 
              className="btn btn-secondary" 
              onClick={loginDemoUser}
            >
              Login as Demo Student
            </button>
          </Magnet>
        </div>
      </div>
    </div>
  );
};

export default Splash;
