const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'super_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: false
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Unrestricted File Upload Setup
const upload = multer({ dest: 'public/uploads/' });

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'infosec_grading'
});

// Middleware to expose session to templates (simulated)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ----------------------------------------------------------------------
// ENDPOINTS
// ----------------------------------------------------------------------



app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

   db.query('SELECT * FROM users WHERE username = ?', [username], ...);

    db.query(query, (err, results) => {
        
        if (err) {
            return res.status(500).send(`Database Error Processing Login: ${err.message}`);
        }

        if (results.length > 0) {
            req.session.user = {
                id: results[0].id,
                username: results[0].username,
                role: results[0].role
            };
            res.json({ success: true, message: 'Logged in successfully', role: results[0].role });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});


app.get('/api/courses/search', (req, res) => {
    const searchQuery = req.query.q;
    const sql = `SELECT DISTINCT course_name FROM grades WHERE course_name LIKE '%${searchQuery}%'`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err.message);

        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.send(`<h3>Search Results for Course: ${searchQuery}</h3> <ul>${results.map(r => `<li>${r.course_name}</li>`).join('')}</ul>`);
        }

        res.json({ query: searchQuery, results });
    });
});

app.get('/api/transcript', (req, res) => {
    
    const studentId = req.query.student_id || (req.session.user ? req.session.user.id : null);
    
    if (!studentId) return res.status(401).json({ error: 'Not logged in' });

    db.query(`SELECT course_name, grade, comments FROM grades WHERE student_id = ${studentId}`, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});


app.post('/api/profile/update', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.session.user.id;
    const { profile_bio, role } = req.body;

    let updates = `profile_bio = '${profile_bio}'`;
    if (role !== undefined) {
        updates += `, role = '${role}'`;
    }

    const sql = `UPDATE users SET ${updates} WHERE id = ${userId}`;
    
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(`Update Failed: ${err.stack}`);
        
        // Update session if role changed
        if (role) req.session.user.role = role;

        res.json({ success: true, message: 'Profile updated successfully' });
    });
});


app.post('/api/feedback', (req, res) => {
    
    const username = req.session.user ? req.session.user.username : 'Anonymous_Hacker';
    const { course_name, comment } = req.body;
    
    const sql = `INSERT INTO feedback (username, course_name, comment) VALUES ('${username}', '${course_name}', '${comment}')`;

    db.query(sql, (err) => {
        if (err) return res.status(500).send(err.message);
        res.json({ success: true, message: 'Feedback submitted!' });
    });
});

app.get('/api/feedback', (req, res) => {
    db.query('SELECT * FROM feedback ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

app.post('/api/system/diagnostics', (req, res) => {
    
    const host = req.body.host;

    exec(`ping -n 1 ${host}`, (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: false, output: stderr || error.message });
        }
        res.json({ success: true, output: stdout });
    });
});

app.post('/api/upload-submission', upload.single('document'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const newPath = path.join(__dirname, 'public/uploads', req.file.originalname);
    fs.renameSync(req.file.path, newPath);

    res.json({ success: true, message: 'Submission uploaded successfully.', path: `/uploads/${req.file.originalname}` });
});

app.get('/api/download-syllabus', (req, res) => {
    const filename = req.query.file;
    
    const filePath = path.join(__dirname, 'public/uploads', filename);

    res.download(filePath, (err) => {
        if (err) res.status(500).send(`File access error at: ${filePath}`);
    });
});

app.post('/api/curriculum/fetch', async (req, res) => {
    const targetUrl = req.body.url;
    try {
        
        const response = await axios.get(targetUrl);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching remote curriculum: ' + error.message);
    }
});

app.get('/api/redirect', (req, res) => {
    const targetUrl = req.query.continue;
    
    res.redirect(targetUrl);
});

app.get('/api/users/directory', (req, res) => {
    
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`[!] Grading Management System starting on http://localhost:${port}`);
    console.log('Ensure your XAMPP Apache and MySQL are running, and database is imported!');
});
