import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, Sparkles, X, ShieldCheck, Github, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import SkillRadarChart from '../visual/SkillRadarChart';
import Magnet from '../visual/Magnet';

const NotificationsCenter = () => {
  const { notifications, markAllNotificationsRead, acceptInvitation, declineInvitation, currentUser, students, projects } = useApp();
  const [reviewingNoti, setReviewingNoti] = useState(null);

  if (!currentUser) return null;

  // Handle open verification modal
  const handleOpenReview = (noti) => {
    // If it's a seeded n2 notification, populate matching context fields
    const notiData = {
      ...noti,
      projectId: noti.projectId || 'p1',
      studentId: noti.studentId || 's2',
      role: noti.role || 'UI/UX Consultant'
    };
    setReviewingNoti(notiData);
  };

  const handleCloseReview = () => {
    setReviewingNoti(null);
  };

  // Compile mock data for GitHub commits grid (42 days)
  const commitGrid = [
    2, 0, 5, 8, 3, 0, 0,
    1, 4, 0, 2, 7, 0, 1,
    0, 0, 9, 3, 0, 4, 2,
    3, 6, 1, 0, 0, 8, 0,
    0, 2, 4, 3, 9, 0, 0,
    1, 0, 5, 7, 2, 4, 0
  ];

  const getGitColor = (commits) => {
    if (commits === 0) return '#e2e8f0'; // No commits
    if (commits < 3) return '#a7f3d0'; // Light green
    if (commits < 6) return '#34d399'; // Mid green
    return '#047857'; // Dark green
  };

  // Get matching details
  const applicant = reviewingNoti ? students.find(s => s.id === reviewingNoti.studentId) : null;
  const project = reviewingNoti ? projects.find(p => p.id === reviewingNoti.projectId) : null;

  return (
    <section id="screen-notifications" className="screen active">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Track collaboration requests, invitations, and system updates.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={markAllNotificationsRead}>
          Mark all as read
        </button>
      </div>

      <div style={{ maxWidth: '800px', marginTop: '16px' }} id="notifications-list-container">
        {notifications.length > 0 ? (
          notifications.map(n => {
            const isInvitation = n.type === 'invitation' || n.type === 'request';
            return (
              <div key={n.id} className={`notification-item ${n.read ? '' : 'unread'}`}>
                <div className="noti-icon">
                  {isInvitation ? <UserPlus size={20} /> : <Sparkles size={20} />}
                </div>
                <div className="noti-body">
                  <h3 className="noti-title">{n.title}</h3>
                  <p className="noti-desc">{n.desc}</p>
                  <span className="noti-time">{n.time}</span>
                  {isInvitation && (
                    <div className="noti-actions" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => acceptInvitation(n.id)}>
                        Accept Invitation
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenReview(n)}>
                        Verify Profile & AI Score
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => declineInvitation(n.id)}>
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No notifications yet.
          </div>
        )}
      </div>

      {/* Dynamic Verification & AI Analysis Modal */}
      {reviewingNoti && applicant && project && (
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
          zIndex: 9995,
          padding: '20px',
          overflowY: 'auto'
        }}>
          
          <div style={{
            maxWidth: '850px',
            width: '100%',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)',
            padding: '36px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            
            {/* Close button */}
            <button 
              onClick={handleCloseReview}
              style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
              Verification Audit & AI Match Analyzer
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Review the applicant's commits, portfolio trust indicators, and skill overlap.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
              
              {/* Left Column: Profile, Git Grid & Gap Filler */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Applicant Bio Block */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <img 
                    src={applicant.avatar} 
                    alt={applicant.name} 
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{applicant.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, margin: '2px 0 6px 0' }}>{applicant.dept} • {applicant.year}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{applicant.bio || 'No bio provided.'}</p>
                  </div>
                </div>

                {/* Git Contribution Grid */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Github size={15} /> GitHub Contribution Matrix (Commit History)
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    142 commits in the last 6 months. Manual analysis shows active code production.
                  </p>
                  <div style={{ display: 'grid', gridTemplateGrid: 'repeat(6, 1fr)', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', maxWidth: '140px', background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    {commitGrid.map((val, idx) => (
                      <div 
                        key={idx} 
                        style={{ width: '12px', height: '12px', borderRadius: '2px', background: getGitColor(val) }} 
                        title={`${val} commits`}
                      />
                    ))}
                  </div>
                </div>

                {/* Gap Filler Overlap */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <CheckCircle size={15} color="var(--accent)" /> The Gap Filler Matcher
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {project.skillsNeeded.map(skill => {
                      const lowerSkill = skill.toLowerCase();
                      const hasSkill = applicant.skills.some(s => s.toLowerCase().includes(lowerSkill) || lowerSkill.includes(s.toLowerCase()));
                      return (
                        <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{skill}</span>
                          {hasSkill ? (
                            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              Matched Slot ✓
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              Slot Unfilled
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Radar Chart, Trust Meter & AI Suggestion */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                
                {/* Visual DNA Radar Skill Web */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '10px' }}>
                    Visual DNA Skill Radar Chart
                  </h4>
                  <SkillRadarChart projectSkills={project.skillsNeeded} studentSkills={applicant.skills} />
                </div>

                {/* Trust Score progress meter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
                      <ShieldCheck size={14} color="var(--accent)" /> Platform Trust Score
                    </span>
                    <span style={{ color: 'var(--accent)' }}>98%</span>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '98%', height: '100%', background: 'var(--accent)', borderRadius: '4px' }} />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Verified student email, OTP authenticated, and positive rating from 3 completed hackathons.
                  </p>
                </div>

                {/* AI Matching Assistant */}
                <div style={{ background: 'white', border: '1px solid var(--accent-light)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Cpu size={16} color="var(--accent)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Match Rating</span>
                  </div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Strong Match Recommendation</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Applicant has high compatibility web shapes. They cover vital project slots and maintain high team scores. Connection is highly recommended.
                  </p>
                </div>

              </div>

            </div>

            {/* Footer CTAs */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <button className="btn btn-secondary" onClick={handleCloseReview}>
                Close Audit
              </button>
              <Magnet>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    acceptInvitation(reviewingNoti.id);
                    handleCloseReview();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent)', color: 'white', border: 'none' }}
                >
                  Accept Candidate
                </button>
              </Magnet>
            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default NotificationsCenter;
