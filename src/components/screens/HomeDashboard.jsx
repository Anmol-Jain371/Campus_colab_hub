import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Megaphone, Trophy, PlusCircle, Search, Calendar, CheckCircle, Sparkles } from 'lucide-react';
import GlowCard from '../visual/GlowCard';
import DecryptedText from '../visual/DecryptedText';
import Magnet from '../visual/Magnet';

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

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [quizInterest, setQuizInterest] = useState('Hackathon');
  const [quizRole, setQuizRole] = useState('Developer');
  const [quizHours, setQuizHours] = useState('10 hrs');
  const [quizResult, setQuizResult] = useState(null);

  const handleQuizSubmit = () => {
    let matchingProj = projects.find(p => {
      if (quizRole === 'Developer') {
        return p.skillsNeeded.some(s => ['react', 'node', 'python', 'sqlite', 'javascript', 'backend', 'frontend', 'developer'].includes(s.toLowerCase()));
      }
      if (quizRole === 'Designer') {
        return p.skillsNeeded.some(s => ['figma', 'design', 'ui/ux', 'photoshop', 'illustrator', 'consultant'].includes(s.toLowerCase()));
      }
      return p.skillsNeeded.some(s => ['business', 'marketing', 'pitching', 'strategy', 'product'].includes(s.toLowerCase()));
    });
    
    if (!matchingProj) {
      matchingProj = projects[0] || { title: 'Decentralized Campus Locker', id: 'p1', skillsNeeded: ['React', 'SQLite', 'Figma'] };
    }
    
    const baseScore = calculateAIMatchScore(matchingProj.skillsNeeded, currentUser.skills);
    setQuizResult({
      project: matchingProj,
      score: Math.min(99, baseScore + 18),
      justification: `This project is a strong fit. It aligns with your '${quizInterest}' focus and has an open slot matching your ${quizRole} skills.`
    });
    setQuizStep(4);
  };

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
          <h1 className="page-title">
            <DecryptedText text={`Welcome back, ${firstName}!`} speed={50} maxIterations={12} animateOn="hover" />
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Here is what's happening in your campus community today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Magnet>
            <button className="btn btn-outline" onClick={() => navigateTo('notifications')}>
              <Bell size={18} />
              {unreadNotis && (
                <span id="dash-noti-indicator" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--error)', marginLeft: '4px' }}></span>
              )}
            </button>
          </Magnet>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <div className="banner-content">
          <h2 className="banner-title" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            <DecryptedText text="Build Something Extraordinary" speed={45} maxIterations={14} animateOn="hover" />
          </h2>
          <p className="banner-subtitle">Interdisciplinary collaboration breeds innovation. Join forces with designers, coders, and marketers to bring your startup, research, or hackathon ideas to life.</p>
          <div className="banner-actions" style={{ display: 'flex', gap: '12px' }}>
            <Magnet>
              <button className="btn btn-primary" onClick={onOpenCreateProject}>Create Project Listing</button>
            </Magnet>
            <Magnet>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigateTo('discover')}
              >
                Find Collaborators
              </button>
            </Magnet>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="quick-actions-bar">
        <Magnet>
          <div className="quick-action-btn btn-create" onClick={onOpenCreateProject}>
            <PlusCircle />
            <span>List a Project</span>
          </div>
        </Magnet>
        <Magnet>
          <div className="quick-action-btn btn-find" onClick={() => navigateTo('discover')}>
            <Search />
            <span>Find Teammates</span>
          </div>
        </Magnet>
        <Magnet>
          <div className="quick-action-btn btn-event" onClick={() => navigateTo('events')}>
            <Calendar />
            <span>Browse Events</span>
          </div>
        </Magnet>
        <Magnet>
          <div 
            className="quick-action-btn btn-ai-quiz" 
            onClick={() => {
              setIsQuizOpen(true);
              setQuizStep(1);
              setQuizResult(null);
            }}
            style={{ border: '1px solid var(--accent)', background: 'rgba(13, 148, 136, 0.04)' }}
          >
            <Sparkles color="var(--accent)" />
            <span style={{ color: 'var(--accent)', fontWeight: 800 }}>AI Match Quiz</span>
          </div>
        </Magnet>
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

      {/* AI Match Finder Questionnaire Modal */}
      {isQuizOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9990,
          padding: '20px'
        }}>
          
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            position: 'relative'
          }}>
            
            {/* Close button */}
            <button 
              onClick={() => setIsQuizOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              Close X
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color="var(--accent)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Match Finder Quiz</h3>
            </div>
            
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
              {[1, 2, 3, 4].map(num => (
                <div 
                  key={num} 
                  style={{ 
                    flex: 1, 
                    height: '4px', 
                    background: quizStep >= num ? 'var(--accent)' : '#e2e8f0',
                    borderRadius: '2px',
                    transition: 'all 0.3s'
                  }} 
                />
              ))}
            </div>

            {/* Quiz Step 1: Project Type interest */}
            {quizStep === 1 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>1. What type of project fits your goals today?</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Hackathon Opportunity', 'Startup Prototype', 'Academic Research Lab'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => setQuizInterest(opt)}
                      style={{
                        padding: '12px 16px',
                        border: quizInterest === opt ? '2px solid var(--accent)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        background: quizInterest === opt ? 'rgba(13, 148, 136, 0.03)' : 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button className="btn btn-primary" onClick={() => setQuizStep(2)}>Next Step &rarr;</button>
                </div>
              </div>
            )}

            {/* Quiz Step 2: Role capacity */}
            {quizStep === 2 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>2. Select your core contribution quadrant:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Developer', 'Designer', 'Business'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => setQuizRole(opt)}
                      style={{
                        padding: '12px 16px',
                        border: quizRole === opt ? '2px solid var(--accent)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        background: quizRole === opt ? 'rgba(13, 148, 136, 0.03)' : 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button className="btn btn-secondary" onClick={() => setQuizStep(1)}>&larr; Back</button>
                  <button className="btn btn-primary" onClick={() => setQuizStep(3)}>Next Step &rarr;</button>
                </div>
              </div>
            )}

            {/* Quiz Step 3: Commitment */}
            {quizStep === 3 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>3. How much time can you commit weekly?</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Casual (5 hours)', 'Moderate (10 hours)', 'Hardcore (20+ hours)'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => setQuizHours(opt)}
                      style={{
                        padding: '12px 16px',
                        border: quizHours === opt ? '2px solid var(--accent)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        background: quizHours === opt ? 'rgba(13, 148, 136, 0.03)' : 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button className="btn btn-secondary" onClick={() => setQuizStep(2)}>&larr; Back</button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleQuizSubmit}
                    style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
                  >
                    Calculate Match ⚡
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Step 4: Results */}
            {quizStep === 4 && quizResult && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>AI Recommended Best Match</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Based on your compatibility indicators.</p>

                <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{quizResult.project.category}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem' }}>{quizResult.score}% AI Overlap</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>{quizResult.project.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
                    {quizResult.project.desc.substring(0, 140)}...
                  </p>
                  <div style={{ background: 'white', border: '1px solid var(--accent-light)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.75rem', color: 'var(--accent)', lineHeight: 1.4, fontWeight: 500 }}>
                    💡 {quizResult.justification}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsQuizOpen(false)}>Close Wizard</button>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1.3, background: 'var(--accent)', color: 'white', border: 'none' }}
                    onClick={() => {
                      setIsQuizOpen(false);
                      setActiveProjectId(quizResult.project.id);
                      navigateTo('projects');
                    }}
                  >
                    View Project Details
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default HomeDashboard;
