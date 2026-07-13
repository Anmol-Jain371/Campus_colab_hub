import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Megaphone, Trophy, PlusCircle, Search, Calendar, CheckCircle } from 'lucide-react';
import GlowCard from '../visual/GlowCard';

const HomeDashboard = ({ onOpenCreateProject, onOpenCollabRequest }) => {
  const { 
    currentUser, 
    projects, 
    students, 
    events, 
    notifications, 
    navigateTo, 
    setActiveProjectId, 
    setActiveStudentId, 
    toggleEventRegistration, 
    calculateAIMatchScore 
  } = useApp();

  if (!currentUser) return null;

  const firstName = currentUser.name.split(' ')[0];
  const unreadNotis = notifications.some(n => !n.read);

  // Trending projects
  const trendingProjects = projects.slice(0, 2);

  // AI Recommended Collaborators
  const recommendedStudents = students
    .filter(s => s.id !== currentUser.id)
    .map(s => ({
      student: s,
      score: calculateAIMatchScore(s.skills, currentUser.skills)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  return (
    <section id="screen-home" className="screen active">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome back, <span id="dash-user-firstname">{firstName}</span>!</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Here is what's happening in your campus community today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={() => navigateTo('notifications')} style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
            <Bell size={18} />
            {unreadNotis && (
              <span id="dash-noti-indicator" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--error)', marginLeft: '4px' }}></span>
            )}
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="dashboard-banner" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="banner-content">
          <h2 className="banner-title">Build Something Extraordinary</h2>
          <p className="banner-subtitle">Interdisciplinary collaboration breeds innovation. Join forces with designers, coders, and marketers to bring your startup, research, or hackathon ideas to life.</p>
          <div className="banner-actions">
            <button className="btn btn-primary" onClick={onOpenCreateProject}>Create Project Listing</button>
            <button 
              className="btn btn-secondary" 
              style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} 
              onClick={() => navigateTo('discover')}
            >
              Find Collaborators
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="quick-actions-bar">
        <div className="quick-action-btn" onClick={onOpenCreateProject} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <PlusCircle color="var(--accent)" />
          <span>List a Project</span>
        </div>
        <div className="quick-action-btn" onClick={() => navigateTo('discover')} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search color="var(--accent)" />
          <span>Find Teammates</span>
        </div>
        <div className="quick-action-btn" onClick={() => navigateTo('events')} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Calendar color="var(--accent)" />
          <span>Browse Events</span>
        </div>
      </div>

      {/* Main Dashboard Content Grid */}
      <div className="grid-sidebar">
        
        {/* Left Column (Primary Feeds) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Trending Projects */}
          <div>
            <div className="dashboard-sections-title">
              <h2>Trending Project Opportunities</h2>
              <a onClick={() => navigateTo('projects')} style={{ cursor: 'pointer' }}>View all projects &rarr;</a>
            </div>
            <div className="grid-2">
              {trendingProjects.map(p => {
                const owner = students.find(s => s.id === p.ownerId) || currentUser;
                const score = calculateAIMatchScore(p.skillsNeeded, currentUser.skills);
                return (
                  <GlowCard key={p.id} className="project-card">
                    <div style={{ padding: '24px' }}>
                      <div className="match-score">
                        <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                        <span>{score}% Match</span>
                      </div>
                      <div className="project-card-header">
                        <div>
                          <h3 className="project-card-title">{p.title}</h3>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Proposed by {owner.name} ({owner.dept})
                          </p>
                        </div>
                      </div>
                      <p className="project-card-desc">{p.desc}</p>
                      <div className="chips-container" style={{ marginBottom: '16px' }}>
                        {p.skillsNeeded.map(s => {
                          const isMatch = currentUser.skills.includes(s);
                          return (
                            <span key={s} className={`badge ${isMatch ? 'badge-teal' : 'badge-muted'}`}>
                              {s}
                            </span>
                          );
                        })}
                      </div>
                      <div className="project-card-actions">
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => {
                            setActiveProjectId(p.id);
                            navigateTo('projects');
                          }}
                        >
                          View Project
                        </button>
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => onOpenCollabRequest(owner.id, p.id)}
                        >
                          Request to Join
                        </button>
                      </div>
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </div>

          {/* AI Recommended Collaborators */}
          <div>
            <div className="dashboard-sections-title">
              <h2>AI Recommended Collaborators</h2>
              <a onClick={() => navigateTo('discover')} style={{ cursor: 'pointer' }}>Browse students &rarr;</a>
            </div>
            <div className="grid-2">
              {recommendedStudents.map(item => {
                const s = item.student;
                return (
                  <GlowCard key={s.id} className="student-card">
                    <div style={{ padding: '24px' }}>
                      <div className="match-score">
                        <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                        <span>{item.score}% AI Match</span>
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
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {s.bio}
                      </p>
                      <div className="chips-container" style={{ marginBottom: '16px' }}>
                        {s.skills.slice(0, 3).map(sk => (
                          <span key={sk} className="badge badge-muted">{sk}</span>
                        ))}
                        {s.skills.length > 3 && (
                          <span className="badge badge-muted">+{s.skills.length - 3}</span>
                        )}
                      </div>
                      <div className="student-card-actions">
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => {
                            setActiveStudentId(s.id);
                            navigateTo('discover');
                          }}
                        >
                          Profile
                        </button>
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => onOpenCollabRequest(s.id)}
                        >
                          Collaborate
                        </button>
                      </div>
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (Announcements, Hackathons) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Faculty Announcements */}
          <GlowCard>
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone color="var(--accent)" size={20} />
                Faculty Announcements
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <span className="badge badge-teal" style={{ marginBottom: '6px' }}>Research Grant</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.3 }}>Inter-Departmental AI Research Proposal Open</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Dr. Ramamurthy, Dean of Research • 2 hours ago</p>
                </div>
                <div>
                  <span className="badge badge-blue" style={{ marginBottom: '6px' }}>Incubator</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.3 }}>Pre-Seed Seed Funding Pitch Deck Submissions</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Prof. Anita Desai, Campus E-Cell • 1 day ago</p>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Upcoming Hackathons/Events */}
          <GlowCard>
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy color="var(--warning)" size={20} />
                Upcoming Competitions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {events.slice(0, 2).map(ev => (
                  <div key={ev.id} className="event-card-compact" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                    <div className="event-date-box" style={{ flexShrink: 0 }}>
                      <span className="month">{ev.month}</span>
                      <span className="day">{ev.day}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginTop: '2px' }}>{ev.desc}</p>
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ marginTop: '8px', padding: '4px 8px', fontSize: '0.75rem' }} 
                        onClick={() => toggleEventRegistration(ev.id)}
                      >
                        {ev.registered ? 'Registered' : 'Express Interest'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>

        </div>

      </div>
    </section>
  );
};

const Sparkles = ({ size, style }) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

export default HomeDashboard;
