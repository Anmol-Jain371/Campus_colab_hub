export const skillsList = [
  'Python', 'Java', 'React', 'Flutter', 'UI/UX', 'Figma', 
  'Machine Learning', 'Cybersecurity', 'Cloud', 'IoT', 
  'Game Development', 'Data Science', 'Marketing', 'Finance', 'Content Writing'
];

export const initialStudents = [
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

export const initialProjects = [
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

export const initialEvents = [
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

export const initialNotifications = [
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

export const initialMessages = [
  {
    chatId: 'p1',
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
    chatId: 's2',
    name: 'Riya Sen',
    isChannel: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    subtitle: 'Design & Fine Arts • 3rd Year',
    history: [
      { senderId: 's2', senderName: 'Riya Sen', text: 'Hi! I noticed your profile and saw you work with React. Would you be open to collaborating on the EduMatch startup pitch?', time: '2 hours ago' }
    ]
  }
];

// Helper to load/save state from local storage
export const getLocalStorageData = (key, fallback) => {
  try {
    const val = localStorage.getItem(`campushub_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error("Error loading localStorage key", key, e);
    return fallback;
  }
};

export const setLocalStorageData = (key, value) => {
  try {
    localStorage.setItem(`campushub_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving localStorage key", key, e);
  }
};
