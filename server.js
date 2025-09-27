import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

dotenvConfig();
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));  

 
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: true } 
});

console.log("Attempting to connect to database...");
pool.getConnection()
    .then(conn => {
        console.log("✅ Database connected successfully!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ DATABASE CONNECTION FAILED:", err.message);
    });

 
app.get('/api/messages', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at ASC LIMIT 500');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

 
app.post('/api/messages', async (req, res) => {
    try {
        const { sender_name, content, is_anonymous, avatar_url } = req.body;
        if (!content || !sender_name) {
            return res.status(400).json({ error: 'Content and sender_name are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO messages (sender_name, content, is_anonymous, avatar_url) VALUES (?, ?, ?, ?)',
            [sender_name, content, is_anonymous ? 1 : 0, avatar_url]
        );

        
        const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
        const newMessage = rows[0];

        
        io.emit('new_message', newMessage);

        res.status(201).json(newMessage);
    } catch (err) {
        console.error('Error posting message:', err);
        res.status(500).json({ error: 'Database insert failed' });
    }
});

 
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

 
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));