const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
let dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'inquiries.db');
try {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
} catch (err) {
  console.warn(`[WARN] Could not create database directory at ${dbPath}, falling back to local workspace.`);
  dbPath = path.join(__dirname, 'inquiries.db');
}
const db = new Database(dbPath);

// Create inquiries table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Create projects table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    role TEXT,
    status TEXT,
    description TEXT,
    link TEXT,
    tech_tags TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve cobe module for browser ESM import
app.get('/lib/cobe.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile('node_modules/cobe/dist/index.esm.js', { root: __dirname });
});

app.use(express.static(__dirname));

// POST contact inquiry
app.post('/api/inquiry', (req, res) => {
  const { name, email, message } = req.body;

  // Simple input validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  // Basic HTML sanitization to prevent XSS (Defensive Coding)
  const sanitize = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cleanName = sanitize(name.trim());
  const cleanEmail = sanitize(email.trim());
  const cleanMessage = sanitize(message.trim());

  try {
    const insert = db.prepare('INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)');
    const result = insert.run(cleanName, cleanEmail, cleanMessage);

    res.json({
      success: true,
      message: 'Inquiry saved to database.',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: 'Internal database error.' });
  }
});

const multer = require('multer');

// Configure upload path (supporting persistent storage volumes)
let uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, 'assets', 'projects');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn(`[WARN] Could not create upload directory at ${uploadDir}, falling back to local workspace.`);
  uploadDir = path.join(__dirname, 'assets', 'projects');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Serve uploaded files dynamically from the custom UPLOAD_PATH route
app.use('/assets/projects', express.static(uploadDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// API: Get all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at ASC').all();
    // Parse JSON arrays stored in tech_tags
    const parsedProjects = projects.map(p => ({
      ...p,
      tech_tags: p.tech_tags ? JSON.parse(p.tech_tags) : []
    }));
    res.json({ success: true, projects: parsedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to load projects.' });
  }
});

// API: Add a new project (Simple password protection)
app.post('/api/projects', upload.single('imageFile'), (req, res) => {
  const { password, type, title, role, status, description, link, tech_tags } = req.body;
  let image_url = '';

  if (req.file) {
    image_url = 'assets/projects/' + req.file.filename;
  }

  // Extremely simple auth for demo
  if (password !== 'nas-admin-2026') {
    return res.status(401).json({ success: false, error: 'Unauthorized. Invalid password.' });
  }

  if (!title || !type) {
    return res.status(400).json({ success: false, error: 'Title and Type are required.' });
  }

  try {
    const tagsJson = tech_tags ? JSON.stringify(tech_tags.split(',').map(t => t.trim())) : '[]';
    
    const insert = db.prepare(`
      INSERT INTO projects (type, title, role, status, description, link, tech_tags, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(type, title, role || '', status || '', description || '', link || '', tagsJson, image_url);
    res.json({ success: true, message: 'Project added successfully!', id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error inserting project:', error);
    res.status(500).json({ success: false, error: 'Failed to add project.' });
  }
});

// API: Delete a project
app.delete('/api/projects/:id', (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (password !== 'nas-admin-2026') {
    return res.status(401).json({ success: false, error: 'Unauthorized. Invalid password.' });
  }

  try {
    const del = db.prepare('DELETE FROM projects WHERE id = ?');
    const result = del.run(id);

    if (result.changes > 0) {
      res.json({ success: true, message: 'Project deleted successfully!' });
    } else {
      res.status(404).json({ success: false, error: 'Project not found.' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete project.' });
  }
});

// GET Admin dashboard to view inquiries
app.get('/admin/inquiries', (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();

    // Render a high-fidelity retro terminal dashboard directly
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NAS_CONSOLE // Submissions Database</title>
        <link rel="stylesheet" href="/css/styles.css">
        <style>
          body {
            background: #050505;
            color: #4ade80;
            font-family: 'JetBrains Mono', monospace;
            padding: 3rem;
            cursor: default;
          }
          .admin-container {
            max-width: 1200px;
            margin: 0 auto;
            border: 1px solid #33ff33;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(74, 222, 128, 0.15);
            background: #0a0a0a;
            overflow: hidden;
          }
          .admin-header {
            background: #111;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #33ff33;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .admin-title {
            font-size: 1rem;
            font-weight: bold;
            color: #d4af37;
            text-transform: uppercase;
            letter-spacing: 0.15em;
          }
          .admin-status {
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .admin-content {
            padding: 2rem;
          }
          .db-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1.5rem;
          }
          .db-table th, .db-table td {
            text-align: left;
            padding: 1rem;
            border: 1px solid #222;
          }
          .db-table th {
            background: #141414;
            color: #d4af37;
            font-size: 0.8rem;
            letter-spacing: 0.1em;
          }
          .db-table td {
            font-size: 0.85rem;
            color: #e0e0e0;
          }
          .db-table tr:hover td {
            background: #0f1c0f;
            color: #4ade80;
          }
          .no-records {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-size: 0.9rem;
          }
          .btn-back {
            display: inline-block;
            margin-top: 2rem;
            color: #0d0d0d;
            background: #d4af37;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            border: 1px solid #d4af37;
            transition: all 0.3s ease;
          }
          .btn-back:hover {
            background: transparent;
            color: #d4af37;
          }
        </style>
      </head>
      <body>
        <div class="admin-container">
          <div class="admin-header">
            <div class="admin-title">SYSTEM_CONSOLE // inquiries.db</div>
            <div class="admin-status">
              <span class="status-dot"></span>
              SECURE_DB_CONNECTED (WAL_MODE)
            </div>
          </div>
          <div class="admin-content">
            <h2>Recorded Contact Submissions</h2>
            <p>Database: sqlite3 // Table: inquiries // Storage: local disk</p>

            ${inquiries.length === 0 ? `
              <div class="no-records">
                [!] NO CORRESPONDENCE RECORDED IN DATABASE YET.
              </div>
            ` : `
              <table class="db-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TIMESTAMP</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>SPECIFICATIONS / MESSAGE</th>
                  </tr>
                </thead>
                <tbody>
                  ${inquiries.map(inq => `
                    <tr>
                      <td style="color: #d4af37;">#${inq.id}</td>
                      <td style="color: #888;">${inq.created_at}</td>
                      <td style="font-weight: bold;">${inq.name}</td>
                      <td><a href="mailto:${inq.email}" style="color: #4ade80; text-decoration: none;">${inq.email}</a></td>
                      <td>${inq.message}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}

            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
              <a href="/admin" class="btn-back">&lt; Project Upload Console</a>
              <a href="/" class="btn-back" style="background: transparent; color: #d4af37;">&lt; Back to Portfolio &gt;</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Console connection failed.');
  }
});

// GET Admin Dashboard for managing projects
app.get(['/admin', '/admin/projects', '/admin/nas-console-secret'], (req, res) => {
  res.sendFile('admin.html', { root: __dirname });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` NAS PORTFOLIO SERVER IS ONLINE`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Database: queries are logged to inquiries.db`);
  console.log(` Dashboard: http://localhost:${PORT}/admin/inquiries`);
  console.log(`==================================================\n`);
});
