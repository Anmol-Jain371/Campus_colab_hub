import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Users, FolderGit, Calendar, MessageSquare, Bell, User } from 'lucide-react';

const Sidebar = () => {
  const { activeScreen, navigateTo, currentUser, messages, notifications } = useApp();

  if (!currentUser) return null;

  const unreadMessagesCount = messages.reduce((acc, chat) => acc + (chat.history.length > 0 ? 1 : 0), 0);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, badge: 0 },
    { id: 'discover', label: 'Discover Students', icon: Users, badge: 0 },
    { id: 'projects', label: 'Project Board', icon: FolderGit, badge: 0 },
    { id: 'events', label: 'Events', icon: Calendar, badge: 0 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount }
  ];

  return (
    <aside className="sidebar">
      <div className="brand-header" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo">C</div>
        <span className="brand-name">CampusConnect</span>
      </div>

      <nav className="nav-menu">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <a 
              key={item.id} 
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => navigateTo(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="sidebar-user" onClick={() => navigateTo('user-dashboard')}>
        <div className="user-avatar-container">
          <img 
            src={currentUser.avatar} 
            alt="My Profile Avatar" 
            className="avatar" 
          />
          <div className="status-indicator online"></div>
        </div>
        <div className="user-info">
          <span className="name">{currentUser.name}</span>
          <span className="subtitle">{currentUser.dept}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
