import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const API_URL = 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
  // Navigation State
  const [activeScreen, setActiveScreenState] = useState(() => {
    try {
      return localStorage.getItem('campushub_currentUser') ? 'home' : 'landing';
    } catch {
      return 'landing';
    }
  });
  const [historyStack, setHistoryStack] = useState([]);
  
  // Database States loaded from API Backend
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campushub_currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Active states
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [activeEventTab, setActiveEventTab] = useState('All');
  
  const [timelineEvents, setTimelineEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('campushub_timelineEvents');
      return saved ? JSON.parse(saved) : [
        { title: 'Profile Created', desc: 'Verified student status and published digital portfolio.', time: '1 hour ago' }
      ];
    } catch {
      return [
        { title: 'Profile Created', desc: 'Verified student status and published digital portfolio.', time: '1 hour ago' }
      ];
    }
  });

  // Toast notifications helpers
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3400);
  };

  // Sync auth state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('campushub_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('campushub_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('campushub_timelineEvents', JSON.stringify(timelineEvents));
  }, [timelineEvents]);

  // Load initial backend database state
  const loadDatabaseState = async () => {
    try {
      setLoading(true);
      const [stdRes, projRes, evsRes, notsRes, msgsRes] = await Promise.all([
        fetch(`${API_URL}/students`),
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/notifications`),
        fetch(`${API_URL}/messages`)
      ]);

      const [stds, projs, evs, nots, msgs] = await Promise.all([
        stdRes.json(),
        projRes.json(),
        evsRes.json(),
        notsRes.json(),
        msgsRes.json()
      ]);

      setStudents(stds);
      setProjects(projs);
      setEvents(evs);
      setNotifications(nots);
      setMessages(msgs);
    } catch (e) {
      console.error("Failed to connect to SQLite backend:", e);
      showToast("Cannot connect to backend server. Make sure node server is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseState();
  }, []);

  // Helper match score
  const calculateAIMatchScore = (requiredSkills, studentSkills) => {
    if (!requiredSkills || !studentSkills || requiredSkills.length === 0) return 0;
    let matchedCount = 0;
    requiredSkills.forEach(req => {
      const reqLower = req.toLowerCase().trim();
      const hasMatch = studentSkills.some(stud => {
        const studLower = stud.toLowerCase().trim();
        return studLower.includes(reqLower) || reqLower.includes(studLower);
      });
      if (hasMatch) matchedCount++;
    });
    const score = Math.round((matchedCount / requiredSkills.length) * 100);
    return score === 0 ? 15 : score;
  };

  // Navigation Logic
  const navigateTo = (screenId, direction = 'forward') => {
    if (direction === 'forward' && activeScreen !== screenId) {
      setHistoryStack(prev => [...prev, activeScreen]);
    }
    setActiveScreenState(screenId);
    window.scrollTo(0, 0);
  };

  const navigateBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack(prevStack => prevStack.slice(0, -1));
      setActiveScreenState(prev);
    }
  };

  // Timeline Event Logger
  const addTimelineEvent = (title, desc, time = 'Just now') => {
    setTimelineEvents(prev => [{ title, desc, time }, ...prev]);
  };

  // Auth Operations
  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const user = await res.json();
        setIsInitializing(true);
        setCurrentUser(user);
        await loadDatabaseState();
        setTimeout(() => {
          setIsInitializing(false);
          showToast(`Welcome back, ${user.name}!`, 'success');
          navigateTo('home');
        }, 1800);
        return { success: true };
      } else {
        const data = await res.json();
        showToast(data.error || "Invalid credentials", "error");
        return { success: false, error: data.error };
      }
    } catch (e) {
      showToast("API server offline.", "error");
      return { success: false, error: "Server offline" };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    navigateTo('landing');
    showToast('Logged out of Workspace.', 'info');
  };

  const registerUser = async (name, email, password, dept, year, bio, skills, avatar, userType = 'student') => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, dept, year, bio, skills, avatar, userType })
      });
      if (res.ok) {
        const user = await res.json();
        setIsInitializing(true);
        setCurrentUser(user);
        await loadDatabaseState();
        setTimeout(() => {
          setIsInitializing(false);
          setShowOnboarding(userType !== 'faculty'); // Hide student onboarding for faculty
          showToast(`${userType === 'faculty' ? 'Faculty' : 'Student'} Profile Created Successfully!`, 'success');
          navigateTo('home');
        }, 1800);
        return { success: true };
      } else {
        const data = await res.json();
        showToast(data.error || "Registration failed", "error");
        return { success: false, error: data.error };
      }
    } catch (e) {
      showToast("API server offline.", "error");
      return { success: false, error: "Server offline" };
    }
  };

  const updateUserProfile = async (name, dept, year, bio, skills, avatar) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`${API_URL}/students/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dept, year, bio, skills, avatar })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        localStorage.setItem('campushub_currentUser', JSON.stringify(updatedUser));
        await loadDatabaseState();
        showToast('Student profile updated successfully!', 'success');
        return true;
      } else {
        showToast('Error updating profile details.', 'error');
        return false;
      }
    } catch (e) {
      showToast('API server offline.', 'error');
      return false;
    }
  };

  const endorseStudent = async (studentId) => {
    try {
      const res = await fetch(`${API_URL}/students/${studentId}/endorse`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        await loadDatabaseState();
        showToast('Student skills endorsed successfully! Trust score updated.', 'success');
        return data;
      } else {
        showToast('Error sending endorsement.', 'error');
        return null;
      }
    } catch (e) {
      showToast('API server offline.', 'error');
      return null;
    }
  };

  // Projects Operations
  const addProject = async (title, desc, size, deadline, mentor, category, requiredSkills) => {
    if (!currentUser) return;
    const id = 'p_custom_' + Date.now();
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id, title, desc, skillsNeeded: requiredSkills, ownerId: currentUser.id, mentor, teamSize: size, deadline, category
        })
      });
      if (res.ok) {
        await loadDatabaseState();
        addTimelineEvent(
          'Published Project listing',
          `You listed "${title}" looking for ${requiredSkills.join(', ')} capabilities.`,
          'Just now'
        );
        showToast('Project published to Campus Board!', 'success');
      } else {
        showToast("Error creating project listing.", "error");
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  const joinProjectRequest = async (projectId, ownerId, role, intro, timeline, availability) => {
    if (!currentUser) return;
    const recipient = students.find(s => s.id === ownerId);
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Collaboration Request',
          desc: `${currentUser.name} requested to join your project as a ${role}.`,
          type: 'invitation',
          projectId,
          studentId: currentUser.id,
          role
        })
      });
      if (res.ok) {
        await loadDatabaseState();
        showToast(`Collab request sent to ${recipient ? recipient.name : 'Project Owner'}!`, 'success');
        addTimelineEvent(
          'Sent request',
          `You requested to join as "${role}"`,
          'Just now'
        );
      } else {
        showToast("Error sending collaboration request.", "error");
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  const addProjectComment = async (projectId, text) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: currentUser.name, text })
      });
      if (res.ok) {
        await loadDatabaseState();
      } else {
        showToast("Error posting comment.", "error");
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  // Event Registrations
  const toggleEventRegistration = async (eventId) => {
    try {
      const res = await fetch(`${API_URL}/events/${eventId}/register`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await loadDatabaseState();
        showToast(
          data.registered ? `Successfully registered for event` : `Cancelled registration`,
          'success'
        );
      } else {
        showToast("Error modifying registration.", "error");
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  // Chats/Messaging Operations
  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const sendChatMessage = async (text) => {
    if (!currentUser || !activeChatId) return;

    try {
      const res = await fetch(`${API_URL}/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: activeChatId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text
        })
      });

      if (res.ok) {
        // Optimistic refresh
        await loadDatabaseState();
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  const openDirectChat = async (studentId) => {
    const s = students.find(x => x.id === studentId);
    if (!s) return;

    const chatExists = messages.some(m => m.chatId === s.id);
    if (!chatExists) {
      // Direct message will automatically seed empty chat on API request
      setMessages(prev => [...prev, {
        chatId: s.id,
        name: s.name,
        isChannel: false,
        avatar: s.avatar,
        subtitle: `${s.dept} • ${s.year}`,
        history: []
      }]);
    }
    setActiveChatId(s.id);
    navigateTo('messages');
  };

  const simulatePortfolioShare = () => {
    if (!currentUser || !activeChatId) return;
    sendChatMessage(`📂 Shared Portfolio Asset: Interactive Case Studies Showcase`);
  };

  const simulateFileAttachment = () => {
    if (!currentUser || !activeChatId) return;
    sendChatMessage(`📄 Project_Brief_Draft.pdf (1.2 MB)`);
  };

  // Notifications Operations
  const markAllNotificationsRead = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/read-all`, { method: 'POST' });
      if (res.ok) {
        await loadDatabaseState();
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  const acceptInvitation = async (notificationId) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/notifications/${notificationId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentUser.id })
      });
      if (res.ok) {
        await loadDatabaseState();
        // Update local user details connections
        setCurrentUser(prev => prev ? { ...prev, connections: prev.connections + 1 } : null);
        addTimelineEvent(
          'Joined project team',
          `You joined the "Smart Campus IoT Grid" team as UI/UX Consultant.`,
          'Just now'
        );
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  const declineInvitation = async (notificationId) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${notificationId}/decline`, { method: 'POST' });
      if (res.ok) {
        await loadDatabaseState();
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  return (
    <AppContext.Provider value={{
      activeScreen,
      currentUser,
      students,
      projects,
      events,
      notifications,
      messages,
      activeChatId,
      activeProjectId,
      activeStudentId,
      activeEventTab,
      timelineEvents,
      toasts,
      loading,
      isInitializing,
      showOnboarding,
      setShowOnboarding,
      
      setActiveProjectId,
      setActiveStudentId,
      setActiveEventTab,
      showToast,
      calculateAIMatchScore,
      
      navigateTo,
      navigateBack,
      loginUser,
      logoutUser,
      registerUser,
      updateUserProfile,
      endorseStudent,
      addProject,
      joinProjectRequest,
      addProjectComment,
      toggleEventRegistration,
      selectChat,
      sendChatMessage,
      openDirectChat,
      simulatePortfolioShare,
      simulateFileAttachment,
      markAllNotificationsRead,
      acceptInvitation,
      declineInvitation
    }}>
      {children}
      
      {/* Toast Render Panel */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
