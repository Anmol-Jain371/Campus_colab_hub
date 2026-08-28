import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera } from 'lucide-react';
import { skillsList } from '../../data/mockData';
import DecryptedText from '../visual/DecryptedText';
import Magnet from '../visual/Magnet';

const Register = () => {
  const { registerUser, navigateTo, showToast, uploadFile } = useApp();

  // Registration Form State
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usn, setUsn] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      showToast('Uploading profile picture to campus server...', 'info');
      const url = await uploadFile(file);
      if (url) {
        setAvatar(url);
        showToast('Profile picture uploaded successfully!', 'success');
      }
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !dept || !year) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    if (!email.trim().toLowerCase().endsWith('@rvce.edu.in')) {
      showToast('Registration Restricted! Only official RV College emails (@rvce.edu.in) are permitted.', 'error');
      return;
    }
    if (userType !== 'faculty') {
      const usnRegex = /^1RV\d{2}(CS|IS|EC|EE|ME|BT|CV|CH|TE|AS|IM|MC)\d{3}$/i;
      if (!usnRegex.test(usn.trim())) {
        showToast('Invalid USN format! Must match official RVCE student format (e.g. 1RV22MC025).', 'error');
        return;
      }
    }
    if (selectedSkills.length < 3) {
      showToast('Please select at least 3 skills.', 'error');
      return;
    }
    
    setLoading(true);
    const res = await registerUser(name, email.trim(), password, dept, year, bio, selectedSkills, avatar, userType, userType === 'faculty' ? null : usn.trim().toUpperCase());
    setLoading(false);
  };

  return (
    <div id="screen-register" className="screen active" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', padding: '40px 24px', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ maxWidth: '580px', width: '100%', background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            <DecryptedText text="Create RVCE Student Profile" speed={40} maxIterations={10} animateOn="hover" />
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Set up your verified campus portfolio (<strong style={{ color: 'var(--accent)' }}>@rvce.edu.in</strong> only)
          </p>
        </div>

        {/* Student vs Faculty Switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => { setUserType('student'); setYear(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700,
              background: userType === 'student' ? 'white' : 'transparent',
              color: userType === 'student' ? 'var(--accent)' : 'var(--text-secondary)',
              boxShadow: userType === 'student' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            🎓 Student Account
          </button>
          <button 
            type="button"
            onClick={() => { setUserType('faculty'); setYear(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700,
              background: userType === 'faculty' ? 'white' : 'transparent',
              color: userType === 'faculty' ? 'var(--accent)' : 'var(--text-secondary)',
              boxShadow: userType === 'faculty' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            🔬 Faculty Member
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Avatar Select Row */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={avatar} 
                alt="Upload avatar" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} 
              />
              <label htmlFor="avatar-file" style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                <Camera size={14} />
              </label>
              <input 
                type="file" 
                id="avatar-file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarUpload} 
              />
            </div>
          </div>

          {/* Form grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Anmol Jain" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>RVCE College Email *</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="anmoljainp.mca25@rvce.edu.in" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Password *</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Password (min 6 chars)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {userType !== 'faculty' && (
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>University USN *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 1RV25MC001" 
                  value={usn} 
                  onChange={(e) => setUsn(e.target.value)} 
                  required 
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>RVCE Department *</label>
              <select 
                className="form-control" 
                value={dept} 
                onChange={(e) => setDept(e.target.value)} 
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                <option value="Information Science & Engineering">Information Science (ISE)</option>
                <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                <option value="Artificial Intelligence & ML">AI & Machine Learning (AIML)</option>
                <option value="Electronics & Communication">Electronics & Comm (ECE)</option>
                <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                <option value="Mechanical Engineering">Mechanical Eng (MECH)</option>
                <option value="Biotechnology">Biotechnology (BT)</option>
                <option value="Civil Engineering">Civil Engineering (CIV)</option>
                <option value="Chemical Engineering">Chemical Engineering (CHE)</option>
                <option value="Telecommunication Engineering">Telecomm Engineering (ETE)</option>
                <option value="Aerospace Engineering">Aerospace Engineering (ASE)</option>
                <option value="Industrial Engineering & Management">Industrial Eng & Mgmt (IEM)</option>
              </select>
            </div>

          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
              {userType === 'faculty' ? 'Academic Title / Designation *' : 'Year of Study *'}
            </label>
            {userType === 'faculty' ? (
              <select 
                className="form-control" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                required
              >
                <option value="">Select Title</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Researcher">Researcher</option>
              </select>
            ) : (
              <select 
                className="form-control" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                required
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year (UG)</option>
                <option value="2nd Year">2nd Year (UG)</option>
                <option value="3rd Year">3rd Year (UG)</option>
                <option value="4th Year">4th Year (UG)</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Research Scholar">Research Scholar</option>
              </select>
            )}
          </div>

          {/* Skills Checklist Selection */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Select Skills (Pick at least 3) *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '110px', overflowY: 'auto', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px' }}>
              {skillsList.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <div 
                    key={skill} 
                    className={`badge ${isSelected ? 'badge-teal' : 'badge-muted'}`} 
                    onClick={() => toggleSkill(skill)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s', padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    {skill}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Short Bio</label>
            <textarea 
              className="form-control" 
              rows="2" 
              placeholder="Tell other students about your interests, project ideas..." 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <Magnet style={{ width: '100%', marginTop: '8px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 600, background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px' }}
            >
              {loading ? 'Registering...' : 'Create Profile & Enter Hub'}
            </button>
          </Magnet>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px' }}>
            Already have an account?{' '}
            <span 
              onClick={() => navigateTo('login')} 
              style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Log In
            </span>
          </p>

        </form>

      </div>

    </div>
  );
};

export default Register;
