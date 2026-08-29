import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';
import { skillsList } from '../../data/mockData';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const { addProject, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [size, setSize] = useState(4);
  const [deadline, setDeadline] = useState('');
  const [mentor, setMentor] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [selectedSkills, setSelectedSkills] = useState([]);

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      if (selectedSkills.length >= 5) {
        showToast('You can select a maximum of 5 skills.', 'info');
        return;
      }
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      showToast('Please select at least 1 required skill.', 'info');
      return;
    }
    if (mentorEmail && !mentorEmail.toLowerCase().endsWith('@rvce.edu.in')) {
      showToast('Faculty mentor email must be an official @rvce.edu.in address.', 'error');
      return;
    }
    addProject(title, desc, size, deadline, mentor, category, selectedSkills, mentorEmail);
    onClose();
    // Reset state
    setTitle('');
    setDesc('');
    setSize(4);
    setDeadline('');
    setMentor('');
    setMentorEmail('');
    setCategory('Hackathon');
    setSelectedSkills([]);
  };

  return (
    <div id="modal-create-project" className="modal-overlay active">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Create Project Opportunities</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="form-group">
              <label htmlFor="new-project-title" className="form-label">Project Title</label>
              <input 
                type="text" 
                id="new-project-title" 
                className="form-control" 
                placeholder="e.g., IoT Smart Classroom System, Campus E-Comm App" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-project-desc" className="form-label">Description & Goals</label>
              <textarea 
                id="new-project-desc" 
                className="form-control" 
                rows="4" 
                placeholder="Detail the problem, technical stack, and target milestones..." 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-project-size" className="form-label">Desired Team Size</label>
                <input 
                  type="number" 
                  id="new-project-size" 
                  className="form-control" 
                  min="2" 
                  max="15" 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-project-deadline" className="form-label">Target Completion/Deadline</label>
                <input 
                  type="date" 
                  id="new-project-deadline" 
                  className="form-control" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-project-mentor" className="form-label">Faculty Mentor Name (Optional)</label>
                <input 
                  type="text" 
                  id="new-project-mentor" 
                  className="form-control" 
                  placeholder="e.g. Dr. Amit Sen"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-project-mentor-email" className="form-label">Faculty Email for Verification (Optional)</label>
                <input 
                  type="email" 
                  id="new-project-mentor-email" 
                  className="form-control" 
                  placeholder="e.g. amitsen@rvce.edu.in"
                  value={mentorEmail}
                  onChange={(e) => setMentorEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-project-type" className="form-label">Category</label>
              <select 
                id="new-project-type" 
                className="form-control" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Hackathon">Hackathon Project</option>
                <option value="Research">Research & Paper</option>
                <option value="Startup">Startup Venture</option>
                <option value="Competition">Academic Competition</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Skills Needed (Select up to 5)</label>
              <div id="project-skills-selector" className="chips-container">
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
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Publish Listing</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
