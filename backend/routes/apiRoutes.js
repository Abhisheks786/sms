const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');

// --- ADMIN ROUTES ---
// Add a user (Teacher or Student)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- TEACHER ROUTES ---
// Get only students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark Attendance
router.post('/attendance', async (req, res) => {
  try {
    const { studentId, status, date } = req.body;
    const attendance = await Attendance.create({ student: studentId, status, date });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Marks
router.post('/marks', async (req, res) => {
  try {
    const { studentId, subject, score } = req.body;
    const mark = await Mark.create({ student: studentId, subject, score });
    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- STUDENT ROUTES ---
// Get own attendance
router.get('/attendance/:studentId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get own marks
router.get('/marks/:studentId', async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
