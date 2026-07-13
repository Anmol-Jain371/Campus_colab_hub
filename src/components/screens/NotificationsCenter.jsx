import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, Sparkles } from 'lucide-react';

const NotificationsCenter = () => {
  const { notifications, markAllNotificationsRead, acceptInvitation, declineInvitation, currentUser } = useApp();

  if (!currentUser) return null;

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
            const isInvitation = n.type === 'invitation';
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
                    <div className="noti-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => acceptInvitation(n.id)}>
                        Accept Invitation
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => declineInvitation(n.id)}>
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
    </section>
  );
};

export default NotificationsCenter;
