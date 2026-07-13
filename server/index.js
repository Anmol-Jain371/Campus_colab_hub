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

app.post('/api/students/login', async (req, res) => {
  const { id } = req.body;
  try {
    const s = await getQuery("SELECT * FROM students WHERE id = ?", [id]);
    if (s) {
      res.json({
        ...s,
        skills: JSON.parse(s.skills),
        portfolio: JSON.parse(s.portfolio || '[]'),
        verified: !!s.verified
      });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  const { id, name, dept, year, skills, bio, avatar } = req.body;
  try {
    await runQuery(`
      INSERT INTO students (id, name, dept, year, skills, bio, avatar, portfolio, github, linkedin, availability, interest, trustScore, endorsements, connections, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 90, 0, 0, 1)
    `, [
      id, name, dept, year, JSON.stringify(skills), bio, 
      avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      JSON.stringify([]), 'https://github.com', 'https://linkedin.com', 'Open for projects', 'Hackathons, Startups'
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

    // Live AI reply simulation: insert automated response inside DB after 1.5 seconds
    setTimeout(async () => {
      try {
        let replyText = "Sounds good! Let's schedule a call tomorrow afternoon to discuss details.";
        let replyName = senderName;

        if (chatId === 'p1') {
          replyText = `Great! I've updated the repository. Let's sync with our Faculty Mentor Dr. Amit later this week.`;
          replyName = 'Aarav Mehta';
        } else {
          const destStudent = await getQuery("SELECT name FROM students WHERE id = ?", [chatId]);
          if (destStudent) replyName = destStudent.name;
        }

        await runQuery(`
          INSERT INTO chat_messages (chatId, senderId, senderName, text, time)
          VALUES (?, 'bot_reply', ?, ?, 'Just now')
        `, [chatId, replyName, replyText]);
      } catch (e) {
        console.error('Error simulating bot reply:', e);
      }
    }, 1500);

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

app.post('/api/notifications/:id/accept', async (req, res) => {
  const notiId = req.params.id;
  const { studentId } = req.body;
  try {
    // Add user as UI/UX Consultant member to IoT Grid project (id p1)
    await runQuery(`
      INSERT INTO project_members (projectId, studentId, role)
      VALUES ('p1', ?, 'UI/UX Consultant')
    `, [studentId]);

    // Delete notification
    await runQuery("DELETE FROM notifications WHERE id = ?", [notiId]);

    // Increment user connections
    await runQuery("UPDATE students SET connections = connections + 1 WHERE id = ?", [studentId]);

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
