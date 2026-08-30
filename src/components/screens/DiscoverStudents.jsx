import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, CheckCircle, ShieldCheck, Github, Linkedin, MessageSquare, UserPlus, ArrowLeft, Sparkles } from 'lucide-react';
import GlowCard from '../visual/GlowCard';
import SkillRadarChart from '../visual/SkillRadarChart';

const DiscoverStudents = ({ onOpenCollabRequest }) => {
  const { 
    students, 
    currentUser, 
    projects, 
    activeStudentId, 
    setActiveStudentId, 
    openDirectChat, 
    calculateAIMatchScore,
    endorseStudent,
    showToast 
  } = useApp();

  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  if (!currentUser) return null;

  // Filter students (excluding current user)
  const filteredStudents = students.filter(s => {
    if (s.id === currentUser.id) return false;

    const matchesSearch = s.name.toLowerCase().includes(query.toLowerCase()) ||
                          s.skills.some(sk => sk.toLowerCase().includes(query.toLowerCase())) ||
                          s.bio.toLowerCase().includes(query.toLowerCase());
    
    const matchesDept = deptFilter === 'All' || s.dept === deptFilter;
    const matchesYear = yearFilter === 'All' || s.year === yearFilter;

    return matchesSearch && matchesDept && matchesYear;
  });

  const activeStudent = students.find(s => s.id === activeStudentId);

  // If a student profile is clicked, show details
  if (activeStudent) {
    const s = activeStudent;
    const matchScore = calculateAIMatchScore(s.skills, currentUser.skills);
    const studentProjects = projects.filter(p => p.members.some(m => m.studentId === s.id));

    return (
      <section id="screen-student-profile" className="screen active">
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ marginBottom: '20px' }} 
          onClick={() => setActiveStudentId(null)}
        >
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to List
        </button>

        <div className="profile-hero">
          <div className="profile-cover"></div>
          <div className="profile-hero-content">
            <img src={s.avatar} alt={s.name} className="profile-pfp" />
            <div className="profile-meta-main">
              <div className="profile-name-row">
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{s.name}</h1>
                {s.verified && (
                  <div className="verified-badge">
                    <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verified Student
                  </div>
                )}
              </div>
              <div className="profile-dept-year">
                <span>{s.dept}</span>
                <span>•</span>
                <span>{s.year}</span>
              </div>
              <div className="profile-contact-links">
                {s.github && <a href={s.github} target="_blank" rel="noopener noreferrer" className="contact-icon-btn"><Github size={18} /></a>}
                {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="contact-icon-btn"><Linkedin size={18} /></a>}
                <a onClick={() => openDirectChat(s.id)} className="contact-icon-btn" title="Message Student" style={{ cursor: 'pointer' }}>
                  <MessageSquare size={18} />
                </a>
              </div>
            </div>
            
            <div className="trust-score-container">
              <div className="circular-progress" style={{ '--progress': s.trustScore }}>
                <span className="progress-value">{s.trustScore}%</span>
              </div>
              <span className="trust-lbl">AI Trust Score</span>
            </div>
            
            <div style={{ alignSelf: 'center', display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={() => onOpenCollabRequest(s.id)}>
                <UserPlus size={18} style={{ marginRight: '6px' }} /> Send Collab Request
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => endorseStudent(s.id)}
                style={{ border: '1px solid var(--accent)', color: 'var(--accent)', fontWeight: 700 }}
              >
                ★ Endorse ({s.endorsements || 0})
              </button>
            </div>
          </div>
        </div>

        <div className="grid-sidebar">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>About Me</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{s.bio}</p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Portfolio & Assets</h3>
              <div className="portfolio-gallery">
                {s.portfolio && s.portfolio.length > 0 ? (
                  s.portfolio.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="portfolio-item" 
                      onClick={() => showToast('Opening high-res portfolio asset...', 'info')}
                    >
                      <img src={img} alt="Project screenshot" />
                      <div className="portfolio-item-overlay">
                        <span>View Asset #{idx + 1}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No assets uploaded.</p>
                )}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Past Projects & Case Studies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {studentProjects.length > 0 ? (
                  studentProjects.map(p => (
                    <div key={p.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{p.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.desc.substring(0, 100)}...</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <span className="badge badge-teal">{p.category}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No active projects recorded on hub yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Skills & Competencies</h3>
              <div className="chips-container">
                {s.skills.map(sk => (
                  <div key={sk} className="chip selected" style={{ cursor: 'default' }}>
                    {sk}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Collaboration Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Status Availability:</span>
                  <span className={s.availability.includes('Open') ? 'badge badge-success' : 'badge badge-warning'}>
                    {s.availability}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Project Interest:</span>
                  <span style={{ fontWeight: 600 }}>{s.interest}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Endorsements:</span>
                  <span style={{ fontWeight: 600 }}>{s.endorsements} Peer Endorsements</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--accent)" /> DNA Skill Chart
              </h3>
              <SkillRadarChart projectSkills={currentUser.skills} studentSkills={s.skills} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Otherwise, render list view
  return (
    <section id="screen-discover" className="screen active">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Discover Skillful Teammates</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Filter and match with students from different departments based on technical and creative skills.
          </p>
        </div>
      </div>

      {/* Search and Filters Panel */}
      <div className="search-filter-panel">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by name, skills, or projects..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-selects">
          <select 
            className="filter-select" 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="MCA">MCA</option>
            <option value="Electrical Engineering">Electrical Eng</option>
            <option value="Mechanical Engineering">Mechanical Eng</option>
            <option value="Design & Fine Arts">Design & UI/UX</option>
            <option value="Business School">Business School</option>
          </select>
          <select 
            className="filter-select" 
            value={yearFilter} 
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="All">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Postgraduate">Postgrad/PhD</option>
          </select>
        </div>
      </div>

      {/* Discover Student Grid */}
      <div className="student-card-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(s => {
            const matchScore = calculateAIMatchScore(s.skills, currentUser.skills);
            return (
              <GlowCard key={s.id} className="student-card">
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                  <div className="match-score">
                    <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                    <span>{matchScore}% Match</span>
                  </div>
                  <div className="student-card-top">
                    <img src={s.avatar} alt={s.name} className="student-card-avatar" />
                    <div className="student-card-details">
                      <h3 className="student-card-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {s.name} 
                        {s.verified && (
                          <CheckCircle size={14} style={{ fill: 'var(--accent-light)', color: 'var(--accent)' }} />
                        )}
                      </h3>
                      <p className="student-card-dept">{s.dept} • {s.year}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {s.bio}
                  </p>
                  <div className="chips-container" style={{ marginBottom: '16px' }}>
                    {s.skills.map(sk => (
                      <span key={sk} className="badge badge-muted">{sk}</span>
                    ))}
                  </div>
                  <div className="student-card-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveStudentId(s.id)}>View Profile</button>
                    <button className="btn btn-primary btn-sm" onClick={() => onOpenCollabRequest(s.id)}>Collaborate</button>
                  </div>
                </div>
              </GlowCard>
            );
          })
        ) : (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <Search size={48} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
            <h3>No students found matching the filter options.</h3>
            <p style={{ marginTop: '8px' }}>Try modifying your keyword search or adjusting the filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscoverStudents;
