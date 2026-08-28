import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runQuery, allQuery, getQuery } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'rvce_hub_secret_key_12345';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = join(__dirname, 'uploads');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// File Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Set up Socket.io events
io.on('connection', (socket) => {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
  });
});

// Helper function to check RVCE email domain
const isRvceEmail = (email) => {
  return typeof email === 'string' && email.trim().toLowerCase().endsWith('@rvce.edu.in');
};

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Secure session token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Access forbidden. Secure session expired or invalid.' });
    }
    req.user = user;
    next();
  });
};

// ==========================================
// 1. STUDENTS / AUTH API
// ==========================================
app.get('/api/students', async (req, res) => {
  try {
    const rows = await allQuery("SELECT * FROM students");
    const parsed = rows.map(s => ({
      ...s,
      skills: JSON.parse(s.skills),
      portfolio: JSON.parse(s.portfolio || '[]'),
      verified: !!s.verified
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !isRvceEmail(email)) {
    return res.status(400).json({ 
      error: 'Access restricted! Only official RV College emails (@rvce.edu.in) are permitted.' 
    });
  }

  try {
    const s = await getQuery("SELECT * FROM students WHERE LOWER(email) = LOWER(?)", [email.trim()]);
    if (s) {
      const isMatch = await bcrypt.compare(password, s.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: s.id, email: s.email, userType: s.userType },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          user: {
            ...s,
            skills: JSON.parse(s.skills),
            portfolio: JSON.parse(s.portfolio || '[]'),
            verified: !!s.verified
          },
          token
        });
      }
    }
    return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, dept, year, skills, bio, avatar, userType, usn } = req.body;

  if (!email || !isRvceEmail(email)) {
    return res.status(400).json({ 
      error: 'Registration restricted! You must use an official RV College email address (@rvce.edu.in).' 
    });
  }

  // Validate USN for students
  let finalUsn = null;
  if (userType !== 'faculty') {
    if (!usn) {
      return res.status(400).json({ error: 'University Seat Number (USN) is required for students.' });
    }
    const usnRegex = /^1RV\d{2}(CS|IS|EC|EE|ME|BT|CV|CH|TE|AS|IM|MC)\d{3}$/i;
    if (!usnRegex.test(usn.trim())) {
      return res.status(400).json({ 
        error: 'Invalid USN format! Must match official RVCE student format (e.g. 1RV22MC025).' 
      });
    }
    finalUsn = usn.trim().toUpperCase();
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const id = 'rvce_user_' + Date.now();
  try {
    const existingEmail = await getQuery("SELECT id FROM students WHERE LOWER(email) = LOWER(?)", [email.trim()]);
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this @rvce.edu.in email already exists.' });
    }

    if (finalUsn) {
      const existingUsn = await getQuery("SELECT id FROM students WHERE LOWER(usn) = LOWER(?)", [finalUsn]);
      if (existingUsn) {
        return res.status(400).json({ error: 'An account with this USN is already registered.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await runQuery(`
      INSERT INTO students (id, name, email, password, dept, year, skills, bio, avatar, portfolio, github, linkedin, availability, interest, trustScore, endorsements, connections, verified, userType, usn)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 95, 0, 0, 1, ?, ?)
    `, [
      id, name, email.trim().toLowerCase(), hashedPassword, dept, year, JSON.stringify(skills || []), bio || '', 
      avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      JSON.stringify([]), 'https://github.com', 'https://linkedin.com', 
      userType === 'faculty' ? 'Available to Mentor' : 'Open for projects', 
      userType === 'faculty' ? 'Research, Mentorship' : 'Hackathons, Startups',
      userType || 'student',
      finalUsn
    ]);
    
    const s = await getQuery("SELECT * FROM students WHERE id = ?", [id]);
    const token = jwt.sign(
      { id: s.id, email: s.email, userType: s.userType },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      user: {
        ...s,
        skills: JSON.parse(s.skills),
        portfolio: JSON.parse(s.portfolio || '[]'),
        verified: !!s.verified
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/students/:id', authenticateToken, async (req, res) => {
  const studentId = req.params.id;

  // Security: check if authenticated user matches target profile id
  if (req.user.id !== studentId) {
    return res.status(403).json({ error: 'Unauthorized to edit this student profile.' });
  }

  const { name, dept, year, bio, skills, avatar } = req.body;
  try {
    await runQuery(`
      UPDATE students 
      SET name = ?, dept = ?, year = ?, bio = ?, skills = ?, avatar = ?
      WHERE id = ?
    `, [name, dept, year, bio, JSON.stringify(skills), avatar, studentId]);

    const updated = await getQuery("SELECT * FROM students WHERE id = ?", [studentId]);
    res.json({
      ...updated,
      skills: JSON.parse(updated.skills),
      portfolio: JSON.parse(updated.portfolio || '[]'),
      verified: !!updated.verified
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students/:id/endorse', authenticateToken, async (req, res) => {
  const studentId = req.params.id;
  try {
    const s = await getQuery("SELECT endorsements, trustScore FROM students WHERE id = ?", [studentId]);
    if (s) {
      const newEndorsements = (s.endorsements || 0) + 1;
      const newTrustScore = Math.min(100, (s.trustScore || 90) + 2);
      await runQuery(`
        UPDATE students 
        SET endorsements = ?, trustScore = ?
        WHERE id = ?
      `, [newEndorsements, newTrustScore, studentId]);
      res.json({ success: true, endorsements: newEndorsements, trustScore: newTrustScore });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. PROJECTS COLLABORATIONS API
// ==========================================
app.get('/api/projects', async (req, res) => {
  try {
    const projRows = await allQuery("SELECT * FROM projects");
    const projects = [];

    for (const p of projRows) {
      const members = await allQuery("SELECT studentId, role FROM project_members WHERE projectId = ?", [p.id]);
      const comments = await allQuery("SELECT author, text, time FROM project_comments WHERE projectId = ?", [p.id]);
      
      projects.push({
        ...p,
        skillsNeeded: JSON.parse(p.skillsNeeded),
        members,
        comments
      });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { id, title, desc, skillsNeeded, ownerId, mentor, teamSize, deadline, category } = req.body;
  
  if (req.user.id !== ownerId) {
    return res.status(403).json({ error: 'Unauthorized to create projects on behalf of another user.' });
  }
  try {
    await runQuery(`
      INSERT INTO projects (id, title, desc, skillsNeeded, ownerId, mentor, teamSize, deadline, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, title, desc, JSON.stringify(skillsNeeded), ownerId, mentor, parseInt(teamSize), deadline, category]);

    // Auto-add owner as Leader
    await runQuery(`
      INSERT INTO project_members (projectId, studentId, role)
      VALUES (?, ?, ?)
    `, [id, ownerId, 'Project Initiator / Leader']);

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects/:id/comments', authenticateToken, async (req, res) => {
  const projectId = req.params.id;
  const { author, text } = req.body;
  try {
    await runQuery(`
      INSERT INTO project_comments (projectId, author, text, time)
      VALUES (?, ?, ?, 'Just now')
    `, [projectId, author, text]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. MESSAGING WORKSPACE API
// ==========================================
app.get('/api/messages', async (req, res) => {
  try {
    // Group active chats
    const chats = [
      {
        chatId: 'p1',
        name: 'Smart Campus IoT Grid',
        isChannel: true,
        avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=150',
        subtitle: 'Research Channel • 3 members',
        history: []
      },
      {
        chatId: 's2',
        name: 'Riya Sen',
        isChannel: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        subtitle: 'Design & Fine Arts • 3rd Year',
        history: []
      }
    ];

    // Load extra dynamic private chats
    const extraChats = await allQuery("SELECT DISTINCT chatId FROM chat_messages WHERE chatId NOT IN ('p1', 's2')");
    for (const ec of extraChats) {
      const student = await getQuery("SELECT name, avatar, dept, year FROM students WHERE id = ?", [ec.chatId]);
      if (student) {
        chats.push({
          chatId: ec.chatId,
          name: student.name,
          isChannel: false,
          avatar: student.avatar,
          subtitle: `${student.dept} • ${student.year}`,
          history: []
        });
      }
    }

    // Populate history
    for (const chat of chats) {
      const history = await allQuery("SELECT senderId, senderName, text, time FROM chat_messages WHERE chatId = ? ORDER BY id ASC", [chat.chatId]);
      chat.history = history;
    }

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages/send', authenticateToken, async (req, res) => {
  const { chatId, senderId, senderName, text } = req.body;

  if (req.user.id !== senderId) {
    return res.status(403).json({ error: 'Unauthorized to send messages as another user.' });
  }
  try {
    await runQuery(`
      INSERT INTO chat_messages (chatId, senderId, senderName, text, time)
      VALUES (?, ?, ?, ?, 'Just now')
    `, [chatId, senderId, senderName, text]);

    io.to(chatId).emit('newMessage', {
      chatId,
      senderId,
      senderName,
      text,
      time: 'Just now'
    });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. NOTIFICATIONS API
// ==========================================
app.get('/api/notifications', async (req, res) => {
  try {
    const rows = await allQuery("SELECT * FROM notifications");
    res.json(rows.map(n => ({ ...n, read: !!n.read })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await runQuery("UPDATE notifications SET read = 1");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
  const { title, desc, type, projectId, studentId, role } = req.body;

  if (req.user.id !== studentId) {
    return res.status(403).json({ error: 'Unauthorized payload. Student initiator must match authenticated user.' });
  }
  const id = 'notif_' + Date.now();
  try {
    await runQuery(`
      INSERT INTO notifications (id, title, desc, time, type, read, projectId, studentId, role)
      VALUES (?, ?, ?, 'Just now', ?, 0, ?, ?, ?)
    `, [id, title, desc, type, projectId, studentId, role]);

    const newNotif = {
      id, title, desc, time: 'Just now', type, read: 0, projectId, studentId, role
    };
    io.emit('newNotification', newNotif);

    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/:id/accept', authenticateToken, async (req, res) => {
  const notiId = req.params.id;
  try {
    const noti = await getQuery("SELECT * FROM notifications WHERE id = ?", [notiId]);
    if (!noti) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const projectId = noti.projectId || 'p1';
    const studentId = noti.studentId || 's2';
    const role = noti.role || 'UI/UX Consultant';

    // Add to project members
    await runQuery(`
      INSERT INTO project_members (projectId, studentId, role)
      VALUES (?, ?, ?)
    `, [projectId, studentId, role]);

    // Fetch details for system message
    const student = await getQuery("SELECT name FROM students WHERE id = ?", [studentId]);
    const project = await getQuery("SELECT title, ownerId FROM projects WHERE id = ?", [projectId]);

    const studentName = student ? student.name : 'A student';
    const projectTitle = project ? project.title : 'Project';
    const ownerId = project ? project.ownerId : 's1';

    const systemText = `System Moderator: Connection established! ${studentName} has joined "${projectTitle}" as a ${role}. You can now start collaborating and schedule sync calls!`;

    // Auto-create private chat for both recipient lists
    await runQuery(`
      INSERT INTO chat_messages (chatId, senderId, senderName, text, time)
      VALUES (?, 'system', 'System Moderator', ?, 'Just now')
    `, [studentId, systemText]);

    await runQuery(`
      INSERT INTO chat_messages (chatId, senderId, senderName, text, time)
      VALUES (?, 'system', 'System Moderator', ?, 'Just now')
    `, [ownerId, systemText]);

    // Emit live message updates
    io.to(studentId).emit('newMessage', {
      chatId: studentId,
      senderId: 'system',
      senderName: 'System Moderator',
      text: systemText,
      time: 'Just now'
    });

    io.to(ownerId).emit('newMessage', {
      chatId: ownerId,
      senderId: 'system',
      senderName: 'System Moderator',
      text: systemText,
      time: 'Just now'
    });

    // Delete notification
    await runQuery("DELETE FROM notifications WHERE id = ?", [notiId]);

    // Increment user connections
    await runQuery("UPDATE students SET connections = connections + 1 WHERE id = ?", [studentId]);
    await runQuery("UPDATE students SET connections = connections + 1 WHERE id = ?", [ownerId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/:id/decline', authenticateToken, async (req, res) => {
  const notiId = req.params.id;
  try {
    await runQuery("DELETE FROM notifications WHERE id = ?", [notiId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. EVENTS API
// ==========================================
app.get('/api/events', async (req, res) => {
  try {
    const rows = await allQuery("SELECT * FROM events");
    res.json(rows.map(ev => ({ ...ev, registered: !!ev.registered })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events/:id/register', authenticateToken, async (req, res) => {
  const eventId = req.params.id;
  try {
    const ev = await getQuery("SELECT registered FROM events WHERE id = ?", [eventId]);
    if (ev) {
      const newStatus = ev.registered ? 0 : 1;
      await runQuery("UPDATE events SET registered = ? WHERE id = ?", [newStatus, eventId]);
      res.json({ success: true, registered: !!newStatus });
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Campus Hub API Server running on http://localhost:${PORT}`);
});
