import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialStudents, 
  initialProjects, 
  initialEvents, 
  initialNotifications, 
  initialMessages, 
  getLocalStorageData, 
  setLocalStorageData 
} from '../data/mockData';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Navigation State
  const [activeScreen, setActiveScreenState] = useState('splash');
  const [historyStack, setHistoryStack] = useState([]);
  
  // Database States loaded from LocalStorage or Fallbacks
  const [currentUser, setCurrentUser] = useState(() => getLocalStorageData('currentUser', null));
  const [students, setStudents] = useState(() => getLocalStorageData('students', initialStudents));
  const [projects, setProjects] = useState(() => getLocalStorageData('projects', initialProjects));
  const [events, setEvents] = useState(() => getLocalStorageData('events', initialEvents));
  const [notifications, setNotifications] = useState(() => getLocalStorageData('notifications', initialNotifications));
  const [messages, setMessages] = useState(() => getLocalStorageData('messages', initialMessages));
  
  // Active states
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [activeEventTab, setActiveEventTab] = useState('All');
  const [timelineEvents, setTimelineEvents] = useState(() => getLocalStorageData('timelineEvents', [
    { title: 'Profile Created', desc: 'Verified student status and published digital portfolio.', time: '1 hour ago' }
  ]));

  // Sync to LocalStorage whenever states change
  useEffect(() => {
    setLocalStorageData('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setLocalStorageData('students', students);
  }, [students]);

  useEffect(() => {
    setLocalStorageData('projects', projects);
  }, [projects]);

  useEffect(() => {
    setLocalStorageData('events', events);
  }, [events]);

  useEffect(() => {
    setLocalStorageData('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    setLocalStorageData('messages', messages);
  }, [messages]);

  useEffect(() => {
    setLocalStorageData('timelineEvents', timelineEvents);
  }, [timelineEvents]);

  // Toast notifications helpers
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3400);
  };

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
  const loginDemoUser = () => {
    const demo = {
      id: 'demo_user',
      name: 'Rohan Sen',
      dept: 'Design & Fine Arts',
      year: '3rd Year',
      skills: ['UI/UX', 'Figma', 'React', 'Flutter'],
      bio: 'Interface designer focused on interactive products. Building Campus Hub interfaces with React! Looking to connect with backend and marketing students.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      availability: 'Open for projects',
      interest: 'Hackathons, Startups',
      trustScore: 95,
      endorsements: 12,
      connections: 6,
      verified: true
    };
    setCurrentUser(demo);
    // Add to students list if not present
    setStudents(prev => {
      if (prev.some(s => s.id === demo.id)) return prev;
      return [...prev, demo];
    });
    showToast('Logged in as Demo Student Rohan Sen!', 'success');
    navigateTo('home');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    navigateTo('splash');
    showToast('Logged out of Workspace.', 'info');
  };

  const sendMockOTP = (email) => {
    showToast(`Demo OTP Code "123456" sent to ${email}`, 'info');
  };

  const completeSignup = (name, dept, year, bio, skills, avatar) => {
    const newUser = {
      id: 'custom_user_' + Date.now(),
      name,
      dept,
      year,
      skills,
      bio: bio || 'Welcome to my student profile workspace.',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      availability: 'Open for projects',
      interest: 'Hackathons, Startups',
      trustScore: 90,
      endorsements: 0,
      connections: 0,
      verified: true
    };
    setCurrentUser(newUser);
    setStudents(prev => [...prev, newUser]);
    showToast('Student Profile Created!', 'success');
    navigateTo('home');
  };

  // Projects Operations
  const addProject = (title, desc, size, deadline, mentor, category, requiredSkills) => {
    if (!currentUser) return;
    const newProject = {
      id: 'p_custom_' + Date.now(),
      title,
      desc,
      skillsNeeded: requiredSkills,
      ownerId: currentUser.id,
      mentor: mentor || 'Undecided',
      teamSize: parseInt(size),
      deadline,
      category,
      members: [
        { studentId: currentUser.id, role: 'Project Initiator / Leader' }
      ],
      comments: []
    };
    setProjects(prev => [...prev, newProject]);
    addTimelineEvent(
      'Published Project listing',
      `You listed "${title}" looking for ${requiredSkills.join(', ')} capabilities.`,
      'Just now'
    );
    showToast('Project published to Campus Board!', 'success');
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

  const addProjectComment = (projectId, text) => {
    if (!currentUser) return;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          comments: [...p.comments, { author: currentUser.name, text, time: 'Just now' }]
        };
      }
      return p;
    }));
    showToast('Comment posted successfully.', 'success');
  };

  // Event Registrations
  const toggleEventRegistration = (eventId) => {
    let title = '';
    let isReg = false;
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        title = ev.title;
        isReg = !ev.registered;
        return { ...ev, registered: isReg };
      }
      return ev;
    }));
    showToast(
      isReg ? `Successfully registered for: ${title}` : `Cancelled registration for: ${title}`,
      'success'
    );
  };

  // Chats/Messaging Operations
  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const sendChatMessage = (text) => {
    if (!currentUser || !activeChatId) return;

    setMessages(prev => prev.map(chat => {
      if (chat.chatId === activeChatId) {
        const updatedChat = {
          ...chat,
          history: [...chat.history, {
            senderId: currentUser.id,
            senderName: currentUser.name,
            text,
            time: 'Just now'
          }]
        };

        // Simulate a mock response after 1.5 seconds
        setTimeout(() => {
          setMessages(prev2 => prev2.map(c => {
            if (c.chatId === activeChatId) {
              const replyText = c.isChannel 
                ? `Great! I've updated the repository. Let's sync with our Faculty Mentor Dr. Amit later this week.` 
                : "Sounds good! Let's schedule a call tomorrow afternoon to discuss details.";
              return {
                ...c,
                history: [...c.history, {
                  senderId: 'bot_reply',
                  senderName: c.isChannel ? 'Aarav Mehta' : c.name,
                  text: replyText,
                  time: 'Just now'
                }]
              };
            }
            return c;
          }));
        }, 1500);

        return updatedChat;
      }
      return chat;
    }));
  };

  const openDirectChat = (studentId) => {
    const s = students.find(x => x.id === studentId);
    if (!s) return;

    // Check if chat already exists
    const chatExists = messages.some(m => m.chatId === s.id);
    if (!chatExists) {
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
    setMessages(prev => prev.map(c => {
      if (c.chatId === activeChatId) {
        return {
          ...c,
          history: [...c.history, {
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `📂 Shared Portfolio Asset: Interactive Case Studies Showcase`,
            time: 'Just now'
          }]
        };
      }
      return c;
    }));
    showToast('Portfolio asset shared to chat.', 'success');
  };

  const simulateFileAttachment = () => {
    if (!currentUser || !activeChatId) return;
    setMessages(prev => prev.map(c => {
      if (c.chatId === activeChatId) {
        return {
          ...c,
          history: [...c.history, {
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `📄 Project_Brief_Draft.pdf (1.2 MB)`,
            time: 'Just now'
          }]
        };
      }
      return c;
    }));
    showToast('Document attached to chat.', 'success');
  };

  // Notifications Operations
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'success');
  };

  const acceptInvitation = (notificationId) => {
    if (!currentUser) return;
    
    // Find notification
    const n = notifications.find(x => x.id === notificationId);
    if (n) {
      // Invite to Smart Campus IoT Grid (mocked project id: p1)
      setProjects(prev => prev.map(proj => {
        if (proj.id === 'p1' && !proj.members.some(m => m.studentId === currentUser.id)) {
          return {
            ...proj,
            members: [...proj.members, { studentId: currentUser.id, role: 'UI/UX Consultant' }]
          };
        }
        return proj;
      }));

      // Update current user connections
      setCurrentUser(prev => prev ? { ...prev, connections: prev.connections + 1 } : null);
      
      // Remove notification
      setNotifications(prev => prev.filter(x => x.id !== notificationId));
      
      showToast('Accepted invitation to join project!', 'success');
      addTimelineEvent(
        'Joined project team',
        `You joined the "Smart Campus IoT Grid" team as UI/UX Consultant.`,
        'Just now'
      );
    }
  };

  const rejectInvitation = (notificationId) => {
    setNotifications(prev => prev.filter(x => x.id !== notificationId));
    showToast('Invitation declined.', 'info');
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
