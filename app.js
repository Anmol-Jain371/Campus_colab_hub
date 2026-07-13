/**
 * Campus Collaboration Hub - Core Application JS
 * Handles SPA navigation, mock database state, AI recommendations, form logic, and simulated real-time responses.
 */

class CampusHubApp {
  constructor() {
    this.historyStack = [];
    this.activeScreen = 'splash';
    
    // Core Mock Database State
    this.skillsList = [
      'Python', 'Java', 'React', 'Flutter', 'UI/UX', 'Figma', 
      'Machine Learning', 'Cybersecurity', 'Cloud', 'IoT', 
      'Game Development', 'Data Science', 'Marketing', 'Finance', 'Content Writing'
    ];

    this.students = [
      {
        id: 's1',
        name: 'Aarav Mehta',
        dept: 'Computer Science',
        year: '4th Year',
        skills: ['Python', 'Machine Learning', 'Cloud', 'Data Science'],
        bio: 'Enthusiastic machine learning developer. Passionate about building products that make a difference in healthcare. Looking to collaborate with designers for a startup venture.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        portfolio: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300'
        ],
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        availability: 'Open for projects',
        interest: 'Startup, Research',
        trustScore: 98,
        endorsements: 16,
        connections: 8,
        verified: true
      },
      {
        id: 's2',
        name: 'Riya Sen',
        dept: 'Design & Fine Arts',
        year: '3rd Year',
        skills: ['UI/UX', 'Figma', 'React', 'Content Writing'],
        bio: 'Product Designer who codes. I build design systems, wireframes, and high-fidelity mockups. Always excited about hackathons and interactive web development.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        portfolio: [
          'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=300',
          'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80&w=300'
        ],
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        availability: 'Open for projects',
        interest: 'Hackathons, Startups',
        trustScore: 96,
        endorsements: 22,
        connections: 12,
        verified: true
      },
      {
        id: 's3',
        name: 'Karan Malhotra',
        dept: 'Business School',
        year: 'Postgraduate',
        skills: ['Marketing', 'Finance', 'Content Writing'],
        bio: 'MBA Candidate focusing on entrepreneurship. Specializing in financial modeling, market entry strategies, and customer discovery. Seeking engineering partners for a SaaS idea.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        portfolio: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300'
        ],
        github: '',
        linkedin: 'https://linkedin.com',
        availability: 'Open for projects',
        interest: 'Startups, Competitions',
        trustScore: 92,
        endorsements: 9,
        connections: 5,
        verified: true
      },
      {
        id: 's4',
        name: 'Neha Roy',
        dept: 'Electrical Engineering',
        year: '4th Year',
        skills: ['IoT', 'Cloud', 'Java', 'Python'],
        bio: 'Hardware lover and firmware coder. Currently working on smart grid structures and home automation prototypes. Seeking Android/Flutter devs to build companion apps.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
        portfolio: [
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300',
          'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=300'
        ],
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        availability: 'Busy with Research',
        interest: 'Research, Hackathons',
        trustScore: 94,
        endorsements: 14,
        connections: 7,
        verified: true
      },
      {
        id: 's5',
        name: 'Rahul Gupta',
        dept: 'Computer Science',
        year: '2nd Year',
        skills: ['React', 'Flutter', 'Figma', 'UI/UX'],
        bio: 'Frontend enthusiast. I love building gorgeous user interfaces and smooth micro-interactions. Let’s make something beautiful!',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
        portfolio: [
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=300'
        ],
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        availability: 'Open for projects',
        interest: 'Hackathons',
        trustScore: 89,
        endorsements: 6,
        connections: 4,
        verified: false
      }
    ];

    this.projects = [
      {
        id: 'p1',
        title: 'Smart Campus IoT Grid',
        desc: 'Developing an energy-saving automated lighting and HVAC monitoring model for campus classrooms. Looking for IoT enthusiasts, a database designer, and a Business student to draft a commercialization model.',
        skillsNeeded: ['IoT', 'Python', 'Cloud', 'Finance'],
        ownerId: 's4',
        mentor: 'Dr. Amit Verma (ECE)',
        teamSize: 5,
        deadline: '2026-11-30',
        category: 'Research',
        members: [
          { studentId: 's4', role: 'Project Lead (Hardware Design)' },
          { studentId: 's1', role: 'Cloud Backend Integrator' }
        ],
        comments: [
          { author: 'Aarav Mehta', text: 'Just updated the Cloud interface API endpoints for the sensors.', time: '1 day ago' }
        ]
      },
      {
        id: 'p2',
        title: 'Decentralized Campus Locker Locker',
        desc: 'A hackathon project building a secure, OTP/Smart card-based locker system for campus libraries and gyms, integrated with a React dashboard app. Seeking React developer and UI designer.',
        skillsNeeded: ['React', 'Figma', 'UI/UX', 'Cybersecurity'],
        ownerId: 's1',
        mentor: 'Prof. Anita Desai (CSE)',
        teamSize: 4,
        deadline: '2026-08-15',
        category: 'Hackathon',
        members: [
          { studentId: 's1', role: 'Project Lead (Firmware & Backend)' }
        ],
        comments: []
      },
      {
        id: 'p3',
        title: 'EduMatch: Peer Learning App',
        desc: 'A startup model matching students for study sessions and interdisciplinary learning tasks. Need a Flutter app developer and a marketing wizard to create the customer launch strategy.',
        skillsNeeded: ['Flutter', 'UI/UX', 'Marketing', 'Content Writing'],
        ownerId: 's2',
        mentor: 'Dr. Ramamurthy (Business Incubator)',
        teamSize: 4,
        deadline: '2026-12-10',
        category: 'Startup',
        members: [
          { studentId: 's2', role: 'UI/UX Designer & Product Manager' },
          { studentId: 's5', role: 'Frontend Engineer' }
        ],
        comments: [
          { author: 'Rahul Gupta', text: 'Design files on Figma look amazing! Starting with the home layout components.', time: '3 hours ago' }
        ]
      }
    ];

    this.events = [
      {
        id: 'e1',
        title: 'Mega Campus Hackathon 2026',
        desc: '48-hour build-a-thon addressing civic tech, education, and campus green initiatives. Total prize pool: $5,000 + incubation offers.',
        type: 'Hackathons',
        date: 'July 15 - 17, 2026',
        month: 'Jul',
        day: '15',
        registered: false
      },
      {
        id: 'e2',
        title: 'AI in Biotech Colloquium & Pitch',
        desc: 'Faculty-led research workshop on computational models for drug discovery. Open to CSE, Chemical, and Postgraduate students.',
        type: 'Research Opportunities',
        date: 'Aug 04, 2026',
        month: 'Aug',
        day: '04',
        registered: false
      },
      {
        id: 'e3',
        title: 'Startup Venture Pitch Deck Competition',
        desc: 'Submit your interdisciplinary business concepts. Finalists pitch to local Angel investors and VC representatives.',
        type: 'Competitions',
        date: 'Sep 21, 2026',
        month: 'Sep',
        day: '21',
        registered: false
      },
      {
        id: 'e4',
        title: 'Masterclass: Figma Design Systems',
        desc: 'Learn token management, auto-layouts, and component states from industry guest speakers.',
        type: 'Workshops',
        date: 'Jul 09, 2026',
        month: 'Jul',
        day: '09',
        registered: false
      }
    ];

    this.notifications = [
      {
        id: 'n1',
        title: 'New Collaborator Suggestion',
        desc: 'Aarav Mehta matches 85% of your skill search queries.',
        time: '10 mins ago',
        type: 'suggestion',
        read: false
      },
      {
        id: 'n2',
        title: 'Project Invitation',
        desc: 'Neha Roy invited you to join "Smart Campus IoT Grid" as a UI/UX consultant.',
        time: '3 hours ago',
        type: 'invitation',
        read: false
      }
    ];

    this.messages = [
      {
        chatId: 'p1', // Project channel chat
        name: 'Smart Campus IoT Grid',
        isChannel: true,
        avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=150',
        subtitle: 'Research Channel • 3 members',
        history: [
          { senderId: 's4', senderName: 'Neha Roy', text: 'Hi team, did we finalize the sensor locations with Dr. Amit?', time: 'Yesterday' },
          { senderId: 's1', senderName: 'Aarav Mehta', text: 'Yes, we will deploy 4 nodes in Room 402 and 2 in the corridor. I have configured the cloud databases.', time: 'Yesterday' }
        ]
      },
      {
        chatId: 's2', // Direct chat
        name: 'Riya Sen',
        isChannel: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        subtitle: 'Design & Fine Arts • 3rd Year',
        history: [
          { senderId: 's2', senderName: 'Riya Sen', text: 'Hi! I noticed your profile and saw you work with React. Would you be open to collaborating on the EduMatch startup pitch?', time: '2 hours ago' }
        ]
      }
    ];

    // Current Session State
    this.currentUser = null;
    this.signupSkills = [];
    this.signupAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
    this.projectSignupSkills = [];
    
    // Initializer
    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    this.renderSkillsList();
    this.renderProjectSkillsSelector();
    this.setupEventListeners();
    lucide.createIcons();
  }

  // ==========================================
  // ROUTING & NAVIGATION
  // ==========================================
  navigateTo(screenId, direction = 'forward') {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add('active');
      
      // Update history stack
      if (direction === 'forward' && this.activeScreen !== screenId) {
        this.historyStack.push(this.activeScreen);
      }
      this.activeScreen = screenId;

      // Layout configurations based on screen
      const isAppScreen = !['splash', 'signup'].includes(screenId);
      const appWorkspace = document.getElementById('app-workspace');
      const splashScreen = document.getElementById('screen-splash');
      const signupScreen = document.getElementById('screen-signup');

      if (isAppScreen) {
        appWorkspace.style.display = 'flex';
        splashScreen.style.display = 'none';
        signupScreen.style.display = 'none';
        
        // Update Sidebar/Bottom nav active state
        this.updateNavHighlight(screenId);
        
        // Load data specific to screen
        this.loadScreenData(screenId);
      } else {
        appWorkspace.style.display = 'none';
        if (screenId === 'splash') {
          splashScreen.style.display = 'flex';
          signupScreen.style.display = 'none';
        } else if (screenId === 'signup') {
          splashScreen.style.display = 'none';
          signupScreen.style.display = 'flex';
        }
      }
      
      lucide.createIcons();
      window.scrollTo(0, 0);
    }
  }

  navigateBack() {
    if (this.historyStack.length > 0) {
      const prev = this.historyStack.pop();
      this.navigateTo(prev, 'backward');
    }
  }

  updateNavHighlight(screenId) {
    // Desktop Sidebar Links
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => {
      l.classList.remove('active');
      const text = l.querySelector('span').textContent.toLowerCase();
      
      if (
        (screenId === 'home' && text.includes('dashboard')) ||
        (screenId === 'discover' && text.includes('discover')) ||
        (screenId === 'projects' && text.includes('project')) ||
        (screenId === 'events' && text.includes('events')) ||
        (screenId === 'messages' && text.includes('messages')) ||
        (screenId === 'notifications' && text.includes('notifications'))
      ) {
        l.classList.add('active');
      }
    });

    // Mobile Bottom Nav Links
    const mLinks = document.querySelectorAll('.bottom-nav-link');
    mLinks.forEach(l => {
      l.classList.remove('active');
      const text = l.querySelector('span').textContent.toLowerCase();
      if (
        (screenId === 'home' && text === 'home') ||
        (screenId === 'discover' && text === 'discover') ||
        (screenId === 'projects' && text === 'projects') ||
        (screenId === 'messages' && text === 'chat') ||
        (screenId === 'notifications' && text === 'notis')
      ) {
        l.classList.add('active');
      }
    });
  }

  loadScreenData(screenId) {
    switch (screenId) {
      case 'home':
        this.renderDashboard();
        break;
      case 'discover':
        this.renderStudentsDiscover();
        break;
      case 'projects':
        this.renderProjectsList();
        break;
      case 'messages':
        this.renderChats();
        break;
      case 'events':
        this.renderEvents();
        break;
      case 'notifications':
        this.renderNotifications();
        break;
      case 'user-dashboard':
        this.renderUserDashboard();
        break;
    }
  }

  // ==========================================
  // SIGN UP / DEMO LOGIN FLOW
  // ==========================================
  loginDemoUser() {
    // Login as a preset standard student
    this.currentUser = {
      id: 'demo_user',
      name: 'Rohan Sen',
      dept: 'Design & Fine Arts',
      year: '3rd Year',
      skills: ['UI/UX', 'Figma', 'React', 'Flutter'],
      bio: 'Interface designer focused on interactive products. Building Campus Hub interfaces with Antigravity! Looking to connect with backend and marketing students.',
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
    this.setupAppWorkspace();
  }

  sendMockOTP() {
    const email = document.getElementById('signup-email').value;
    if (!email) {
      this.showToast('Please enter your university email.', 'info');
      return;
    }
    document.getElementById('btn-send-otp').style.display = 'none';
    document.getElementById('otp-group').style.display = 'block';
    document.getElementById('btn-verify-otp').style.display = 'block';
    this.showToast('Demo OTP Code "123456" sent to ' + email, 'info');
  }

  nextSignupStep(step) {
    if (step === 2) {
      const otp = document.getElementById('signup-otp').value;
      if (otp !== '123456') {
        this.showToast('Invalid OTP passcode. Enter "123456" for demo.', 'info');
        return;
      }
      
      document.getElementById('signup-step-1').classList.remove('active');
      document.getElementById('signup-step-2').classList.add('active');
      this.showToast('Email verified successfully!', 'success');
      
      // Auto recommend skills based on department selected later, render list
      this.renderSkillsSelector();
    }
  }

  handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.signupAvatar = url;
      document.getElementById('signup-avatar-preview').src = url;
    }
  }

  renderSkillsSelector() {
    const container = document.getElementById('skills-selector');
    container.innerHTML = '';
    
    this.skillsList.forEach(skill => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = skill;
      chip.onclick = () => {
        if (this.signupSkills.includes(skill)) {
          this.signupSkills = this.signupSkills.filter(s => s !== skill);
          chip.classList.remove('selected');
        } else {
          this.signupSkills.push(skill);
          chip.classList.add('selected');
        }
      };
      container.appendChild(chip);
    });
  }

  completeSignup() {
    const name = document.getElementById('signup-name').value;
    const dept = document.getElementById('signup-dept').value;
    const year = document.getElementById('signup-year').value;
    const bio = document.getElementById('signup-bio').value;

    if (this.signupSkills.length < 3) {
      this.showToast('Please select at least 3 skills.', 'info');
      return;
    }

    this.currentUser = {
      id: 'custom_user_' + Date.now(),
      name,
      dept,
      year,
      skills: this.signupSkills,
      bio: bio || 'Welcome to my student profile workspace.',
      avatar: this.signupAvatar,
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      availability: 'Open for projects',
      interest: 'Hackathons, Startups',
      trustScore: 90,
      endorsements: 0,
      connections: 0,
      verified: true
    };

    // Add to students database
    this.students.push(this.currentUser);
    this.showToast('Student Profile Created!', 'success');
    this.setupAppWorkspace();
  }

  setupAppWorkspace() {
    // Populate header details
    document.getElementById('sidebar-user-avatar').src = this.currentUser.avatar;
    document.getElementById('sidebar-user-name').textContent = this.currentUser.name;
    document.getElementById('sidebar-user-dept').textContent = this.currentUser.dept;
    document.getElementById('dash-user-firstname').textContent = this.currentUser.name.split(' ')[0];

    // Badge counts
    this.updateBadgeCounts();

    // Navigate to Home Dashboard
    this.navigateTo('home');
  }

  updateBadgeCounts() {
    const unreadMsgs = this.messages.reduce((acc, chat) => acc + (chat.history.length > 0 ? 1 : 0), 0); // Simulated count
    const unreadNotis = this.notifications.filter(n => !n.read).length;

    const msgBadge = document.getElementById('sidebar-msg-badge');
    if (unreadMsgs > 0) {
      msgBadge.textContent = unreadMsgs;
      msgBadge.style.display = 'block';
    } else {
      msgBadge.style.display = 'none';
    }

    const notiBadge = document.getElementById('sidebar-noti-badge');
    const dashNotiInd = document.getElementById('dash-noti-indicator');
    if (unreadNotis > 0) {
      notiBadge.textContent = unreadNotis;
      notiBadge.style.display = 'block';
      if (dashNotiInd) dashNotiInd.style.display = 'inline-block';
    } else {
      notiBadge.style.display = 'none';
      if (dashNotiInd) dashNotiInd.style.display = 'none';
    }
  }

  // ==========================================
  // SCREEN 3: DASHBOARD RENDERING
  // ==========================================
  renderDashboard() {
    // Recommended Projects
    const trendingGrid = document.getElementById('dashboard-trending-projects');
    trendingGrid.innerHTML = '';
    
    // Sort projects or display first 2
    this.projects.slice(0, 2).forEach(p => {
      const owner = this.students.find(s => s.id === p.ownerId) || this.currentUser;
      const score = this.calculateAIMatchScore(p.skillsNeeded, this.currentUser.skills);
      
      const card = document.createElement('div');
      card.className = 'card card-hover project-card';
      card.innerHTML = `
        <div class="match-score">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
          <span>${score}% Match</span>
        </div>
        <div class="project-card-header">
          <div>
            <h3 class="project-card-title">${p.title}</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Proposed by ${owner.name} (${owner.dept})</p>
          </div>
        </div>
        <p class="project-card-desc">${p.desc}</p>
        <div class="chips-container" style="margin-bottom: 16px;">
          ${p.skillsNeeded.map(s => `<span class="badge ${this.currentUser.skills.includes(s) ? 'badge-teal' : 'badge-muted'}">${s}</span>`).join('')}
        </div>
        <div class="project-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="app.viewProjectDetails('${p.id}')">View Project</button>
          <button class="btn btn-primary btn-sm" onclick="app.openCollabModal('${owner.id}', '${p.id}')">Request to Join</button>
        </div>
      `;
      trendingGrid.appendChild(card);
    });

    // Recommended Students
    const studentGrid = document.getElementById('dashboard-recommended-students');
    studentGrid.innerHTML = '';

    // Calculate match score for all students (excluding self)
    const matches = this.students
      .filter(s => s.id !== this.currentUser.id)
      .map(s => {
        const score = this.calculateAIMatchScore(s.skills, this.currentUser.skills);
        return { student: s, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    matches.forEach(item => {
      const s = item.student;
      const card = document.createElement('div');
      card.className = 'card card-hover student-card';
      card.innerHTML = `
        <div class="match-score">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
          <span>${item.score}% AI Match</span>
        </div>
        <div class="student-card-top">
          <img src="${s.avatar}" alt="${s.name}" class="student-card-avatar">
          <div class="student-card-details">
            <h3 class="student-card-name">${s.name} ${s.verified ? '<i data-lucide="check-circle" style="width: 14px; height: 14px; fill: var(--accent-light); color: var(--accent);"></i>' : ''}</h3>
            <p class="student-card-dept">${s.dept} • ${s.year}</p>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${s.bio}</p>
        <div class="chips-container" style="margin-bottom: 16px;">
          ${s.skills.slice(0, 3).map(sk => `<span class="badge badge-muted">${sk}</span>`).join('')}
          ${s.skills.length > 3 ? `<span class="badge badge-muted">+${s.skills.length - 3}</span>` : ''}
        </div>
        <div class="student-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="app.viewStudentProfile('${s.id}')">Profile</button>
          <button class="btn btn-primary btn-sm" onclick="app.openCollabModal('${s.id}')">Collaborate</button>
        </div>
      `;
      studentGrid.appendChild(card);
    });

    // Upcoming Competitions
    const upcomingGrid = document.getElementById('dashboard-upcoming-hackathons');
    upcomingGrid.innerHTML = '';

    this.events.slice(0, 2).forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card-compact';
      card.style = 'display: flex; gap: 12px; border-bottom: 1px solid var(--border); padding-bottom: 12px;';
      card.innerHTML = `
        <div class="event-date-box" style="flex-shrink:0;">
          <span class="month">${ev.month}</span>
          <span class="day">${ev.day}</span>
        </div>
        <div style="min-width:0;">
          <p style="font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ev.title}</p>
          <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3; margin-top: 2px;">${ev.desc}</p>
          <button class="btn btn-outline btn-sm" style="margin-top: 8px; padding: 4px 8px; font-size: 0.75rem;" onclick="app.toggleEventRegistration('${ev.id}')">${ev.registered ? 'Registered' : 'Express Interest'}</button>
        </div>
      `;
      upcomingGrid.appendChild(card);
    });
  }

  // ==========================================
  // SCREEN 4: STUDENT PROFILE RENDERING
  // ==========================================
  viewStudentProfile(studentId) {
    const s = this.students.find(x => x.id === studentId);
    if (!s) return;

    this.navigateTo('student-profile');

    const hero = document.getElementById('student-profile-hero');
    hero.innerHTML = `
      <div class="profile-cover"></div>
      <div class="profile-hero-content">
        <img src="${s.avatar}" alt="${s.name}" class="profile-pfp">
        <div class="profile-meta-main">
          <div class="profile-name-row">
            <h1 style="font-size: 1.6rem; font-weight: 700;">${s.name}</h1>
            ${s.verified ? '<div class="verified-badge"><i data-lucide="shield-check" style="width: 14px; height: 14px;"></i> Verified Student</div>' : ''}
          </div>
          <div class="profile-dept-year">
            <span>${s.dept}</span>
            <span>•</span>
            <span>${s.year}</span>
          </div>
          <div class="profile-contact-links">
            <a href="${s.github}" target="_blank" class="contact-icon-btn"><i data-lucide="github"></i></a>
            <a href="${s.linkedin}" target="_blank" class="contact-icon-btn"><i data-lucide="linkedin"></i></a>
            <a onclick="app.openDirectChat('${s.id}')" class="contact-icon-btn" title="Message Student"><i data-lucide="message-square"></i></a>
          </div>
        </div>
        
        <div class="trust-score-container">
          <div class="circular-progress" style="--progress: ${s.trustScore};">
            <span class="progress-value">${s.trustScore}%</span>
          </div>
          <span class="trust-lbl">AI Trust Score</span>
        </div>
        
        <div style="align-self: center;">
          <button class="btn btn-primary" onclick="app.openCollabModal('${s.id}')">
            <i data-lucide="user-plus"></i> Send Collab Request
          </button>
        </div>
      </div>
    `;

    document.getElementById('student-profile-bio').textContent = s.bio;

    // Portfolio
    const portContainer = document.getElementById('student-profile-portfolio');
    portContainer.innerHTML = '';
    if (s.portfolio && s.portfolio.length > 0) {
      s.portfolio.forEach((img, idx) => {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        item.innerHTML = `
          <img src="${img}" alt="Project screenshot">
          <div class="portfolio-item-overlay">
            <span>View Asset #${idx+1}</span>
          </div>
        `;
        item.onclick = () => this.showToast('Opening high-res portfolio asset...', 'info');
        portContainer.appendChild(item);
      });
    } else {
      portContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No assets uploaded.</p>';
    }

    // Past Projects
    const pastContainer = document.getElementById('student-profile-past-projects');
    pastContainer.innerHTML = '';
    const studentProjects = this.projects.filter(p => p.members.some(m => m.studentId === s.id));
    
    if (studentProjects.length > 0) {
      studentProjects.forEach(p => {
        const item = document.createElement('div');
        item.style = 'border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;';
        item.innerHTML = `
          <h4 style="font-size: 0.95rem; font-weight: 600;">${p.title}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">${p.desc.substring(0, 100)}...</p>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <span class="badge badge-teal">${p.category}</span>
          </div>
        `;
        pastContainer.appendChild(item);
      });
    } else {
      pastContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No active projects recorded on hub yet.</p>';
    }

    // Skills
    const skillsContainer = document.getElementById('student-profile-skills');
    skillsContainer.innerHTML = '';
    s.skills.forEach(sk => {
      const chip = document.createElement('div');
      chip.className = 'chip selected';
      chip.textContent = sk;
      skillsContainer.appendChild(chip);
    });

    document.getElementById('student-profile-avail').className = s.availability.includes('Open') ? 'badge badge-success' : 'badge badge-warning';
    document.getElementById('student-profile-avail').textContent = s.availability;
    document.getElementById('student-profile-interest').textContent = s.interest;
    document.getElementById('student-profile-endorse').textContent = `${s.endorsements} Peer Endorsements`;

    lucide.createIcons();
  }

  // ==========================================
  // SCREEN 5: STUDENT DISCOVER & FILTERING
  // ==========================================
  renderStudentsDiscover() {
    const listContainer = document.getElementById('discover-student-list');
    listContainer.innerHTML = '';

    const query = document.getElementById('discover-search-input').value.toLowerCase();
    const deptFilter = document.getElementById('discover-filter-dept').value;
    const yearFilter = document.getElementById('discover-filter-year').value;

    const filtered = this.students.filter(s => {
      if (s.id === this.currentUser.id) return false; // Hide self

      const matchesSearch = s.name.toLowerCase().includes(query) || 
                            s.skills.some(sk => sk.toLowerCase().includes(query)) ||
                            s.bio.toLowerCase().includes(query);
      
      const matchesDept = deptFilter === 'All' || s.dept === deptFilter;
      const matchesYear = yearFilter === 'All' || s.year === yearFilter;

      return matchesSearch && matchesDept && matchesYear;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="grid-column: span 3; text-align: center; padding: 48px; color: var(--text-secondary);">
          <i data-lucide="search" style="width: 48px; height: 48px; margin: 0 auto 16px auto; color: var(--text-muted);"></i>
          <h3>No students found match the filter options.</h3>
          <p style="margin-top: 8px;">Try modifying your keyword search or adjusting the filters.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    filtered.forEach(s => {
      const matchScore = this.calculateAIMatchScore(s.skills, this.currentUser.skills);
      const card = document.createElement('div');
      card.className = 'card card-hover student-card';
      card.innerHTML = `
        <div class="match-score">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
          <span>${matchScore}% Match</span>
        </div>
        <div class="student-card-top">
          <img src="${s.avatar}" alt="${s.name}" class="student-card-avatar">
          <div class="student-card-details">
            <h3 class="student-card-name">${s.name} ${s.verified ? '<i data-lucide="check-circle" style="width: 14px; height: 14px; fill: var(--accent-light); color: var(--accent);"></i>' : ''}</h3>
            <p class="student-card-dept">${s.dept} • ${s.year}</p>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${s.bio}</p>
        <div class="chips-container" style="margin-bottom: 16px;">
          ${s.skills.map(sk => `<span class="badge badge-muted">${sk}</span>`).join('')}
        </div>
        <div class="student-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="app.viewStudentProfile('${s.id}')">View Profile</button>
          <button class="btn btn-primary btn-sm" onclick="app.openCollabModal('${s.id}')">Collaborate</button>
        </div>
      `;
      listContainer.appendChild(card);
    });

    lucide.createIcons();
  }

  filterStudents() {
    this.renderStudentsDiscover();
  }

  // ==========================================
  // SCREEN 6 & 7: PROJECTS & DETAILS
  // ==========================================
  renderProjectsList() {
    const container = document.getElementById('projects-list-grid');
    container.innerHTML = '';

    const query = document.getElementById('projects-search-input').value.toLowerCase();
    const skillFilter = document.getElementById('projects-filter-skill').value;

    const filtered = this.projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(query) || 
                            p.desc.toLowerCase().includes(query) ||
                            p.skillsNeeded.some(sk => sk.toLowerCase().includes(query));
      
      const matchesSkill = skillFilter === 'All' || p.skillsNeeded.includes(skillFilter);

      return matchesSearch && matchesSkill;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: span 3; text-align: center; padding: 48px; color: var(--text-secondary);">
          <i data-lucide="folder" style="width: 48px; height: 48px; margin: 0 auto 16px auto; color: var(--text-muted);"></i>
          <h3>No projects found.</h3>
          <p style="margin-top: 8px;">Be the first to list a project on the board!</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    filtered.forEach(p => {
      const owner = this.students.find(s => s.id === p.ownerId) || this.currentUser;
      const score = this.calculateAIMatchScore(p.skillsNeeded, this.currentUser.skills);
      
      const card = document.createElement('div');
      card.className = 'card card-hover project-card';
      card.innerHTML = `
        <div class="match-score">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
          <span>${score}% Match</span>
        </div>
        <div class="project-card-header">
          <div>
            <h3 class="project-card-title">${p.title}</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Proposed by ${owner.name}</p>
          </div>
        </div>
        <p class="project-card-desc">${p.desc}</p>
        
        <div class="chips-container" style="margin-bottom: 20px;">
          ${p.skillsNeeded.map(s => `<span class="badge ${this.currentUser.skills.includes(s) ? 'badge-teal' : 'badge-muted'}">${s}</span>`).join('')}
        </div>

        <div class="project-card-meta">
          <div class="meta-item"><i data-lucide="users"></i> Team: ${p.members.length}/${p.teamSize}</div>
          <div class="meta-item"><i data-lucide="calendar"></i> ${p.category}</div>
        </div>
        <div class="project-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="app.viewProjectDetails('${p.id}')">View</button>
          <button class="btn btn-primary btn-sm" onclick="app.openCollabModal('${owner.id}', '${p.id}')">Request to Join</button>
        </div>
      `;
      container.appendChild(card);
    });

    lucide.createIcons();
  }

  filterProjects() {
    this.renderProjectsList();
  }

  viewProjectDetails(projectId) {
    const p = this.projects.find(x => x.id === projectId);
    if (!p) return;

    this.navigateTo('project-details');
    
    document.getElementById('proj-details-title').textContent = p.title;
    document.getElementById('proj-details-desc').textContent = p.desc;
    document.getElementById('proj-details-deadline').textContent = p.deadline;
    document.getElementById('proj-details-size').textContent = `${p.members.length}/${p.teamSize} Students`;
    document.getElementById('proj-details-mentor').textContent = p.mentor || 'None Assigned';

    const owner = this.students.find(s => s.id === p.ownerId) || this.currentUser;
    document.getElementById('proj-details-owner').textContent = owner.name;

    // Skills
    const skillsContainer = document.getElementById('proj-details-skills-needed');
    skillsContainer.innerHTML = '';
    p.skillsNeeded.forEach(s => {
      const tag = document.createElement('span');
      tag.className = 'badge badge-teal';
      tag.textContent = s;
      skillsContainer.appendChild(tag);
    });

    // Team members list
    const teamContainer = document.getElementById('proj-details-team-list');
    teamContainer.innerHTML = '';
    p.members.forEach(member => {
      const s = this.students.find(x => x.id === member.studentId) || this.currentUser;
      const item = document.createElement('div');
      item.className = 'member-item';
      item.innerHTML = `
        <img src="${s.avatar}" alt="${s.name}" class="avatar" style="width: 32px; height: 32px;">
        <div>
          <h4 style="font-size: 0.85rem; font-weight:600;">${s.name}</h4>
          <p style="font-size: 0.7rem; color: var(--text-muted);">${s.dept}</p>
        </div>
        <span class="member-role">${member.role}</span>
      `;
      teamContainer.appendChild(item);
    });

    // Join button configuration
    const joinBtn = document.getElementById('btn-request-to-join');
    const isMember = p.members.some(m => m.studentId === this.currentUser.id);
    
    if (isMember) {
      joinBtn.textContent = 'Already in Project Team';
      joinBtn.className = 'btn btn-secondary';
      joinBtn.disabled = true;
      joinBtn.onclick = null;
    } else {
      joinBtn.textContent = 'Request to Join Team';
      joinBtn.className = 'btn btn-primary';
      joinBtn.disabled = false;
      joinBtn.onclick = () => this.openCollabModal(p.ownerId, p.id);
    }

    // Comment board rendering
    this.renderProjectComments(p);
    
    // Cache active project details ID for comment submission
    this.activeProjectId = projectId;
    lucide.createIcons();
  }

  renderProjectComments(project) {
    const threads = document.getElementById('project-discussion-threads');
    threads.innerHTML = '';

    if (project.comments.length === 0) {
      threads.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 12px 0;">No comments yet. Start the conversation!</p>';
      return;
    }

    project.comments.forEach(c => {
      const author = this.students.find(s => s.name === c.author) || this.currentUser;
      const thread = document.createElement('div');
      thread.className = 'thread-item';
      thread.innerHTML = `
        <img src="${author.avatar}" alt="${c.author}" class="avatar" style="width: 32px; height: 32px;">
        <div class="thread-body">
          <div class="thread-header">
            <span class="thread-author">${c.author}</span>
            <span class="thread-time">${c.time}</span>
          </div>
          <p class="thread-text">${c.text}</p>
        </div>
      `;
      threads.appendChild(thread);
    });
  }

  postProjectComment() {
    const input = document.getElementById('project-comment-input');
    const text = input.value.trim();
    if (!text) return;

    const p = this.projects.find(x => x.id === this.activeProjectId);
    if (p) {
      p.comments.push({
        author: this.currentUser.name,
        text,
        time: 'Just now'
      });
      input.value = '';
      this.renderProjectComments(p);
      this.showToast('Comment posted successfully.', 'success');
    }
  }

  shareProjectDetails() {
    this.showToast('Project link copied to clipboard (Simulated).', 'success');
  }

  // ==========================================
  // SCREEN 8: COLLABORATION REQUESTS
  // ==========================================
  openCollabModal(studentId, projectId = '') {
    const s = this.students.find(x => x.id === studentId);
    if (!s) return;

    document.getElementById('collab-student-id').value = studentId;
    document.getElementById('collab-student-avatar').src = s.avatar;
    document.getElementById('collab-student-name').textContent = s.name;
    document.getElementById('collab-student-dept').textContent = `${s.dept} • ${s.year}`;

    // Load user's projects to select which project they want to invite/collab for
    const projSelect = document.getElementById('collab-project-select');
    projSelect.innerHTML = '';

    const myProjects = this.projects.filter(p => p.ownerId === this.currentUser.id);
    
    // Add default options
    const option = document.createElement('option');
    option.value = 'none';
    option.textContent = 'General Connection Request (No project)';
    projSelect.appendChild(option);

    myProjects.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.title;
      if (p.id === projectId) opt.selected = true;
      projSelect.appendChild(opt);
    });

    // Populate placeholder intro
    document.getElementById('collab-intro').value = `Hi ${s.name.split(' ')[0]}, I saw your profile and skills in ${s.skills.slice(0, 2).join(', ')}. I think you would be a great fit for collaboration!`;

    document.getElementById('modal-collab-request').classList.add('active');
  }

  closeCollabModal() {
    document.getElementById('modal-collab-request').classList.remove('active');
  }

  submitCollabRequest() {
    const studentId = document.getElementById('collab-student-id').value;
    const projId = document.getElementById('collab-project-select').value;
    const role = document.getElementById('collab-role').value;
    const intro = document.getElementById('collab-intro').value;

    const recipient = this.students.find(s => s.id === studentId);
    
    // Simulate sending request notification (Mocking sending out to the user)
    this.showToast(`Collab request sent to ${recipient.name}!`, 'success');
    this.closeCollabModal();

    // Log the request to user activity timeline
    this.addTimelineEvent(
      'Sent request',
      `You invited ${recipient.name} to join as "${role}"`,
      'Just now'
    );
  }

  // ==========================================
  // SCREEN 9: MESSAGES WORKSPACE
  // ==========================================
  renderChats() {
    const channelList = document.getElementById('chat-list-channels');
    const directList = document.getElementById('chat-list-directs');
    
    channelList.innerHTML = '';
    directList.innerHTML = '';

    this.messages.forEach(chat => {
      const isAct = this.activeChatId === chat.chatId;
      const lastMsg = chat.history.length > 0 ? chat.history[chat.history.length - 1].text : 'No messages yet';
      const lastTime = chat.history.length > 0 ? chat.history[chat.history.length - 1].time : '';

      const item = document.createElement('div');
      item.className = `chat-list-item ${isAct ? 'active' : ''}`;
      item.onclick = () => this.selectChat(chat.chatId);
      item.innerHTML = `
        <div class="user-avatar-container">
          <img src="${chat.avatar}" alt="Avatar" class="avatar" style="width: 38px; height: 38px;">
          <div class="status-indicator online"></div>
        </div>
        <div class="chat-list-details">
          <div class="chat-title-row">
            <span class="chat-list-name">${chat.name}</span>
            <span class="chat-list-time">${lastTime}</span>
          </div>
          <p class="chat-list-msg">${lastMsg}</p>
        </div>
      `;

      if (chat.isChannel) {
        channelList.appendChild(item);
      } else {
        directList.appendChild(item);
      }
    });

    if (!this.activeChatId && this.messages.length > 0) {
      this.selectChat(this.messages[0].chatId);
    }
  }

  selectChat(chatId) {
    this.activeChatId = chatId;
    
    // Toggle active screen style for mobile messaging view transition
    document.getElementById('chat-workspace-container').classList.add('active-chat');

    const chat = this.messages.find(c => c.chatId === chatId);
    if (!chat) return;

    // Highlights selection in chat lists
    this.renderChats();

    document.getElementById('chat-window-avatar').src = chat.avatar;
    document.getElementById('chat-window-name').textContent = chat.name;
    document.getElementById('chat-window-subtitle').textContent = chat.subtitle;

    const chatBody = document.getElementById('chat-window-messages');
    chatBody.innerHTML = '';

    chat.history.forEach(m => {
      const isSent = m.senderId === this.currentUser.id;
      const wrapper = document.createElement('div');
      wrapper.className = `msg-wrapper ${isSent ? 'sent' : 'received'}`;
      wrapper.innerHTML = `
        <div class="msg-bubble">
          <div style="font-size: 0.75rem; font-weight: 700; margin-bottom: 2px; color: ${isSent ? 'rgba(255,255,255,0.9)' : 'var(--accent)'};">
            ${isSent ? 'You' : m.senderName}
          </div>
          <p>${m.text}</p>
          <div class="msg-meta">${m.time}</div>
        </div>
      `;
      chatBody.appendChild(wrapper);
    });

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  sendChatMessage() {
    const input = document.getElementById('chat-message-input');
    const text = input.value.trim();
    if (!text) return;

    const chat = this.messages.find(c => c.chatId === this.activeChatId);
    if (!chat) return;

    chat.history.push({
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      text,
      time: 'Just now'
    });

    input.value = '';
    this.selectChat(chat.chatId);

    // Schedule mock answer simulation after 1.5s
    setTimeout(() => this.simulateChatReply(chat), 1500);
  }

  handleChatKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendChatMessage();
    }
  }

  simulateChatReply(chat) {
    let replyText = "Sounds good! Let's schedule a call tomorrow afternoon to discuss details.";
    if (chat.isChannel) {
      replyText = `Great! I've updated the repository. Let's sync with our Faculty Mentor Dr. Amit later this week.`;
    }

    chat.history.push({
      senderId: 'bot_reply',
      senderName: chat.isChannel ? 'Aarav Mehta' : chat.name,
      text: replyText,
      time: 'Just now'
    });

    if (this.activeChatId === chat.chatId) {
      this.selectChat(chat.chatId);
    } else {
      this.showToast(`New message from ${chat.name}`, 'info');
      this.updateBadgeCounts();
    }
  }

  openDirectChat(studentId) {
    const s = this.students.find(x => x.id === studentId);
    if (!s) return;

    // Check if chat already exists
    let chat = this.messages.find(m => m.chatId === s.id);
    if (!chat) {
      chat = {
        chatId: s.id,
        name: s.name,
        isChannel: false,
        avatar: s.avatar,
        subtitle: `${s.dept} • ${s.year}`,
        history: []
      };
      this.messages.push(chat);
    }
    
    this.navigateTo('messages');
    this.selectChat(s.id);
  }

  simulatePortfolioShare() {
    const chat = this.messages.find(c => c.chatId === this.activeChatId);
    if (!chat) return;

    chat.history.push({
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      text: `📂 Shared Portfolio: <a href="#" style="text-decoration: underline; color: white;">Interactive Case Studies Showcase</a>`,
      time: 'Just now'
    });
    this.selectChat(chat.chatId);
    this.showToast('Portfolio asset shared to chat.', 'success');
  }

  simulateFileAttachment() {
    const chat = this.messages.find(c => c.chatId === this.activeChatId);
    if (!chat) return;

    chat.history.push({
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      text: `📄 Project_Brief_Draft.pdf (1.2 MB)`,
      time: 'Just now'
    });
    this.selectChat(chat.chatId);
    this.showToast('Document attached to chat.', 'success');
  }

  showChatSettings() {
    this.showToast('Chat Workspace details: End-to-end university verified channel.', 'info');
  }

  // ==========================================
  // SCREEN 10: EVENTS BOARD
  // ==========================================
  renderEvents() {
    const container = document.getElementById('events-list-grid');
    container.innerHTML = '';

    const tab = this.activeEventTab || 'All';

    const filtered = this.events.filter(ev => tab === 'All' || ev.type === tab);

    filtered.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'card card-hover event-card';
      card.innerHTML = `
        <span class="event-tag">${ev.type}</span>
        <div style="height: 120px; background-color: var(--primary-light); margin: -24px -24px 16px -24px; display: flex; align-items: center; justify-content: center;">
          <i data-lucide="sparkles" style="width: 48px; height: 48px; color: var(--primary); opacity: 0.3;"></i>
        </div>
        <div style="display: flex; gap: 16px; margin-top: 12px;">
          <div class="event-date-box" style="flex-shrink:0;">
            <span class="month">${ev.month}</span>
            <span class="day">${ev.day}</span>
          </div>
          <div>
            <h3 style="font-size: 1.1rem; line-height: 1.3;">${ev.title}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${ev.desc}</p>
          </div>
        </div>
        <div class="event-card-actions">
          <button class="btn ${ev.registered ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="app.toggleEventRegistration('${ev.id}')">${ev.registered ? 'Registered' : 'Register'}</button>
          <button class="btn btn-outline btn-sm" onclick="app.showToast('Added to Calendar', 'success')">Schedule</button>
        </div>
      `;
      container.appendChild(card);
    });

    lucide.createIcons();
  }

  filterEvents(type, chipElement) {
    this.activeEventTab = type;
    const chips = document.querySelectorAll('#events-tab-filters .chip');
    chips.forEach(c => c.classList.remove('selected'));
    chipElement.classList.add('selected');
    this.renderEvents();
  }

  toggleEventRegistration(eventId) {
    const ev = this.events.find(x => x.id === eventId);
    if (ev) {
      ev.registered = !ev.registered;
      this.showToast(
        ev.registered ? `Successfully registered for: ${ev.title}` : `Cancelled registration for: ${ev.title}`,
        'success'
      );
      this.loadScreenData(this.activeScreen);
    }
  }

  // ==========================================
  // SCREEN 11: NOTIFICATIONS CENTER
  // ==========================================
  renderNotifications() {
    const container = document.getElementById('notifications-list-container');
    container.innerHTML = '';

    if (this.notifications.length === 0) {
      container.innerHTML = '<div class="card" style="text-align: center; padding: 48px; color: var(--text-muted);">No notifications yet.</div>';
      return;
    }

    this.notifications.forEach(n => {
      const card = document.createElement('div');
      card.className = `notification-item ${n.read ? '' : 'unread'}`;
      card.innerHTML = `
        <div class="noti-icon">
          <i data-lucide="${n.type === 'invitation' ? 'user-plus' : 'sparkles'}"></i>
        </div>
        <div class="noti-body">
          <h3 class="noti-title">${n.title}</h3>
          <p class="noti-desc">${n.desc}</p>
          <span class="noti-time">${n.time}</span>
          ${n.type === 'invitation' ? `
            <div class="noti-actions">
              <button class="btn btn-primary btn-sm" onclick="app.acceptCollabInvitation('${n.id}')">Accept Invitation</button>
              <button class="btn btn-secondary btn-sm" onclick="app.rejectCollabInvitation('${n.id}')">Decline</button>
            </div>
          ` : ''}
        </div>
      `;
      container.appendChild(card);
    });

    lucide.createIcons();
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateBadgeCounts();
    this.renderNotifications();
    this.showToast('All notifications marked as read.', 'success');
  }

  acceptCollabInvitation(notificationId) {
    const n = this.notifications.find(x => x.id === notificationId);
    if (n) {
      // Find the associated project
      const proj = this.projects.find(p => p.id === 'p1'); // Mock specific mapping
      if (proj && !proj.members.some(m => m.studentId === this.currentUser.id)) {
        proj.members.push({
          studentId: this.currentUser.id,
          role: 'UI/UX Consultant'
        });
      }

      this.currentUser.connections += 1;
      
      // Remove or read notification
      this.notifications = this.notifications.filter(x => x.id !== notificationId);
      
      this.showToast('Accepted invitation to join project!', 'success');
      this.addTimelineEvent(
        'Joined project team',
        `You joined the "${proj.title}" team as UI/UX Consultant.`,
        'Just now'
      );
      this.updateBadgeCounts();
      this.renderNotifications();
    }
  }

  rejectCollabInvitation(notificationId) {
    this.notifications = this.notifications.filter(x => x.id !== notificationId);
    this.updateBadgeCounts();
    this.renderNotifications();
    this.showToast('Invitation declined.', 'info');
  }

  // ==========================================
  // SCREEN 12: USER DASHBOARD
  // ==========================================
  renderUserDashboard() {
    document.getElementById('my-profile-pfp').src = this.currentUser.avatar;
    document.getElementById('my-profile-name').textContent = this.currentUser.name;
    document.getElementById('my-profile-dept-year').textContent = `${this.currentUser.dept} • ${this.currentUser.year}`;

    // Populate Counters
    const myOwnedProjects = this.projects.filter(p => p.ownerId === this.currentUser.id);
    const myJoinedProjects = this.projects.filter(p => p.members.some(m => m.studentId === this.currentUser.id) && p.ownerId !== this.currentUser.id);

    document.getElementById('my-stats-projects').textContent = myOwnedProjects.length;
    document.getElementById('my-stats-connections').textContent = this.currentUser.connections;

    // Render Created Projects List
    const createdContainer = document.getElementById('my-created-projects-list');
    createdContainer.innerHTML = '';
    if (myOwnedProjects.length === 0) {
      createdContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 12px 0;">You have not published any projects.</p>';
    } else {
      myOwnedProjects.forEach(p => {
        const item = document.createElement('div');
        item.style = 'border-bottom: 1px solid var(--border); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;';
        item.innerHTML = `
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600;">${p.title}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Recruiting: ${p.members.length}/${p.teamSize} Teammates</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="app.viewProjectDetails('${p.id}')">Dashboard</button>
        `;
        createdContainer.appendChild(item);
      });
    }

    // Render Joined Projects List
    const joinedContainer = document.getElementById('my-joined-projects-list');
    joinedContainer.innerHTML = '';
    if (myJoinedProjects.length === 0) {
      joinedContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 12px 0;">You have not joined any project teams yet.</p>';
    } else {
      myJoinedProjects.forEach(p => {
        const item = document.createElement('div');
        item.style = 'border-bottom: 1px solid var(--border); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;';
        item.innerHTML = `
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600;">${p.title}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Category: ${p.category}</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="app.viewProjectDetails('${p.id}')">Workspace</button>
        `;
        joinedContainer.appendChild(item);
      });
    }

    // Render Timeline Events
    this.renderTimeline();
  }

  addTimelineEvent(title, desc, time = 'Just now') {
    if (!this.timelineEvents) {
      this.timelineEvents = [
        { title: 'Profile Created', desc: 'Verified student status and published digital portfolio.', time: '1 hour ago' }
      ];
    }
    this.timelineEvents.unshift({ title, desc, time });
  }

  renderTimeline() {
    const container = document.getElementById('my-activity-timeline');
    container.innerHTML = '';

    if (!this.timelineEvents) {
      this.timelineEvents = [
        { title: 'Profile Created', desc: 'Verified student status and published digital portfolio.', time: '1 hour ago' }
      ];
    }

    this.timelineEvents.forEach(ev => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-time">${ev.time}</div>
        <div class="timeline-title">${ev.title}</div>
        <div class="timeline-desc">${ev.desc}</div>
      `;
      container.appendChild(item);
    });
  }

  logoutUser() {
    this.currentUser = null;
    this.navigateTo('splash');
    this.showToast('Logged out of Workspace.', 'info');
  }

  // ==========================================
  // CREATE PROJECT PROPOSALS
  // ==========================================
  openCreateProjectModal() {
    // Populate project creation skill chips
    const container = document.getElementById('project-skills-selector');
    container.innerHTML = '';
    this.projectSignupSkills = [];

    this.skillsList.forEach(skill => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = skill;
      chip.onclick = () => {
        if (this.projectSignupSkills.includes(skill)) {
          this.projectSignupSkills = this.projectSignupSkills.filter(s => s !== skill);
          chip.classList.remove('selected');
        } else {
          if (this.projectSignupSkills.length >= 5) {
            this.showToast('You can select a maximum of 5 skills.', 'info');
            return;
          }
          this.projectSignupSkills.push(skill);
          chip.classList.add('selected');
        }
      };
      container.appendChild(chip);
    });

    document.getElementById('modal-create-project').classList.add('active');
  }

  closeCreateProjectModal() {
    document.getElementById('modal-create-project').classList.remove('active');
  }

  submitCreateProject() {
    const title = document.getElementById('new-project-title').value;
    const desc = document.getElementById('new-project-desc').value;
    const size = document.getElementById('new-project-size').value;
    const deadline = document.getElementById('new-project-deadline').value;
    const mentor = document.getElementById('new-project-mentor').value;
    const type = document.getElementById('new-project-type').value;

    if (this.projectSignupSkills.length === 0) {
      this.showToast('Please select at least 1 required skill.', 'info');
      return;
    }

    const newProject = {
      id: 'p_custom_' + Date.now(),
      title,
      desc,
      skillsNeeded: this.projectSignupSkills,
      ownerId: this.currentUser.id,
      mentor: mentor || 'Undecided',
      teamSize: parseInt(size),
      deadline,
      category: type,
      members: [
        { studentId: this.currentUser.id, role: 'Project Initiator / Leader' }
      ],
      comments: []
    };

    // Add to database
    this.projects.push(newProject);
    
    // Add timeline log
    this.addTimelineEvent(
      'Published Project listing',
      `You listed "${title}" looking for ${this.projectSignupSkills.join(', ')} capabilities.`,
      'Just now'
    );

    this.closeCreateProjectModal();
    this.showToast('Project published to Campus Board!', 'success');
    
    // Reload dashboard
    this.loadScreenData(this.activeScreen);
  }

  // ==========================================
  // HELPERS, TOASTS & AI LOGIC
  // ==========================================
  calculateAIMatchScore(requiredSkills, studentSkills) {
    if (!requiredSkills || !studentSkills || requiredSkills.length === 0) return 0;
    
    // Simple intersection match ratio
    const intersection = requiredSkills.filter(s => studentSkills.includes(s));
    const score = Math.round((intersection.length / requiredSkills.length) * 100);
    
    // Boost minimum base score to make prototype look engaging
    return score === 0 ? 15 : score;
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${icon}" style="width: 18px; height: 18px;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Fade and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.4s, transform 0.4s';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  renderSkillsList() {
    // Basic hooks or visual debuggers if needed
  }

  renderProjectSkillsSelector() {
    // Placeholders
  }

  setupEventListeners() {
    // Additional event binding can be added here
  }
}

// Instantiate global app workspace
const app = new CampusHubApp();
