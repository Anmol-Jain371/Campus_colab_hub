import React from 'react';
import './visual.css';

const GridBackground = ({ children }) => {
  return (
    <div className="grid-bg-wrapper">
      <div className="mesh-gradient"></div>
      <div className="grid-overlay"></div>
      <div className="interactive-content">
        {children}
      </div>
    </div>
  );
};

export default GridBackground;
