import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

// Screens
import Splash from './components/screens/Splash';
import Login from './components/screens/Login';
import Register from './components/screens/Register';
import HomeDashboard from './components/screens/HomeDashboard';
import DiscoverStudents from './components/screens/DiscoverStudents';
import ProjectBoard from './components/screens/ProjectBoard';
import EventsBoard from './components/screens/EventsBoard';
import MessagesWorkspace from './components/screens/MessagesWorkspace';
import NotificationsCenter from './components/screens/NotificationsCenter';
import UserDashboard from './components/screens/UserDashboard';

// Modals
import CreateProjectModal from './components/modals/CreateProjectModal';
import CollabRequestModal from './components/modals/CollabRequestModal';
import EditProfileModal from './components/modals/EditProfileModal';
import WelcomeOnboardingModal from './components/modals/WelcomeOnboardingModal';
import WorkspaceLoader from './components/visual/WorkspaceLoader';

function App() {
  const { currentUser, activeScreen, isInitializing, showOnboarding, setShowOnboarding } = useApp();
  
  // Modal states
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [collabModalData, setCollabModalData] = useState({ isOpen: false, studentId: '', projectId: '' });

  const handleOpenCollabRequest = (studentId, projectId = '') => {
    setCollabModalData({ isOpen: true, studentId, projectId });
  };

  const handleCloseCollabRequest = () => {
    setCollabModalData({ isOpen: false, studentId: '', projectId: '' });
  };

  // Auth Layout Check
  if (!currentUser) {
    return (
      <div className="auth-layout">
        {isInitializing && <WorkspaceLoader />}
        {activeScreen === 'landing' && <Splash />}
        {activeScreen === 'login' && <Login />}
        {activeScreen === 'register' && <Register />}
      </div>
    );
  }

  // Main Workspace Layout
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Dynamic Workspace Screen content */}
      <main className="main-wrapper">
        {activeScreen === 'home' && (
          <HomeDashboard 
            onOpenCreateProject={() => setIsCreateProjectOpen(true)} 
            onOpenCollabRequest={handleOpenCollabRequest}
          />
        )}
        {activeScreen === 'discover' && (
          <DiscoverStudents 
            onOpenCollabRequest={handleOpenCollabRequest}
          />
        )}
        {activeScreen === 'projects' && (
          <ProjectBoard 
            onOpenCreateProject={() => setIsCreateProjectOpen(true)} 
            onOpenCollabRequest={handleOpenCollabRequest}
          />
        )}
        {activeScreen === 'events' && <EventsBoard />}
        {activeScreen === 'messages' && <MessagesWorkspace />}
        {activeScreen === 'notifications' && <NotificationsCenter />}
        {activeScreen === 'user-dashboard' && (
          <UserDashboard 
            onOpenCreateProject={() => setIsCreateProjectOpen(true)} 
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Reusable Overlay Modals */}
      {isInitializing && <WorkspaceLoader />}
      <CreateProjectModal 
        isOpen={isCreateProjectOpen} 
        onClose={() => setIsCreateProjectOpen(false)} 
      />
      <CollabRequestModal 
        isOpen={collabModalData.isOpen} 
        onClose={handleCloseCollabRequest}
        studentId={collabModalData.studentId}
        projectId={collabModalData.projectId}
      />
      <WelcomeOnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        userName={currentUser?.name} 
      />
      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </div>
  );
}

export default App;
