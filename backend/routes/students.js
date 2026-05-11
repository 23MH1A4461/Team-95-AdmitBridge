const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { authMiddleware } = require('./auth');

// Create a new application
router.post('/applications', authMiddleware, async (req, res) => {
  try {
    const { consultancyName, studentName, email, phone, cgpa, examType, examScore, targetCountry, targetCourse, budget } = req.body;
    
    const newApplication = new Application({
      studentId: req.user.id,
      consultancyName,
      studentName,
      email,
      phone,
      cgpa,
      examType,
      examScore,
      targetCountry,
      targetCourse,
      budget
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications for a student
router.get('/applications/me', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications for a consultancy
router.get('/applications/consultancy/:name', authMiddleware, async (req, res) => {
  try {
    // In a real app, the consultancy name should match the user's profile, but for simplicity we filter by string
    if (req.user.role !== 'consultancy' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const applications = await Application.find({ consultancyName: req.params.name });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update application status
router.put('/applications/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'consultancy' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();
    
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
