/**
 * File: crm.js
 * Description: Auto-generated documentation for crm.js
 * Date: 2026-07-21
 */
const express = require('express');
const router = express.Router();
let contactsReady;
const ensureContacts=()=>contactsReady || (contactsReady=db.query("CREATE TABLE IF NOT EXISTS contact_messages (id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(120) NOT NULL,email VARCHAR(254) NOT NULL,message TEXT NOT NULL,status ENUM('NEW','READ','RESOLVED') NOT NULL DEFAULT 'NEW',created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)").catch(error=>{contactsReady=undefined;throw error;}));
const db = require('../config/db');
const {
  authenticate,
  requireAdmin
} = require('../middleware/auth');
const {
  asyncHandler
} = require('../middleware/errorHandler');

// POST /api/v1/crm/tickets - Customer creates a ticket
router.post('/tickets', authenticate, asyncHandler(async (req, res) => {
  const {
    subject,
    message
  } = req.body;
  if (!subject || !message) {
    return res.status(400).json({
      error: 'Subject and message are required'
    });
  }
  const [result] = await db.query('INSERT INTO support_tickets (user_id, subject, message) VALUES (?, ?, ?)', [req.user.id, subject, message]);
  res.status(201).json({
    message: 'Ticket created',
    ticket_id: result.insertId
  });
}));

// POST /api/v1/crm/contact - Public contact form submission
router.post('/contact', asyncHandler(async (req, res) => {
  const {
    name,
    email,
    message
  } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Name, email, and message are required'
    });
  }

  if(typeof name!=='string'||name.trim().length>120||typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof message!=='string'||message.trim().length>5000) return res.status(400).json({error:'Enter a valid name, email, and message under 5001 characters.'});
  await ensureContacts();
  await db.query('INSERT INTO contact_messages (name,email,message) VALUES (?,?,?)',[name.trim(),email.trim(),message.trim()]);
  res.status(200).json({
    message: 'Message received successfully. We will get back to you soon!'
  });
}));

router.get('/contacts',authenticate,requireAdmin,asyncHandler(async(req,res)=>{await ensureContacts();const [messages]=await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100');res.json({messages});}));
router.patch('/contacts/:id',authenticate,requireAdmin,asyncHandler(async(req,res)=>{if(!['NEW','READ','RESOLVED'].includes(req.body.status))return res.status(400).json({error:'Invalid message status.'});await ensureContacts();const [result]=await db.query('UPDATE contact_messages SET status=? WHERE id=?',[req.body.status,req.params.id]);if(!result.affectedRows)return res.status(404).json({error:'Message not found.'});res.json({message:'Message status updated.'});}));
// GET /api/v1/crm/tickets/me - Customer views their tickets
router.get('/tickets/me', authenticate, asyncHandler(async (req, res) => {
  const [tickets] = await db.query('SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(tickets);
}));

// GET /api/v1/crm/users - Admin lists all users with summary stats
router.get('/users', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [users] = await db.query(`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           COUNT(DISTINCT o.id) as total_orders,
           COALESCE(SUM(o.total), 0) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'CANCELLED'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);
  res.json(users);
}));

// GET /api/v1/crm/users/:id - Admin views a specific user profile
router.get('/users/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [[user]] = await db.query('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?', [req.params.id]);
  if (!user) return res.status(404).json({
    error: 'User not found'
  });
  const [[stats]] = await db.query(`
    SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as lifetime_value
    FROM orders WHERE user_id = ? AND status != 'CANCELLED'
  `, [req.params.id]);
  const [orders] = await db.query('SELECT id, status, total, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [req.params.id]);
  const [tickets] = await db.query('SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC', [req.params.id]);
  res.json({
    user,
    stats,
    recent_orders: orders,
    tickets
  });
}));

// GET /api/v1/crm/tickets - Admin views all tickets
router.get('/tickets', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [tickets] = await db.query(`
    SELECT t.*, u.name as user_name, u.email as user_email
    FROM support_tickets t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
  `);
  res.json(tickets);
}));

// PATCH /api/v1/crm/tickets/:id - Admin replies to / updates ticket
router.patch('/tickets/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const {
    status,
    admin_reply
  } = req.body;
  await db.query('UPDATE support_tickets SET status = COALESCE(?, status), admin_reply = COALESCE(?, admin_reply) WHERE id = ?', [status, admin_reply, req.params.id]);
  res.json({
    message: 'Ticket updated'
  });
}));

// GET /api/v1/crm/chat - Customer gets their chat history
router.get('/chat', authenticate, asyncHandler(async (req, res) => {
  const [messages] = await db.query('SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC', [req.user.id]);
  res.json(messages);
}));

// GET /api/v1/crm/chat/active - Admin lists users who have active chats
router.get('/chat/active', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [users] = await db.query(`
    SELECT DISTINCT u.id, u.name, u.email, u.avatar_url, MAX(c.created_at) as last_message
    FROM users u
    JOIN chat_messages c ON u.id = c.user_id
    GROUP BY u.id
    ORDER BY last_message DESC
  `);
  res.json(users);
}));

// GET /api/v1/crm/chat/:userId - Admin gets chat history for a user
router.get('/chat/:userId', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [messages] = await db.query('SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC', [req.params.userId]);
  res.json(messages);
}));
module.exports = router;