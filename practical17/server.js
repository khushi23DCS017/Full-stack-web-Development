// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tuitionDB';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

/* --- Student Schema --- */
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, min: 3, max: 120 },
  guardian: { type: String, trim: true },
  contact: { type: String, required: true, trim: true },
  className: { type: String, trim: true }, // class of student
  feesPaid: { type: Boolean, default: false },
  address: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

/* --- REST API routes --- */

/**
 * GET /api/students
 * optional query: ?page=1&limit=20
 */
app.get('/api/students', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 100);
    const skip = (page - 1) * limit;

    const students = await Student.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Student.countDocuments();
    res.json({ success: true, students, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/** GET single student */
app.get('/api/students/:id', async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, student: s });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Invalid id' });
  }
});

/** CREATE student */
app.post('/api/students', async (req, res) => {
  try {
    const { name, age, guardian, contact, className, feesPaid, address } = req.body;
    if (!name || !contact) return res.status(400).json({ success: false, error: 'Name and contact are required' });

    const st = new Student({
      name, age, guardian, contact, className, feesPaid: !!feesPaid, address
    });
    await st.save();
    res.status(201).json({ success: true, student: st });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Could not create student' });
  }
});

/** UPDATE student */
app.put('/api/students/:id', async (req, res) => {
  try {
    const updates = req.body;
    const s = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, student: s });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Update failed' });
  }
});

/** DELETE student */
app.delete('/api/students/:id', async (req, res) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, student: s });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Delete failed' });
  }
});

/* fallback to serve index.html for SPA-style usage (optional) */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* global error handler fallback */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
