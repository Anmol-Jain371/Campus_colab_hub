import React from 'react';
import { useApp } from '../../context/AppContext';
import DecryptedText from '../visual/DecryptedText';
import Magnet from '../visual/Magnet';
import GlowCard from '../visual/GlowCard';
import InteractiveParticles from '../visual/InteractiveParticles';
import { Layers, Cpu, MessageSquare, ArrowRight } from 'lucide-react';

const Splash = () => {
  const { navigateTo } = useApp();

  return (
    <div id="screen-splash" className="screen splash-bg active" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Interactive Nodes Network */}
      <InteractiveParticles />

      {/* Landing Header (Glassmorphic Navigation Bar) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px 32px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.8)', zIndex: 10, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(13, 148, 136, 0.2)' }}>C</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.6px' }}>CampusConnect</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span onClick={() => navigateTo('login')} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} className="nav-hover-teal">Sign In</span>
          <Magnet>
            <button 
              className="btn btn-primary" 
              onClick={() => navigateTo('register')}
              style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '8px', background: 'var(--accent)', border: 'none', color: 'white' }}
            >
              Get Started
            </button>
          </Magnet>
        </div>
      </header>

      {/* Spacious Hero Section (No Boxed Card!) */}
      <div style={{ margin: 'auto', maxWidth: '820px', width: '100%', textAlign: 'center', zIndex: 5, padding: '40px 20px' }}>
        
        {/* Main Title */}
        <h1 style={{ fontSize: '4.2rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-2.5px', lineHeight: 1.05, background: 'linear-gradient(135deg, #0f172a 30%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <DecryptedText text="CampusConnect" speed={45} maxIterations={14} animateOn="hover" />
        </h1>
        
        {/* Tagline */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '40px', fontWeight: 500, maxWidth: '640px', margin: '0 auto 40px auto' }}>
          Bridge the gap between Engineering, Business, and Design classrooms. Find collaborators, form dream teams, and build real-world hackathons, startups, and research.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <Magnet>
            <button 
              id="btn-splash-get-started" 
              className="btn btn-primary" 
              onClick={() => navigateTo('register')}
              style={{ padding: '16px 36px', fontSize: '1rem', fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 20px rgba(13, 148, 136, 0.2)', border: 'none', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Start Connecting <ArrowRight size={16} />
            </button>
          </Magnet>
          <Magnet>
            <button 
              id="btn-splash-login" 
              className="btn btn-outline" 
              onClick={() => navigateTo('login')}
              style={{ padding: '16px 36px', fontSize: '1rem', fontWeight: 700, borderRadius: '12px', background: 'white', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              Sign In
            </button>
          </Magnet>
        </div>
      </div>

      {/* Feature Grid Columns (Left-aligned, clean Lucide icons) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', width: '100%', maxWidth: '1100px', margin: '0 auto', zIndex: 10 }}>
        
        <GlowCard>
          <div style={{ padding: '28px 24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={iconBoxStyle}>
              <Layers size={20} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>Cross-Dept Listings</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Post startups, hackathons, or research openings seeking specific skills from other schools.</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <div style={{ padding: '28px 24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={iconBoxStyle}>
              <Cpu size={20} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>AI Match Scoring</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Automatically compute how well your skills match listed project roles for optimal team building.</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <div style={{ padding: '28px 24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={iconBoxStyle}>
              <MessageSquare size={20} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>Live Workspaces</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Coordinate in channels, share portfolios, attach project files, and schedule meetings in real-time.</p>
            </div>
          </div>
        </GlowCard>

      </div>

    </div>
  );
};

const iconBoxStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: 'var(--accent-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(13, 148, 136, 0.05)'
};

export default Splash;
