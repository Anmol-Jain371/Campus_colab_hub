import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, User, Calendar, Users, ArrowLeft, GraduationCap, Share, Sparkles } from 'lucide-react';
import GlowCard from '../visual/GlowCard';

const ProjectBoard = ({ onOpenCreateProject, onOpenCollabRequest }) => {
  const { 
    projects, 
    currentUser, 
    students, 
    activeProjectId, 
    setActiveProjectId, 
    addProjectComment, 
    calculateAIMatchScore,
    showToast 
  } = useApp();

  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [commentText, setCommentText] = useState('');

  if (!currentUser) return null;

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) ||
                          p.desc.toLowerCase().includes(query.toLowerCase()) ||
                          p.skillsNeeded.some(sk => sk.toLowerCase().includes(query.toLowerCase()));
    
    const matchesSkill = skillFilter === 'All' || p.skillsNeeded.includes(skillFilter);

    return matchesSearch && matchesSkill;
  });

  const activeProject = projects.find(p => p.id === activeProjectId);

  // If a project is selected, show details
  if (activeProject) {
    const p = activeProject;
    const owner = students.find(s => s.id === p.ownerId) || currentUser;
    const isMember = p.members.some(m => m.studentId === currentUser.id);

    const handleCommentSubmit = (e) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      addProjectComment(p.id, commentText);
      setCommentText('');
    };

    return (
      <section id="screen-project-details" className="screen active">
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ marginBottom: '20px' }} 
          onClick={() => setActiveProjectId(null)}
        >
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Projects
        </button>

        <div className="project-details-grid">
          {/* Left Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ position: 'relative' }}>
              <span className="badge badge-teal" style={{ position: 'absolute', top: '24px', right: '24px' }}>
                Active Recruitment
              </span>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '12px', maxWidth: '80%' }}>{p.title}</h1>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} /> Proposed by: <strong>{owner.name}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} /> Deadline: <strong>{p.deadline}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} /> Team Size: <strong>{p.members.length}/{p.teamSize} Students</strong>
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Project Overview</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>{p.desc}</p>
              
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Desired Skill Sets Needed</h3>
              <div className="chips-container" style={{ marginBottom: '24px' }}>
                {p.skillsNeeded.map(s => (
                  <span key={s} className="badge badge-teal">{s}</span>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                {isMember ? (
                  <button className="btn btn-secondary" disabled>Already in Project Team</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => onOpenCollabRequest(p.ownerId, p.id)}>
                    Request to Join Team
                  </button>
                )}
                <button className="btn btn-outline" onClick={() => showToast('Project link copied to clipboard (Simulated).', 'success')}>
                  <Share size={16} style={{ marginRight: '6px' }} /> Share Listing
                </button>
              </div>
            </div>

            {/* Discussions Section */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Project Discussion Board</h3>
              <div className="discussion-board">
                <form onSubmit={handleCommentSubmit} className="discussion-input-wrapper">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ask a question or offer input..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Comment</button>
                </form>
                <div className="discussion-threads">
                  {p.comments.length > 0 ? (
                    p.comments.map((c, idx) => {
                      const commentAuthor = students.find(s => s.name === c.author) || currentUser;
                      return (
                        <div key={idx} className="thread-item">
                          <img src={commentAuthor.avatar} alt={c.author} className="avatar" style={{ width: '32px', height: '32px' }} />
                          <div className="thread-body">
                            <div className="thread-header">
                              <span className="thread-author">{c.author}</span>
                              <span className="thread-time">{c.time}</span>
                            </div>
                            <p className="thread-text">{c.text}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }}>
                      No comments yet. Start the conversation!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Current Team Members</h3>
              <div className="team-members-list">
                {p.members.map((member, idx) => {
                  const s = students.find(x => x.id === member.studentId) || currentUser;
                  return (
                    <div key={idx} className="member-item">
                      <img src={s.avatar} alt={s.name} className="avatar" style={{ width: '32px', height: '32px' }} />
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.dept}</p>
                      </div>
                      <span className="member-role">{member.role}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Mentorship & Support</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyName: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>{p.mentor || 'None Assigned'}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Faculty Mentor</p>
                </div>
              </div>
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Approved for incubation at E-Cell Hub. Seed grant pending teammate finalization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Otherwise show Project Board list view
  return (
    <section id="screen-projects" className="screen active">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Project Collaboration Board</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Browse active projects looking for multi-department talent, or post your own proposal.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateProject}>
          <Plus size={18} style={{ marginRight: '6px' }} /> Create Project Listing
        </button>
      </div>

      <div className="search-filter-panel">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search project titles, descriptions, skills..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-selects">
          <select 
            className="filter-select" 
            value={skillFilter} 
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="All">All Skills</option>
            <option value="Python">Python</option>
            <option value="React">React</option>
            <option value="Figma">Figma</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <div className="grid-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(p => {
            const owner = students.find(s => s.id === p.ownerId) || currentUser;
            const score = calculateAIMatchScore(p.skillsNeeded, currentUser.skills);
            return (
              <GlowCard key={p.id} className="project-card">
                <div style={{ padding: '24px' }}>
                  <div className="match-score">
                    <Sparkles size={14} style={{ color: 'var(--accent)', marginRight: '4px' }} />
                    <span>{score}% Match</span>
                  </div>
                  <div className="project-card-header">
                    <div>
                      <h3 className="project-card-title">{p.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Proposed by {owner.name}</p>
                    </div>
                  </div>
                  <p className="project-card-desc">{p.desc}</p>
                  
                  <div className="chips-container" style={{ marginBottom: '20px' }}>
                    {p.skillsNeeded.map(s => (
                      <span key={s} className={`badge ${currentUser.skills.includes(s) ? 'badge-teal' : 'badge-muted'}`}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="project-card-meta">
                    <div className="meta-item"><Users size={14} /> Team: {p.members.length}/{p.teamSize}</div>
                    <div className="meta-item"><Calendar size={14} /> {p.category}</div>
                  </div>
                  <div className="project-card-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveProjectId(p.id)}>View</button>
                    <button className="btn btn-primary btn-sm" onClick={() => onOpenCollabRequest(owner.id, p.id)}>Request to Join</button>
                  </div>
                </div>
              </GlowCard>
            );
          })
        ) : (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <Search size={48} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
            <h3>No projects found.</h3>
            <p style={{ marginTop: '8px' }}>Be the first to list a project on the board!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectBoard;
