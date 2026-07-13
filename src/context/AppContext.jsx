import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const API_URL = 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
  // Navigation State
  const [activeScreen, setActiveScreenState] = useState('splash');
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
    const intersection = requiredSkills.filter(s => studentSkills.includes(s));
    const score = Math.round((intersection.length / requiredSkills.length) * 100);
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
  const loginDemoUser = async () => {
    try {
      const res = await fetch(`${API_URL}/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 's2' }) // Log in as Riya Sen demo student
      });
      if (res.ok) {
        const demoUser = await res.json();
        setCurrentUser(demoUser);
        showToast(`Logged in as Demo Student ${demoUser.name}!`, 'success');
        navigateTo('home');
      } else {
        showToast("Error retrieving demo student profile.", "error");
      }
    } catch (e) {
      showToast("API server offline.", "error");
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    navigateTo('splash');
    showToast('Logged out of Workspace.', 'info');
  };

  const sendMockOTP = (email) => {
    showToast(`Demo OTP Code "123456" sent to ${email}`, 'info');
  };

  const completeSignup = async (name, dept, year, bio, skills, avatar) => {
    const id = 'custom_user_' + Date.now();
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, dept, year, bio, skills, avatar })
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        await loadDatabaseState();
        showToast('Student Profile Created!', 'success');
        navigateTo('home');
      } else {
        showToast("Error creating database user.", "error");
      }
    } catch (e) {
      showToast("API server offline.", "error");
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

  const joinProjectRequest = (projectId, ownerId, role, intro, timeline, availability) => {
    if (!currentUser) return;
    const recipient = students.find(s => s.id === ownerId);
    showToast(`Collab request sent to ${recipient ? recipient.name : 'Project Owner'}!`, 'success');
    addTimelineEvent(
      'Sent request',
      `You invited ${recipient ? recipient.name : 'Owner'} to join as "${role}"`,
      'Just now'
    );
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

        // Refetch chat after 1.8s to fetch the simulated live backend reply
        setTimeout(async () => {
          await loadDatabaseState();
        }, 1800);
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
      
      setActiveProjectId,
      setActiveStudentId,
      setActiveEventTab,
      showToast,
      calculateAIMatchScore,
      
      navigateTo,
      navigateBack,
      loginDemoUser,
      logoutUser,
      sendMockOTP,
      completeSignup,
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
