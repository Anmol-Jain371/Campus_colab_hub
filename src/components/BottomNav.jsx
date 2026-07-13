import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Users, FolderGit, MessageSquare, Bell } from 'lucide-react';

const BottomNav = () => {
  const { activeScreen, navigateTo, currentUser } = useApp();

  if (!currentUser) return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderGit },
    { id: 'messages', label: 'Chat', icon: MessageSquare },
    { id: 'notifications', label: 'Notis', icon: Bell }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <a 
            key={item.id} 
            className={`bottom-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => navigateTo(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default BottomNav;
