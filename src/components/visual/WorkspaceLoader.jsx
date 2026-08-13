import React, { useState, useEffect } from 'react';

const WorkspaceLoader = () => {
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    'Verifying credentials...',
    'Establishing secure connection to SQLite database...',
    'Loading student collaboration workspaces...',
    'Analyzing matching vector maps...',
    'Opening CampusConnect Hub...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev < logs.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(30px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'all 0.5s'
    }}>
      
      {/* Spinner */}
      <div className="spinner-loader" style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(13, 148, 136, 0.1)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '24px'
      }} />

      {/* Log Output */}
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Initializing Session
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace', minHeight: '20px', transition: 'all 0.2s' }}>
          &gt; {logs[logIndex]}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />

    </div>
  );
};

export default WorkspaceLoader;
