import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

const CollabRequestModal = ({ isOpen, onClose, studentId, projectId }) => {
  const { students, projects, currentUser, joinProjectRequest } = useApp();
  
  const [assocProjectId, setAssocProjectId] = useState('none');
  const [role, setRole] = useState('');
  const [intro, setIntro] = useState('');
  const [timeline, setTimeline] = useState('');
  const [availability, setAvailability] = useState('');

  const targetStudent = students.find(s => s.id === studentId);
  const myProjects = projects.filter(p => p.ownerId === currentUser?.id);

  // Set default intro and fields when student changes
  useEffect(() => {
    if (targetStudent) {
      setIntro(`Hi ${targetStudent.name.split(' ')[0]}, I saw your profile and skills in ${targetStudent.skills.slice(0, 2).join(', ')}. I think you would be a great fit for collaboration!`);
    }
    if (projectId) {
      setAssocProjectId(projectId);
    } else {
      setAssocProjectId('none');
    }
    setRole('');
    setTimeline('');
    setAvailability('');
  }, [studentId, projectId, targetStudent]);

  if (!isOpen || !targetStudent) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    joinProjectRequest(assocProjectId, studentId, role, intro, timeline, availability);
    onClose();
  };

  return (
    <div id="modal-collab-request" className="modal-overlay active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Send Collaboration Request</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <img src={targetStudent.avatar} alt={targetStudent.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>{targetStudent.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{targetStudent.dept} • {targetStudent.year}</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="collab-project-select" className="form-label">Associate with Project</label>
              <select 
                id="collab-project-select" 
                className="form-control" 
                value={assocProjectId}
                onChange={(e) => setAssocProjectId(e.target.value)}
                required
              >
                <option value="none">General Connection Request (No project)</option>
                {myProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="collab-role" className="form-label">Role Offered / Needed</label>
              <input 
                type="text" 
                id="collab-role" 
                className="form-control" 
                placeholder="e.g. Front-End React Developer, UI/UX Designer" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="collab-intro" className="form-label">Introduction & Objectives</label>
              <textarea 
                id="collab-intro" 
                className="form-control" 
                rows="4" 
                placeholder="Briefly describe the project goals and why you'd like to collaborate..." 
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="collab-timeline" className="form-label">Expected Duration</label>
                <input 
                  type="text" 
                  id="collab-timeline" 
                  className="form-control" 
                  placeholder="e.g. 2 weeks, 3 months" 
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="collab-availability" className="form-label">Weekly Commitment</label>
                <input 
                  type="text" 
                  id="collab-availability" 
                  className="form-control" 
                  placeholder="e.g. 5-8 hours/week" 
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollabRequestModal;
