import React, { useEffect, useState } from 'react';

const DecryptedText = ({ 
  text, 
  speed = 40, 
  maxIterations = 10, 
  sequential = true, 
  className = '', 
  animateOn = 'hover' 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

  useEffect(() => {
    let interval;
    let iteration = 0;
    
    // Only run animation if hover state matches trigger conditions
    if (animateOn === 'hover' && !isHovered) {
      setDisplayText(text);
      return;
    }

    interval = setInterval(() => {
      setDisplayText(prev => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            const currentIteration = sequential ? iteration - index / 2 : iteration;
            if (currentIteration >= maxIterations) {
              return text[index];
            }
            
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration >= maxIterations + text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, isHovered, animateOn, speed, maxIterations, sequential]);

  return (
    <span 
      className={`decrypted-text ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'inline-block', cursor: 'default' }}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
