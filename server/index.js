import express from 'express';
import cors from 'cors';
import { runQuery, allQuery, getQuery } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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
  try {
    const s = await getQuery("SELECT * FROM students WHERE email = ? AND password = ?", [email, password]);
    if (s) {
      res.json({
        ...s,
        skills: JSON.parse(s.skills),
        portfolio: JSON.parse(s.portfolio || '[]'),
        verified: !!s.verified
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, dept, year, skills, bio, avatar, userType } = req.body;
  const id = 'custom_user_' + Date.now();
  try {
    const existing = await getQuery("SELECT id FROM students WHERE email = ?", [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email address already in use.' });
    }

    await runQuery(`
      INSERT INTO students (id, name, email, password, dept, year, skills, bio, avatar, portfolio, github, linkedin, availability, interest, trustScore, endorsements, connections, verified, userType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 90, 0, 0, 1, ?)
    `, [
      id, name, email, password, dept, year, JSON.stringify(skills), bio, 
      avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      JSON.stringify([]), 'https://github.com', 'https://linkedin.com', 
      userType === 'faculty' ? 'Available to Mentor' : 'Open for projects', 
      userType === 'faculty' ? 'Research, Mentorship' : 'Hackathons, Startups',
      userType || 'student'
    ]);
    
    const s = await getQuery("SELECT * FROM students WHERE id = ?", [id]);
    res.status(201).json({
      ...s,
      skills: JSON.parse(s.skills),
      portfolio: JSON.parse(s.portfolio || '[]'),
      verified: !!s.verified
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
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

app.post('/api/students/:id/endorse', async (req, res) => {
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

app.post('/api/projects', async (req, res) => {
  const { id, title, desc, skillsNeeded, ownerId, mentor, teamSize, deadline, category } = req.body;
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

app.post('/api/projects/:id/comments', async (req, res) => {
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

app.post('/api/messages/send', async (req, res) => {
  const { chatId, senderId, senderName, text } = req.body;
  try {
    await runQuery(`
      INSERT INTO chat_messages (chatId, senderId, senderName, text, time)
      VALUES (?, ?, ?, ?, 'Just now')
    `, [chatId, senderId, senderName, text]);

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

app.post('/api/notifications/read-all', async (req, res) => {
  try {
    await runQuery("UPDATE notifications SET read = 1");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  const { title, desc, type, projectId, studentId, role } = req.body;
  const id = 'notif_' + Date.now();
  try {
    await runQuery(`
      INSERT INTO notifications (id, title, desc, time, type, read, projectId, studentId, role)
      VALUES (?, ?, ?, 'Just now', ?, 0, ?, ?, ?)
    `, [id, title, desc, type, projectId, studentId, role]);
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/:id/accept', async (req, res) => {
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

app.post('/api/notifications/:id/decline', async (req, res) => {
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

app.post('/api/events/:id/register', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Campus Hub API Server running on http://localhost:${PORT}`);
});
