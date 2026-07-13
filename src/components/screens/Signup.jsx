import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera } from 'lucide-react';
import { skillsList } from '../../data/mockData';
import GridBackground from '../visual/GridBackground';

const Signup = () => {
  const { sendMockOTP, completeSignup, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Step 2 Form State
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSendOTP = () => {
    if (!email) {
      showToast('Please enter your university email.', 'info');
      return;
    }
    sendMockOTP(email);
    setShowOtpInput(true);
  };

  const handleVerifyStep1 = (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      showToast('Invalid OTP passcode. Enter "123456" for demo.', 'info');
      return;
    }
    showToast('Email verified successfully!', 'success');
    setStep(2);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleSubmitStep2 = (e) => {
    e.preventDefault();
    if (selectedSkills.length < 3) {
      showToast('Please select at least 3 skills.', 'info');
      return;
    }
    completeSignup(name, dept, year, bio, selectedSkills, avatar);
  };

  return (
    <GridBackground>
      <div id="screen-signup" className="screen signup-wrapper active" style={{ background: 'transparent' }}>
        <div className="signup-card" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.7)', color: 'white' }}>
          <div className="signup-header">
            <h2 className="signup-title">Create Student Profile</h2>
            <p className="signup-desc" style={{ color: '#94a3b8' }}>Verify your credentials and set up your student portfolio</p>
          </div>

        {step === 1 ? (
          <div id="signup-step-1" className="signup-step active">
            <form onSubmit={handleVerifyStep1}>
              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">University Email Address</label>
                <input 
                  type="email" 
                  id="signup-email" 
                  className="form-control" 
                  placeholder="username@university.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              {showOtpInput && (
                <div className="form-group" id="otp-group">
                  <label htmlFor="signup-otp" className="form-label">One-Time Passcode (OTP)</label>
                  <input 
                    type="text" 
                    id="signup-otp" 
                    className="form-control" 
                    placeholder="Enter 6-digit OTP code" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '4px', display: 'inline-block' }}>
                    Mock OTP: 123456
                  </span>
                </div>
              )}

              {!showOtpInput ? (
                <button 
                  type="button" 
                  id="btn-send-otp" 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginBottom: '12px' }}
                  onClick={handleSendOTP}
                >
                  Send Verification Code
                </button>
              ) : (
                <button 
                  type="submit" 
                  id="btn-verify-otp" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  Verify & Continue
                </button>
              )}
            </form>
          </div>
        ) : (
          <div id="signup-step-2" className="signup-step active">
            <form onSubmit={handleSubmitStep2}>
              <div className="avatar-uploader">
                <div className="avatar-preview-container">
                  <img 
                    id="signup-avatar-preview" 
                    src={avatar} 
                    alt="Profile Preview" 
                    className="avatar-preview" 
                  />
                  <label htmlFor="signup-avatar-file" className="avatar-upload-btn">
                    <Camera size={16} />
                  </label>
                  <input 
                    type="file" 
                    id="signup-avatar-file" 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upload Profile Picture</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="signup-dept" className="form-label">Department / Branch</label>
                  <select 
                    id="signup-dept" 
                    className="form-control" 
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science (CSE)</option>
                    <option value="Electrical Engineering">Electrical Eng (ECE)</option>
                    <option value="Mechanical Engineering">Mechanical Eng (ME)</option>
                    <option value="Design & Fine Arts">Design & Fine Arts (UI/UX)</option>
                    <option value="Business School">Business School (MBA)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-year" className="form-label">Year of Study</label>
                  <select 
                    id="signup-year" 
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
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-name" className="form-label">Full Name</label>
                <input 
                  type="text" 
                  id="signup-name" 
                  className="form-control" 
                  placeholder="Anjali Sharma" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Core Skills (Select at least 3)</label>
                <div id="skills-selector" className="chips-container">
                  {skillsList.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <div 
                        key={skill} 
                        className={`chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-bio" className="form-label">Short Bio</label>
                <textarea 
                  id="signup-bio" 
                  className="form-control" 
                  rows="3" 
                  placeholder="Explain your design/code interests..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Create Profile & Enter Hub
              </button>
            </form>
          </div>
        )}
        </div>
      </div>
    </GridBackground>
  );
};

export default Signup;
