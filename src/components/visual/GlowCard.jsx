import React, { useRef, useState } from 'react';
import './visual.css';

const GlowCard = ({ children, className = '', onClick }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div 
      ref={cardRef}
      className={`glow-card-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onClick={onClick}
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`,
        '--glow-opacity': isFocused ? '1' : '0'
      }}
    >
      <div className="glow-card-border-effect"></div>
      <div className="glow-card-content">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
