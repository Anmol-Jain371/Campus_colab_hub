import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'hub.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
  } else {
    console.log('Connected to local SQLite database at:', dbPath);
    initializeSchema();
  }
});

// Helper for running queries in promise form
export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

async function initializeSchema() {
  try {
    // Create Students Table with email and password columns
    await runQuery(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        dept TEXT NOT NULL,
        year TEXT NOT NULL,
        skills TEXT NOT NULL,
        bio TEXT,
        avatar TEXT,
        portfolio TEXT,
        github TEXT,
        linkedin TEXT,
        availability TEXT,
        interest TEXT,
        trustScore INTEGER DEFAULT 90,
        endorsements INTEGER DEFAULT 0,
        connections INTEGER DEFAULT 0,
        verified INTEGER DEFAULT 1,
        userType TEXT DEFAULT 'student'
      )
    `);

    // Create Projects Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        desc TEXT NOT NULL,
        skillsNeeded TEXT NOT NULL,
        ownerId TEXT NOT NULL,
        mentor TEXT,
        teamSize INTEGER NOT NULL,
        deadline TEXT,
        category TEXT NOT NULL
      )
    `);

    // Create Project Members Join Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS project_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectId TEXT NOT NULL,
        studentId TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);

    // Create Project Comments Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS project_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectId TEXT NOT NULL,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        time TEXT NOT NULL
      )
    `);

    // Create Chat Messages Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chatId TEXT NOT NULL,
        senderId TEXT NOT NULL,
        senderName TEXT NOT NULL,
        text TEXT NOT NULL,
        time TEXT NOT NULL
      )
    `);

    // Create Notifications Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        desc TEXT NOT NULL,
        time TEXT NOT NULL,
        type TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        projectId TEXT,
        studentId TEXT,
        role TEXT
      )
    `);

    try { await runQuery("ALTER TABLE notifications ADD COLUMN projectId TEXT"); } catch (e) {}
    try { await runQuery("ALTER TABLE notifications ADD COLUMN studentId TEXT"); } catch (e) {}
    try { await runQuery("ALTER TABLE notifications ADD COLUMN role TEXT"); } catch (e) {}
    try { await runQuery("ALTER TABLE students ADD COLUMN userType TEXT DEFAULT 'student'"); } catch (e) {}

    // Create Events Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        desc TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        month TEXT NOT NULL,
        day TEXT NOT NULL,
        registered INTEGER DEFAULT 0
      )
    `);

    // Check if students have old email domains or if database needs re-seeding
    const nonRvceStudent = await getQuery("SELECT COUNT(*) as count FROM students WHERE email NOT LIKE '%@rvce.edu.in'");
    if (nonRvceStudent && nonRvceStudent.count > 0) {
      console.log('Migrating existing student records to @rvce.edu.in domain...');
      await runQuery("DELETE FROM students WHERE email NOT LIKE '%@rvce.edu.in'");
    }

    // Seed mock database if empty
    const studentCount = await getQuery("SELECT COUNT(*) as count FROM students");
    if (studentCount.count === 0) {
      console.log('Seeding database with RVCE verified student data...');
      await seedDatabase();
    } else {
      console.log('Database initialized. Found', studentCount.count, 'RVCE verified accounts.');
    }
  } catch (err) {
    console.error('Error creating database schema:', err);
  }
}

async function seedDatabase() {
  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  
  // 1. Seed RVCE Students
  const students = [
    {
      id: 's_anmol',
      name: 'Anmol Jain',
      email: 'anmoljainp.mca25@rvce.edu.in',
      password: defaultPasswordHash,
      dept: 'Master of Computer Applications (MCA)',
      year: '1st Year',
      skills: JSON.stringify(['React', 'Node.js', 'Python', 'Full Stack Development', 'Git']),
      bio: 'MCA Student at RVCE. Building campus collaboration solutions and full-stack web applications. Passionate about software architecture and team projects.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      portfolio: JSON.stringify([
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300'
      ]),
      github: 'https://github.com/Anmol-Jain371',
      linkedin: 'https://linkedin.com',
      availability: 'Open for projects',
      interest: 'Campus Systems, Web Development',
      trustScore: 99,
      endorsements: 25,
      connections: 15,
      verified: 1,
      userType: 'student'
    },
    {
      id: 's1',
      name: 'Aarav Mehta',
      email: 'aarav.cs21@rvce.edu.in',
      password: defaultPasswordHash,
      dept: 'Computer Science & Engineering',
      year: '4th Year',
      skills: JSON.stringify(['Python', 'Machine Learning', 'Cloud', 'Data Science']),
      bio: 'RVCE CSE Student. Enthusiastic machine learning developer building products for healthcare. Looking to collaborate with designers for a startup venture.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      portfolio: JSON.stringify([
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300'
      ]),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      availability: 'Open for projects',
      interest: 'Startup, Research',
      trustScore: 98,
      endorsements: 16,
      connections: 8,
      verified: 1,
      userType: 'student'
    },
    {
      id: 's2',
      name: 'Riya Sen',
      email: 'riya.ise22@rvce.edu.in',
      password: defaultPasswordHash,
      dept: 'Information Science & Engineering',
      year: '3rd Year',
      skills: JSON.stringify(['UI/UX', 'Figma', 'React', 'Content Writing']),
      bio: 'RVCE ISE Product Designer who codes. I build design systems, wireframes, and high-fidelity mockups. Always excited about 8th Mile tech fests.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      portfolio: JSON.stringify([
        'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=300'
      ]),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      availability: 'Open for projects',
      interest: 'Hackathons, Startups',
      trustScore: 96,
      endorsements: 22,
      connections: 12,
      verified: 1,
      userType: 'student'
    },
    {
      id: 'f1',
      name: 'Dr. Amit Sen',
      email: 'amitsen@rvce.edu.in',
      password: defaultPasswordHash,
      dept: 'Computer Science & Engineering',
      year: 'Professor',
      skills: JSON.stringify(['AI', 'Machine Learning', 'Research', 'Mentorship']),
      bio: 'Professor of Computer Science & Artificial Intelligence research group lead at RVCE. Open to mentoring hackathon and startup prototypes.',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150',
      portfolio: JSON.stringify([]),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      availability: 'Available to Mentor',
      interest: 'Research, Mentorship',
      trustScore: 100,
      endorsements: 45,
      connections: 30,
      verified: 1,
      userType: 'faculty'
    }
  ];

  for (const s of students) {
    await runQuery(`
      INSERT INTO students (id, name, email, password, dept, year, skills, bio, avatar, portfolio, github, linkedin, availability, interest, trustScore, endorsements, connections, verified, userType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [s.id, s.name, s.email, s.password, s.dept, s.year, s.skills, s.bio, s.avatar, s.portfolio, s.github, s.linkedin, s.availability, s.interest, s.trustScore, s.endorsements, s.connections, s.verified, s.userType || 'student']);
  }

  // 2. Seed Projects
  const projects = [
    {
      id: 'p1',
      title: 'Smart Campus IoT Grid',
      desc: 'Developing an energy-saving automated lighting and HVAC monitoring model for campus classrooms. Looking for IoT enthusiasts, a database designer, and a Business student to draft a commercialization model.',
      skillsNeeded: JSON.stringify(['IoT', 'Python', 'Cloud', 'Finance']),
      ownerId: 's4',
      mentor: 'Dr. Amit Verma (ECE)',
      teamSize: 5,
      deadline: '2026-11-30',
      category: 'Research'
    },
    {
      id: 'p2',
      title: 'Decentralized Campus Locker',
      desc: 'A hackathon project building a secure, OTP/Smart card-based locker system for campus libraries and gyms, integrated with a React dashboard app. Seeking React developer and UI designer.',
      skillsNeeded: JSON.stringify(['React', 'Figma', 'UI/UX', 'Cybersecurity']),
      ownerId: 's1',
      mentor: 'Prof. Anita Desai (CSE)',
      teamSize: 4,
      deadline: '2026-08-15',
      category: 'Hackathon'
    },
    {
      id: 'p3',
      title: 'EduMatch: Peer Learning App',
      desc: 'A startup model matching students for study sessions and interdisciplinary learning tasks. Need a Flutter app developer and a marketing wizard to create the customer launch strategy.',
      skillsNeeded: JSON.stringify(['Flutter', 'UI/UX', 'Marketing', 'Content Writing']),
      ownerId: 's2',
      mentor: 'Dr. Ramamurthy (Business Incubator)',
      teamSize: 4,
      deadline: '2026-12-10',
      category: 'Startup'
    }
  ];

  for (const p of projects) {
    await runQuery(`
      INSERT INTO projects (id, title, desc, skillsNeeded, ownerId, mentor, teamSize, deadline, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [p.id, p.title, p.desc, p.skillsNeeded, p.ownerId, p.mentor, p.teamSize, p.deadline, p.category]);
  }

  // 3. Seed Project Members
  const members = [
    { projectId: 'p1', studentId: 's4', role: 'Project Lead (Hardware Design)' },
    { projectId: 'p1', studentId: 's1', role: 'Cloud Backend Integrator' },
    { projectId: 'p2', studentId: 's1', role: 'Project Lead (Firmware & Backend)' },
    { projectId: 'p3', studentId: 's2', role: 'UI/UX Designer & Product Manager' },
    { projectId: 'p3', studentId: 's5', role: 'Frontend Engineer' }
  ];

  for (const m of members) {
    await runQuery(`
      INSERT INTO project_members (projectId, studentId, role)
      VALUES (?, ?, ?)
    `, [m.projectId, m.studentId, m.role]);
  }

  // 4. Seed Project Comments
  const comments = [
    { projectId: 'p1', author: 'Aarav Mehta', text: 'Just updated the Cloud interface API endpoints for the sensors.', time: '1 day ago' },
    { projectId: 'p3', author: 'Rahul Gupta', text: 'Design files on Figma look amazing! Starting with the home layout components.', time: '3 hours ago' }
  ];

  for (const c of comments) {
    await runQuery(`
      INSERT INTO project_comments (projectId, author, text, time)
      VALUES (?, ?, ?, ?)
    `, [c.projectId, c.author, c.text, c.time]);
  }

  // 5. Seed Chat Messages
  const chats = [
    { chatId: 'p1', senderId: 's4', senderName: 'Neha Roy', text: 'Hi team, did we finalize the sensor locations with Dr. Amit?', time: 'Yesterday' },
    { chatId: 'p1', senderId: 's1', senderName: 'Aarav Mehta', text: 'Yes, we will deploy 4 nodes in Room 402 and 2 in the corridor. I have configured the cloud databases.', time: 'Yesterday' },
    { chatId: 's2', senderId: 's2', senderName: 'Riya Sen', text: 'Hi! I noticed your profile and saw you work with React. Would you be open to collaborating on the EduMatch startup pitch?', time: '2 hours ago' }
  ];

  for (const msg of chats) {
    await runQuery(`
      INSERT INTO chat_messages (chatId, senderId, senderName, text, time)
      VALUES (?, ?, ?, ?, ?)
    `, [msg.chatId, msg.senderId, msg.senderName, msg.text, msg.time]);
  }

  // 6. Seed Notifications
  const notifications = [
    {
      id: 'n1',
      title: 'New Collaborator Suggestion',
      desc: 'Aarav Mehta matches 85% of your skill search queries.',
      time: '10 mins ago',
      type: 'suggestion',
      read: 0
    },
    {
      id: 'n2',
      title: 'Project Invitation',
      desc: 'Neha Roy invited you to join "Smart Campus IoT Grid" as a UI/UX consultant.',
      time: '3 hours ago',
      type: 'invitation',
      read: 0
    }
  ];

  for (const n of notifications) {
    await runQuery(`
      INSERT INTO notifications (id, title, desc, time, type, read)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [n.id, n.title, n.desc, n.time, n.type, n.read]);
  }

  // 7. Seed Events
  const events = [
    {
      id: 'e1',
      title: 'Mega Campus Hackathon 2026',
      desc: '48-hour build-a-thon addressing civic tech, education, and campus green initiatives. Total prize pool: $5,000 + incubation offers.',
      type: 'Hackathons',
      date: 'July 15 - 17, 2026',
      month: 'Jul',
      day: '15',
      registered: 0
    },
    {
      id: 'e2',
      title: 'AI in Biotech Colloquium & Pitch',
      desc: 'Faculty-led research workshop on computational models for drug discovery. Open to CSE, Chemical, and Postgraduate students.',
      type: 'Research Opportunities',
      date: 'Aug 04, 2026',
      month: 'Aug',
      day: '04',
      registered: 0
    },
    {
      id: 'e3',
      title: 'Startup Venture Pitch Deck Competition',
      desc: 'Submit your interdisciplinary business concepts. Finalists pitch to local Angel investors and VC representatives.',
      type: 'Competitions',
      date: 'Sep 21, 2026',
      month: 'Sep',
      day: '21',
      registered: 0
    },
    {
      id: 'e4',
      title: 'Masterclass: Figma Design Systems',
      desc: 'Learn token management, auto-layouts, and component states from industry guest speakers.',
      type: 'Workshops',
      date: 'Jul 09, 2026',
      month: 'Jul',
      day: '09',
      registered: 0
    }
  ];

  for (const ev of events) {
    await runQuery(`
      INSERT INTO events (id, title, desc, type, date, month, day, registered)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [ev.id, ev.title, ev.desc, ev.type, ev.date, ev.month, ev.day, ev.registered]);
  }

  console.log('Seeding complete.');
}
