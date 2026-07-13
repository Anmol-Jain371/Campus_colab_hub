import React, { useState, useRef, useEffect } from 'react';

const Magnet = ({ children, magnetStrength = 0.35, className = '' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative mouse position from element center
    const x = e.clientX - (rect.left + width / 2);
    const y = e.clientY - (rect.top + height / 2);
    
    // Apply strength
    setPosition({ x: x * magnetStrength, y: y * magnetStrength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      className={`magnet-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.1s ease-out',
        display: 'inline-block'
      }}
    >
      {children}
    </div>
  );
};

export default Magnet;
