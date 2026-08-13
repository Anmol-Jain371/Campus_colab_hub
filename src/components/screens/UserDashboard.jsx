import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, FolderCheck, Users, Eye, Award, BadgeCheck } from 'lucide-react';

const UserDashboard = ({ onOpenCreateProject, onOpenEditProfile }) => {
  const { 
    currentUser, 
    projects, 
    logoutUser, 
    timelineEvents, 
    setActiveProjectId, 
    navigateTo 
  } = useApp();

  if (!currentUser) return null;

  if (currentUser.userType === 'faculty') {
    const myResearchProjects = projects.filter(p => p.ownerId === currentUser.id);
    const myMentoredProjects = projects.filter(p => p.mentor === currentUser.name);

    return (
      <section id="screen-user-dashboard" className="screen active">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Faculty Mentorship Hub</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage sponsored research opportunities, list student roles, and coordinate mentorships.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={onOpenEditProfile}>
              Edit Profile
            </button>
            <button className="btn btn-outline btn-sm" onClick={logoutUser}>
              <LogOut size={16} style={{ marginRight: '6px' }} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div className="card metric-card">
            <div className="metric-icon blue">
              <FolderCheck size={24} />
            </div>
            <div className="metric-details">
              <span className="metric-val">{myResearchProjects.length}</span>
              <span className="metric-lbl">Sponsored Projects</span>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon teal">
              <Users size={24} />
            </div>
            <div className="metric-details">
              <span className="metric-val">{myMentoredProjects.length}</span>
              <span className="metric-lbl">Mentored Projects</span>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon gold">
              <Eye size={24} />
            </div>
            <div className="metric-details">
              <span className="metric-val">{currentUser.trustScore - 20 || 80}</span>
              <span className="metric-lbl">Profile Views</span>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon green">
              <Award size={24} />
            </div>
            <div className="metric-details">
              <span className="metric-val">{currentUser.endorsements || 45}</span>
              <span className="metric-lbl">Nominations</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid-sidebar">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Sponsored projects list */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>My Sponsored Research Projects</span>
                <button className="btn btn-primary btn-sm" onClick={onOpenCreateProject}>Propose Project</button>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myResearchProjects.length > 0 ? (
                  myResearchProjects.map(p => (
                    <div key={p.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{p.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Needs: {p.skillsNeeded.join(', ')} • Recruited: {p.members.length}/{p.teamSize} Slots
                        </p>
                      </div>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => {
                          setActiveProjectId(p.id);
                          navigateTo('projects');
                        }}
                      >
                        Details
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No research projects listed yet.</p>
                )}
              </div>
            </div>

            {/* Mentored student projects list */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Teammate Workgroups Under My Mentorship</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myMentoredProjects.length > 0 ? (
                  myMentoredProjects.map(p => (
                    <div key={p.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{p.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Owner: Student ID {p.ownerId} • Team Size: {p.members.length} Members
                        </p>
                      </div>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => {
                          setActiveProjectId(p.id);
                          navigateTo('projects');
                        }}
                      >
                        Verify Team
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No active student groups have requested mentorship yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Timeline Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Mentorship Activity Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', borderLeft: '3px solid var(--accent)' }}>
                  <strong>Activity:</strong> Assigned Dr. Amit Sen as Faculty Mentor on "Smart Campus IoT Grid".
                </div>
                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', borderLeft: '3px solid var(--accent)' }}>
                  <strong>Activity:</strong> Listed research proposal for "AI Pedestrian Navigation Aid".
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>
    );
  }

  // Owned and joined projects
  const myOwnedProjects = projects.filter(p => p.ownerId === currentUser.id);
  const myJoinedProjects = projects.filter(p => p.members.some(m => m.studentId === currentUser.id) && p.ownerId !== currentUser.id);

  return (
    <section id="screen-user-dashboard" className="screen active">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">My Hub Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage your active collaborations, profile views, and skill endorsements.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenEditProfile}>
            Edit Profile
          </button>
          <button className="btn btn-outline btn-sm" onClick={logoutUser}>
            <LogOut size={16} style={{ marginRight: '6px' }} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card metric-card">
          <div className="metric-icon blue">
            <FolderCheck size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{myOwnedProjects.length}</span>
            <span className="metric-lbl">Created Projects</span>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon teal">
            <Users size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{currentUser.connections}</span>
            <span className="metric-lbl">Active Connections</span>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon gold">
            <Eye size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{currentUser.trustScore - 71 || 24}</span>
            <span className="metric-lbl">Portfolio Views</span>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon green">
            <Award size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{currentUser.endorsements || 12}</span>
            <span className="metric-lbl">Skill Endorsements</span>
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid-sidebar">
        
        {/* Projects Owned & Joined */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Projects Created by Me</span>
              <button className="btn btn-primary btn-sm" onClick={onOpenCreateProject}>Create Project</button>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myOwnedProjects.length > 0 ? (
                myOwnedProjects.map(p => (
                  <div key={p.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{p.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Recruiting: {p.members.length}/{p.teamSize} Teammates
                      </p>
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => {
                        setActiveProjectId(p.id);
                        navigateTo('projects');
                      }}
                    >
                      Dashboard
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }}>
                  You have not published any projects.
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Projects I Joined</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myJoinedProjects.length > 0 ? (
                myJoinedProjects.map(p => (
                  <div key={p.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{p.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Category: {p.category}</p>
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => {
                        setActiveProjectId(p.id);
                        navigateTo('projects');
                      }}
                    >
                      Workspace
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }}>
                  You have not joined any project teams yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Activity Timeline & Skill Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Overview Quick Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <img 
              id="my-profile-pfp" 
              src={currentUser.avatar} 
              alt="My PFP" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)', margin: '0 auto 12px auto', display: 'block' }} 
            />
            <h3>{currentUser.name}</h3>
            <p id="my-profile-dept-year" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {currentUser.dept} • {currentUser.year}
            </p>
            <div className="verified-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
              <BadgeCheck size={12} /> Verified Student
            </div>
          </div>

          {/* Activity Log */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>My Campus Timeline</h3>
            <div className="timeline">
              {timelineEvents.map((ev, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-time">{ev.time}</div>
                  <div className="timeline-title">{ev.title}</div>
                  <div className="timeline-desc">{ev.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default UserDashboard;
