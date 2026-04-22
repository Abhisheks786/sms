const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  subject: { type: String }, // Optional, if they want subject-wise attendance
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
