import React from 'react';
import { useApp } from '../../context/AppContext';

const Splash = () => {
  const { navigateTo, loginDemoUser } = useApp();

  return (
    <div id="screen-splash" className="screen splash-bg active">
      <div className="splash-content">
        <div className="splash-logo">C</div>
        <h1 className="splash-title">Campus Collaboration Hub</h1>
        <p className="splash-tagline">Connect Beyond Your Department. Find the perfect teammates for projects, hackathons, and research.</p>
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
          >
            Login as Demo Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
