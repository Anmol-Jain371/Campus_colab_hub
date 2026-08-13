import React from 'react';
import { Layers, Cpu, MessageSquare, Award } from 'lucide-react';
import Magnet from '../visual/Magnet';

const WelcomeOnboardingModal = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.3)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9990,
      padding: '20px'
    }}>
      
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        padding: '36px',
        textAlign: 'center'
      }}>
        
        {/* Header Badge */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: 'var(--accent)'
        }}>
          <Award size={28} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Welcome, {userName || 'Student'}!
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5 }}>
          Your profile is verified. Here is how you can use CampusConnect to build your next big idea:
        </p>

        {/* Feature List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', marginBottom: '32px' }}>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={iconBoxStyle}>
              <Layers size={18} color="var(--accent)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Discover Collaborators</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Search cross-department students by skills and view their portfolios.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={iconBoxStyle}>
              <Cpu size={18} color="var(--accent)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Match Capability Scores</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Check your AI compatibility scores on listed projects.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={iconBoxStyle}>
              <MessageSquare size={18} color="var(--accent)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Connect & Message</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Coordinate in channels, share files, and build teams in real-time.</p>
            </div>
          </div>

        </div>

        {/* Action button */}
        <Magnet style={{ width: '100%' }}>
          <button 
            className="btn btn-primary" 
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '8px',
              background: 'var(--accent)',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Let's Build!
          </button>
        </Magnet>

      </div>

    </div>
  );
};

const iconBoxStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: 'var(--accent-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

export default WelcomeOnboardingModal;
