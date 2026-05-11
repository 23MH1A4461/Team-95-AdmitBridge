const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
const { authMiddleware } = require('./auth');

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }
  next();
};

// Get all students
router.get('/students', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all applications
router.get('/applications', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const applications = await Application.find().populate('studentId', 'email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all consultancies
router.get('/consultancies', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const consultancies = await User.find({ role: 'consultancy' }).select('-password');
    res.json(consultancies);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
