const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultancyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  studentName: String,
  email: String,
  phone: String,
  cgpa: Number,
  examType: String,
  examScore: Number,
  targetCountry: String,
  targetCourse: String,
  budget: Number,
  documents: {
    sop: { type: Boolean, default: false },
    lor: { type: Boolean, default: false },
    transcripts: { type: Boolean, default: false },
    passport: { type: Boolean, default: false }
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
