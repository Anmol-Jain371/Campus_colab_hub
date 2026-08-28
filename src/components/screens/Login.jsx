import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DecryptedText from '../visual/DecryptedText';
import Magnet from '../visual/Magnet';
import illustrationImg from '../../assets/workspace_illustration.png';

const Login = () => {
  const { loginUser, navigateTo, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (!email.trim().toLowerCase().endsWith('@rvce.edu.in')) {
      showToast('Access Restricted! Please use your official RV College email (@rvce.edu.in).', 'error');
      return;
    }
    setLoading(true);
    const res = await loginUser(email.trim(), password);
    setLoading(false);
  };

  return (
    <div id="screen-login" className="screen active" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', overflow: 'hidden' }}>
      
      {/* Left Column: Sign In Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', zIndex: 10 }}>
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          
          {/* Logo & Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>C</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>CampusConnect RVCE</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            <DecryptedText text="RVCE Student Login" speed={40} maxIterations={10} animateOn="hover" />
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Welcome back! Log in with your official RV College of Engineering credentials (<strong style={{ color: 'var(--accent)' }}>@rvce.edu.in</strong>).
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>RVCE College Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="anmoljainp.mca25@rvce.edu.in" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ padding: '12px 16px', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>Must end with @rvce.edu.in</span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ padding: '12px 16px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Demo forgot password link clicked.', 'info'); }} style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Forgot Password?</a>
            </div>

            <Magnet className="auth-btn-magnet" style={{ width: '100%' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  fontSize: '0.95rem', 
                  fontWeight: 600,
                  borderRadius: '8px',
                  background: 'var(--accent)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </Magnet>
          </form>

          {/* Registration Redirect Link */}
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '24px' }}>
            No account yet?{' '}
            <span 
              onClick={() => navigateTo('register')} 
              style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Register
            </span>
          </p>

        </div>
      </div>

      {/* Right Column: Premium AI Generated Workspace Illustration */}
      <div style={{ flex: 1.1, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderLeft: '1px solid var(--border)' }}>
        
        {/* Floating Brand Shape */}
        <div style={{ position: 'absolute', top: '48px', right: '48px', background: 'white', padding: '8px 16px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></span>
          Cross-Department Platform
        </div>

        {/* Workspace Illustration Image */}
        <img 
          src={illustrationImg} 
          alt="Workspace Illustration" 
          style={{ 
            maxWidth: '85%', 
            maxHeight: '80%', 
            objectFit: 'contain', 
            borderRadius: '16px', 
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
            border: '4px solid white',
            background: 'white'
          }} 
        />
      </div>

    </div>
  );
};

export default Login;
