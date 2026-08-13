import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera } from 'lucide-react';
import { skillsList } from '../../data/mockData';
import Magnet from '../visual/Magnet';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state with current user when open
  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name);
      setDept(currentUser.dept);
      setYear(currentUser.year);
      setBio(currentUser.bio || '');
      setSelectedSkills(currentUser.skills || []);
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !dept || !year) {
      return;
    }
    setLoading(true);
    const success = await updateUserProfile(name, dept, year, bio, selectedSkills, avatar);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div id="modal-edit-profile" className="modal-overlay active" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Edit My Profile Portfolio</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Avatar Select Row */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={avatar} 
                  alt="Upload avatar" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} 
                />
                <label htmlFor="avatar-file-edit" style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                  <Camera size={14} />
                </label>
                <input 
                  type="file" 
                  id="avatar-file-edit" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleAvatarUpload} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select 
                  className="form-control" 
                  value={dept} 
                  onChange={(e) => setDept(e.target.value)} 
                  required
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="MCA">MCA</option>
                  <option value="Electrical Engineering">Electrical Eng</option>
                  <option value="Mechanical Engineering">Mechanical Eng</option>
                  <option value="Design & Fine Arts">Design & UI/UX</option>
                  <option value="Business School">Business School</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Year of Study</label>
                <select 
                  className="form-control" 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)} 
                  required
                >
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
              <label className="form-label">Selected Skills (Toggle to select)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', background: '#f8fafc' }}>
                {skillsList.map(skill => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <div 
                      key={skill} 
                      className={`badge ${isSelected ? 'badge-teal' : 'badge-muted'}`} 
                      onClick={() => toggleSkill(skill)}
                      style={{ cursor: 'pointer', transition: 'all 0.2s', padding: '6px 10px', fontSize: '0.75rem' }}
                    >
                      {skill}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Biography</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Tell other students about your portfolio goals..." 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <Magnet>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
                style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </Magnet>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;
